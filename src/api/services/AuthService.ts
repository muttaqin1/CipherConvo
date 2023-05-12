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
import ITwoFactorAuthTokenRepository from '@interfaces/repository/ITwoFactorAuthTokenRepository';
import { TokenType } from '@interfaces/models/ITwoFactorAuthToken';

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
    @inject(TYPES.AuthUtils) private readonly authUtils: IAuthUtils,
    @inject(TYPES.AuthTokenKeysRepository)
    private readonly authTokenKeysRepo: IAuthTokenKeysRepository,
    @inject(TYPES.ActivityRepository)
    private readonly activityRepo: IActivityRepository,
    @inject(TYPES.RoleRepository) private readonly roleRepo: IRoleRepository,
    @inject(TYPES.TwoFactorAuthTokenRepository)
    private readonly twoFactorAuthTokenRepo: ITwoFactorAuthTokenRepository
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
    if (!user.password || !user.roles || !user.activities)
      throw new ForbiddenError('Missing user credentials');
    // If the account is permanently restricted, throw an error.
    if (user.activities.permanentAccessRestricted)
      throw new ForbiddenError(
        'Account permanently banned. Contact support for more information.'
      );
    // If the account access restricted, throw an error.
    if (user.activities.accessRestricted)
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
    return {
      user: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      roles: user.roles,
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

  public async logout(user: UserIncludedRolesAndActivities): Promise<void> {
    try {
      await this.authTokenKeysRepo.deleteKeys(user.id);
    } catch {
      throw new InternalServerError('logout fail');
    }
  }

  public async refreshTokens(req: Request): Promise<IToken> {
    const { refreshToken } = req.body;
    // decode the access token even if it is expired.
    const accessTokenPayload = await this.authUtils.decodeAccessToken(req);
    // find the user with the id provided in the access token.
    const user = await this.userRepo.findUserById(accessTokenPayload.id, {
      role: true
    });
    if (!user) throw new ForbiddenError('User not found');
    // verify the refresh token.
    const refreshTokenPayload = await this.authUtils.verifyRefreshToken(
      refreshToken
    );
    if (
      accessTokenPayload.id !== refreshTokenPayload.id ||
      accessTokenPayload.sub !== refreshTokenPayload.sub
    )
      throw new AuthFailureError('Invalid Token');
    // check if the keys are already stored in database if stored delete them.
    const authTokenKeys = await this.authTokenKeysRepo.findKeys({
      userId: user.id,
      accessTokenKey: accessTokenPayload.accessTokenKey as string,
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
    return tokens;
  }

  public async verifyVerificationToken(token: string): Promise<{
    emailVerified?: boolean;
    accountVerified?: boolean;
    tokenId?: string;
  }> {
    const tokenData = await this.twoFactorAuthTokenRepo.findTokenByToken(token);
    if (!tokenData) throw new BadRequestError('Invalid Token');
    const user = await this.userRepo.findUserById(tokenData.userId, {
      activity: true
    });
    if (!user) throw new BadRequestError('Invalid Token');
    if (!user.activities) throw new ForbiddenError();
    if (
      tokenData.tokenType === TokenType.VERIFY_ACCOUNT &&
      !user.activities.accessRestricted
    )
      throw new BadRequestError('Account already verified');
    if (
      user.activities.emailVerified &&
      tokenData.tokenType === TokenType.VERIFY_EMAIL
    )
      throw new BadRequestError('Email already verified');
    if (tokenData.tokenType === TokenType.VERIFY_EMAIL) {
      await this.activityRepo.updateActivity(user.id, { emailVerified: true });
      await this.twoFactorAuthTokenRepo.deleteToken(user.id);
      return {
        emailVerified: true
      };
    }
    if (tokenData.tokenType === TokenType.VERIFY_ACCOUNT) {
      await this.activityRepo.updateActivity(user.id, {
        accessRestricted: false
      });
      await this.twoFactorAuthTokenRepo.deleteToken(user.id);
      return {
        accountVerified: true
      };
    }
    if (tokenData.tokenType === TokenType.RESET_PASSWORD) {
      await this.twoFactorAuthTokenRepo.verifyToken(token);
      return {
        tokenId: tokenData.id
      };
    }
    throw new ForbiddenError();
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const tokenData = await this.twoFactorAuthTokenRepo.findTokenById(token);
    if (!tokenData) throw new BadRequestError('Invalid Token');
    const user = await this.userRepo.findUserById(tokenData.userId);
    if (!user) throw new BadRequestError('Invalid Token');
    if (tokenData.tokenType !== TokenType.RESET_PASSWORD)
      throw new ForbiddenError();
    const hashedPassword = await this.authUtils.generatePassword(
      newPassword as Password
    );
    await this.userRepo.updateUser(user.id, { password: hashedPassword });
    await this.twoFactorAuthTokenRepo.deleteToken(user.id);
    await this.authTokenKeysRepo.deleteKeys(user.id);
  }

  public async changePassword(
    user: UserIncludedRolesAndActivities,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!user.password || !user.activities) throw new ForbiddenError();
    const bool = this.authUtils.validatePassword(oldPassword, user.password);
    if (!bool) throw new BadRequestError('Invalid Password');
    const genNewPass = await this.authUtils.generatePassword(newPassword);
    await this.userRepo.updateUser(user.id, {
      password: genNewPass
    });
  }
}
