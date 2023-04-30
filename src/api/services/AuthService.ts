import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  InternalServerError
} from '@helpers/AppError/ApiError';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import IUserRepository from '@interfaces/repository/IUserRepository';
import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import TYPES from '@ioc/TYPES';
import { randomBytes } from 'crypto';
import { inject, injectable } from 'inversify';
import IAuthService from '@interfaces/service/IAuthService';
import { userInput } from '@models/User';
import IActivityRepository from '@interfaces/repository/IActivityRepository';
import IRoleRepository from '@interfaces/repository/IRoleRepository';

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
    if (email) user = await this.userRepo.findUserByEmail(email);
    else if (userName) user = await this.userRepo.findByUsername(userName);
    else throw new BadRequestError('Please provide email or username');
    // If no user is registered with the provided email or username, throw an error.
    if (!user) throw new ForbiddenError('User not found');
    if (!user.password) throw new ForbiddenError('Missing user credentials');
    // validate plain text password with database saved password.
    const isValidPass = await this.authUtils.validatePassword(
      password,
      user.password
    );
    // If password is not valid, throw an error.
    if (!isValidPass) throw new AuthFailureError('Invalid Password');

    // Generate new access token and refresh token keys.
    const accessTokenKey = randomBytes(64).toString('hex');
    const refreshTokenKey = randomBytes(64).toString('hex');
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
      accessTokenKey,
      refreshTokenKey
    );
    // If tokens are not generated, throw an error.
    if (!tokens) throw new InternalServerError();
    // remove password and activities from user object.
    user.password = null;
    user.activities = null;
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
    // create new user.
    const user = await this.userRepo.createUser(userData);
    if (!user) throw new InternalServerError('Failed to create user');
    // create new activity for the user.
    const activity = await this.activityRepo.createActivity({
      userId: user.id
    });
    // create new role for the user.
    const role = await this.roleRepo.createRole({
      admin: true,
      user: true,
      userId: user.id
    });
    // set role and activity id in user table.
    this.userRepo.setRoleAndActivityId(user.id, role.id, activity.id);
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
}
