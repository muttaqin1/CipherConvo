import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  InternalServerError
} from '@helpers/AppError/ApiError';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import IUserRepository, {
  UserIncludedRolesAndActivities
} from '@interfaces/repository/IUserRepository';
import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import IToken from '@interfaces/auth/IToken';
import TYPES from '@ioc/TYPES';
import { randomBytes } from 'crypto';
import { inject, injectable } from 'inversify';
import IAuthService from '@interfaces/service/IAuthService';
import { userInput } from '@models/User';
import IActivityRepository from '@interfaces/repository/IActivityRepository';
import IRoleRepository from '@interfaces/repository/IRoleRepository';
import { Password } from '@interfaces/models/IUser';
import { Request } from 'express';
import IRole from '@interfaces/models/IRole';

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TYPES.AuthUtils) private readonly authUtils: IAuthUtils,
    @inject(TYPES.AuthTokenKeysRepository)
    private readonly authTokenKeysRepo: IAuthTokenKeysRepository,
    @inject(TYPES.ActivityRepository)
    private readonly activityRepo: IActivityRepository,
    @inject(TYPES.RoleRepository) private readonly roleRepo: IRoleRepository
  ) {}

  public async login(loginCredentials: {
    userName?: string;
    email?: string;
    password: string;
  }): Promise<loginResponse> {
    const { userName, email, password } = loginCredentials;
    let user;
    // check if the user is registered with the provided email or username.
    if (email)
      user = await this.userRepo.findUserByEmail(email, {
        role: true,
        activity: true
      });
    else if (userName)
      user = await this.userRepo.findByUsername(userName, {
        role: true,
        activity: true
      });
    else throw new BadRequestError('Please provide email or username');
    // If no user is registered with the provided email or username, throw an error.
    if (!user) throw new ForbiddenError('User not found');
    if (!user.password) throw new ForbiddenError('Missing user credentials');
    if (!user.roles) throw new ForbiddenError('Missing user credentials');
    // If the account is permanently restricted, throw an error.
    if (user.activities && user.activities.permanentAccessRestricted)
      throw new ForbiddenError(
        'Account permanently banned. Contact support for more information.'
      );
    // If the account access restricted, throw an error.
    if (user.activities && user.activities.accessRestricted)
      throw new ForbiddenError(
        'Access restricted. Verify yourself to continue.'
      );
    // validate plain text password with database saved password.
    const isValidPass = await this.authUtils.validatePassword(
      password,
      user.password
    );
    // If password is not valid, throw an error.
    if (!isValidPass) {
      if (!user.activities) throw new ForbiddenError();
      // If the failed login attempts count is greater or equal to 8 restrict the account.
      if (user.activities.failedLoginAttempts >= 8) {
        // restrict the account.
        await this.activityRepo.updateActivity(user.id, {
          accessRestricted: true,
          failedLoginAttempts: 0
        });
        // Remove the user's auth token keys.
        await this.authTokenKeysRepo.deleteKeys(user.id);
      }
      // Increment failed login count by 1.
      else
        await this.activityRepo.updateActivity(user.id, {
          failedLoginAttempts: user.activities.failedLoginAttempts + 1
        });

      throw new AuthFailureError('Invalid Password');
    }
    // If login success clear the failed login attempts.
    await this.activityRepo.updateActivity(user.id, {
      failedLoginAttempts: 0
    });

    // Generate new access token and refresh token keys.
    const accessTokenKey = randomBytes(64).toString('hex');
    const refreshTokenKey = randomBytes(64).toString('hex');
    // check if the keys are already stored in database if stored delete them.
    const exists = await this.authTokenKeysRepo.findKeys({ userId: user.id });
    if (exists) await this.authTokenKeysRepo.deleteKeys(user.id);
    // store the keys in database. this keys are used to verify the tokens. this keys will be stored in tokens. so when we want to validate the token we will match the keys with the database stored keys.
    const keys = await this.authTokenKeysRepo.createKeys({
      userId: user.id,
      accessTokenKey,
      refreshTokenKey
    });
    if (!keys) throw new InternalServerError();
    // generating access token and refresh token.
    const tokens = await this.authUtils.generateTokens(
      user,
      user.roles,
      accessTokenKey,
      refreshTokenKey
    );
    // If tokens are not generated, throw an error.
    if (!tokens) throw new InternalServerError();
    // remove password and activities from user object.
    user.activities = undefined;
    user.password = null;
    return {
      user,
      tokens
    };
  }

  public async signup(userData: userInput): Promise<singupResponse> {
    // check if the user is registered with the provided email.
    const userEmail = await this.userRepo.findUserByEmail(userData.email);
    if (userEmail)
      throw new BadRequestError('User already exists with this email');
    // check if the user is registered with the provided username.
    const userName = await this.userRepo.findByUsername(userData.userName);
    if (userName) throw new BadRequestError('Username already exists');
    // hash the password.
    const hashedPassword = await this.authUtils.generatePassword(
      userData.password as Password
    );
    // create new user.
    const user = await this.userRepo.createUser({
      ...userData,
      password: hashedPassword as Password
    });
    if (!user) throw new InternalServerError('Failed to create user');
    // create new activity for the user.
    await this.activityRepo.createActivity({
      userId: user.id
    });
    // create new role for the user.
    const role = await this.roleRepo.createRole({
      userId: user.id,
      admin: false,
      user: true
    });
    // Generate new access token and refresh token keys.
    const accessTokenKey = randomBytes(64).toString('hex');
    const refreshTokenKey = randomBytes(64).toString('hex');
    // store the keys in database.
    const keys = await this.authTokenKeysRepo.createKeys({
      userId: user.id,
      accessTokenKey,
      refreshTokenKey
    });
    if (!keys) throw new InternalServerError();
    // generating access token and refresh token.
    const tokens = await this.authUtils.generateTokens(
      user,
      role,
      accessTokenKey,
      refreshTokenKey
    );
    // If tokens are not generated, throw an error.
    if (!tokens) throw new InternalServerError();
    // remove password and from user object.
    user.password = null;
    return {
      user,
      role,
      tokens
    };
  }

  public async logout(user: UserIncludedRolesAndActivities): Promise<boolean> {
    try {
      await this.authTokenKeysRepo.deleteKeys(user.id);
      return true;
    } catch {
      return false;
    }
  }

  public async refreshAccessToken(req: Request): Promise<IToken> {
    const { refreshToken } = req.body;
    // decode the access token even if it is expired.
    const accessTokenPayload = await this.authUtils.decodeAccessToken(req);
    if (!accessTokenPayload) throw new AuthFailureError('Invalid Token');
    // find the user with the id provided in the access token.
    const user = await this.userRepo.findUserById(accessTokenPayload.id, {
      role: true
    });
    if (!user) throw new ForbiddenError('User not found');
    // verify the refresh token.
    const refreshTokenPayload = await this.authUtils.verifyRefreshToken(
      refreshToken
    );
    if (!refreshTokenPayload) throw new AuthFailureError('Invalid Token');
    if (
      accessTokenPayload.id !== refreshTokenPayload.id ||
      accessTokenPayload.sub !== refreshTokenPayload.sub
    )
      throw new AuthFailureError('Invalid Token');
    // check if the keys are already stored in database if stored delete them.
    const authTokenKeys = await this.authTokenKeysRepo.findKeys({
      userId: user.id,
      accessTokenKey: refreshTokenPayload.accessTokenKey as string,
      refreshTokenKey: refreshTokenPayload.refreshTokenKey as string
    });
    if (!authTokenKeys) throw new AuthFailureError('Invalid Token');
    // Delete the keys from database.
    await this.authTokenKeysRepo.deleteKeys(user.id);
    // Generate new access token and refresh token keys.
    const accessTokenKey = randomBytes(64).toString('hex');
    const refreshTokenKey = randomBytes(64).toString('hex');
    // store the keys in database.
    const keys = await this.authTokenKeysRepo.createKeys({
      userId: user.id,
      accessTokenKey,
      refreshTokenKey
    });
    if (!keys) throw new InternalServerError();
    // generating access token and refresh token.
    const tokens = await this.authUtils.generateTokens(
      user,
      user.roles as Required<IRole>,
      accessTokenKey,
      refreshTokenKey
    );
    // If tokens are not generated, throw an error.
    if (!tokens) throw new InternalServerError();
    return tokens;
  }
}
