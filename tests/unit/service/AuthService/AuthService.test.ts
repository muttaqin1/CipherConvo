import 'reflect-metadata';
import AuthService from '../../../../src/api/services/AuthService';
import MockAuthUtils, {
  MockGeneratePassword,
  MockGenerateTokens,
  MockValidatePassword
} from './MockAuthUtils';
import MockUserRepository, {
  MockCreateUser,
  MockFindByUsername,
  MockFindUserByEmail
} from './MockUserRepository';
import MockAuthTokenKeysRepository, {
  MockCreateKeys,
  MockDeleteKeys,
  MockFindKeys
} from './MockAuthTokenKeysRepository';
import MockActivityRepository, {
  MockCreateActivity,
  MockUpdateActivity
} from './MockActivityRepository';
import MockRoleRepository, { MockCreateRole } from './MockRoleRepository';
import IUser from '../../../../src/interfaces/models/IUser';
import IRole from '../../../../src/interfaces/models/IRole';
import IActivity from '../../../../src/interfaces/models/IActivity';
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  InternalServerError
} from '../../../../src/helpers/AppError/ApiError';
import BaseError from '../../../../src/helpers/AppError/BaseError';
import { errorStatusCodes } from '../../../../src/helpers/AppError/errorStatusCodes';
import errorMessages from '../../../../src/helpers/AppError/errorMessages';
import { loginResponse } from '../../../../src/interfaces/response/authContollerResponse';

let authService: AuthService;

export const userData: Required<IUser> = {
  id: '111',
  userName: 'muttaqin1',
  firstName: 'muttaqin',
  lastName: 'muhammad',
  email: 'muttaqin@gmail.com',
  password: 'muttaqin:muttaqin',
  gender: 'male',
  avatar: 'avatar',
  createdAt: new Date(),
  updatedAt: new Date()
};
export const roleData: Required<IRole> = {
  id: '222',
  userId: '111',
  admin: false,
  user: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const activityData: IActivity = {
  id: '333',
  userId: '111',
  failedLoginAttempts: 0,
  emailVerified: true,
  accessRestricted: false,
  accessRestrictedUntil: undefined,
  permanentAccessRestricted: false,
  sendedTwoFactorAuthCodeCount: 0,
  twoFactorAuthRestricted: false,
  twoFactorAuthRestrictedUntil: undefined,
  createdAt: new Date(),
  updatedAt: new Date()
};
describe('Class: AuthService', () => {
  beforeEach(() => {
    authService = new AuthService(
      new MockUserRepository() as any,
      new MockAuthUtils() as any,
      new MockAuthTokenKeysRepository() as any,
      new MockActivityRepository() as any,
      new MockRoleRepository() as any
    );
  });
  describe('Method: login', () => {
    beforeEach(() => {
      MockFindUserByEmail.mockClear();
      MockValidatePassword.mockClear();
      MockUpdateActivity.mockClear();
      MockDeleteKeys.mockClear();
      MockFindKeys.mockClear();
      MockCreateKeys.mockClear();
      MockGenerateTokens.mockClear();
    });

    it('should throw a ForbiddenError error if email or userName is not provided.', async () => {
      try {
        await authService.login({
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect((error as BaseError).message).toBe(
          'Please provide email or username'
        );
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
    });

    it('should throw a ForbiddenError if no user is registered with the provided email.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe('User not found');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should throw a ForbiddenError if password is missing from user object.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({ ...userData, password: null })
      );
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe('Missing user credentials');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should throw a ForbiddenError if role is missing from user object.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe('Missing user credentials');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should throw a ForbiddenError if user access is permanently restricted.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: { ...activityData, permanentAccessRestricted: true }
        })
      );
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe(
          'Account permanently banned. Contact support for more information.'
        );
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should throw a ForbiddenError if user access is restricted.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: { ...activityData, accessRestricted: true }
        })
      );
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe(
          'Access restricted. Verify yourself to continue.'
        );
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should throw a ForbiddenError if user activity does not exist.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData
        })
      );
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as BaseError).message).toBe('Missing user credentials');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.FORBIDDEN
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
      }
    });
    it('should increment failed login attempts before throwing a AuthFailureError.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: activityData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(false));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
        expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
          failedLoginAttempts: 1
        });

        expect(error).toBeInstanceOf(AuthFailureError);
        expect((error as BaseError).message).toBe('Invalid Password');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
        expect(MockValidatePassword).toHaveBeenCalledTimes(1);
        expect(MockValidatePassword).toHaveBeenCalledWith(
          'test',
          userData.password
        );
      }
    });
    it('should restrict account access if failed login attempts is greater than 8 and throw AuthFailureError.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: { ...activityData, failedLoginAttempts: 8 }
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(false));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
        expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
          accessRestricted: true,
          failedLoginAttempts: 0
        });
        expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
        expect(MockDeleteKeys).toHaveBeenCalledWith(userData.id);
        expect(error).toBeInstanceOf(AuthFailureError);
        expect((error as BaseError).message).toBe('Invalid Password');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
        expect(MockValidatePassword).toHaveBeenCalledTimes(1);
        expect(MockValidatePassword).toHaveBeenCalledWith(
          'test',
          userData.password
        );
      }
    });
    it('should clear failedLoginAttempts on successful login.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
        expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
          failedLoginAttempts: 0
        });
        expect(MockValidatePassword).toHaveBeenCalledTimes(1);
        expect(MockValidatePassword).toHaveBeenCalledWith(
          'test',
          userData.password
        );
      }
    });
    it('should delete authTokenKeys if exists', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockFindKeys.mockImplementation(() => Promise.resolve({ data: 'data' }));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
        expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
          failedLoginAttempts: 0
        });
        expect(MockFindKeys).toHaveBeenCalledTimes(1);
        expect(MockFindKeys).toHaveBeenCalledWith({ userId: userData.id });
        expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
        expect(MockDeleteKeys).toHaveBeenCalledWith(userData.id);
      }
    });
    it('should create authTokenKeys.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockFindKeys.mockImplementation(() => Promise.resolve(null));

      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockCreateKeys).toHaveBeenCalledTimes(1);
        expect(MockCreateKeys).toHaveBeenCalledWith({
          userId: userData.id,
          accessTokenKey: expect.any(String),
          refreshTokenKey: expect.any(String)
        });
      }
    });
    it('should throw a InternalServerError if no keys are created.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockFindKeys.mockImplementation(() => Promise.resolve(null));
      MockCreateKeys.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.login({
          email: 'test@gmail.com',
          password: 'test'
        });
      } catch (error) {
        expect(MockCreateKeys).toHaveBeenCalledTimes(1);
        expect(MockCreateKeys).toHaveBeenCalledWith({
          userId: userData.id,
          accessTokenKey: expect.any(String),
          refreshTokenKey: expect.any(String)
        });
        expect(error).toBeInstanceOf(InternalServerError);
        expect((error as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
    it('should generate access and refresh tokens.', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockFindKeys.mockImplementation(() => Promise.resolve(null));
      MockCreateKeys.mockImplementation(() => Promise.resolve(true));
      MockGenerateTokens.mockReturnValue(
        Promise.resolve({ accessToken: 'token', refreshToken: 'token' })
      );
      await authService.login({
        email: 'test@gmail.com',
        password: 'test'
      });
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledWith(
        expect.any(Object),
        roleData,
        expect.any(String),
        expect.any(String)
      );
    });
    it('should return login response', async () => {
      MockFindUserByEmail.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          roles: roleData,
          activities: userData
        })
      );
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockFindKeys.mockImplementation(() => Promise.resolve(null));
      MockCreateKeys.mockImplementation(() => Promise.resolve(true));
      MockGenerateTokens.mockReturnValue(
        Promise.resolve({ accessToken: 'token', refreshToken: 'token' })
      );
      const response = await authService.login({
        email: 'test@gmail.com',
        password: 'test'
      });
      expect(response).toStrictEqual<loginResponse>({
        user: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userName: userData.userName,
          gender: userData.gender,
          email: userData.email,
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt
        },
        roles: roleData,
        tokens: {
          accessToken: 'token',
          refreshToken: 'token'
        }
      });
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
        failedLoginAttempts: 0
      });
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledWith(
        expect.any(Object),
        roleData,
        expect.any(String),
        expect.any(String)
      );
    });
  });
  describe('Method: signup', () => {
    beforeEach(() => {
      MockFindUserByEmail.mockClear();
      MockFindByUsername.mockClear();
      MockCreateUser.mockClear();
      MockCreateActivity.mockClear();
      MockGeneratePassword.mockClear();
      MockCreateRole.mockClear();
      MockCreateKeys.mockClear();
      MockGenerateTokens.mockClear();
    });
    it('should throw a BadRequestError if user already exists with the provided email.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.signup(userData);
      } catch (e) {
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith(
          userData.email,
          undefined
        );
        expect(e).toBeInstanceOf(BadRequestError);
        expect((e as BaseError).message).toBe(
          'User already exists with this email'
        );
        expect((e as BaseError).statusCode).toBe(errorStatusCodes.BAD_REQUEST);
      }
    });
    it('should throw a BadRequestError if user already exists with the provided userName.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.signup(userData);
      } catch (e) {
        expect(MockFindByUsername).toHaveBeenCalledTimes(1);
        expect(MockFindByUsername).toHaveBeenCalledWith(
          userData.userName,
          undefined
        );
        expect(e).toBeInstanceOf(BadRequestError);
        expect((e as BaseError).message).toBe('Username already exists');
        expect((e as BaseError).statusCode).toBe(errorStatusCodes.BAD_REQUEST);
      }
    });
    it('should generate a hashed password.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      try {
        await authService.signup(userData);
      } catch {
        expect(MockGeneratePassword).toHaveBeenCalledTimes(1);
        expect(MockGeneratePassword).toHaveBeenCalledWith(
          userData.password,
          undefined
        );
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindByUsername).toHaveBeenCalledTimes(1);

        expect(MockFindByUsername).toHaveBeenCalledWith(
          userData.userName,
          undefined
        );
      }
    });
    it('should create a user.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(true));
      try {
        await authService.signup(userData);
      } catch {
        expect(MockCreateUser).toBeCalledTimes(1);
        expect(MockCreateUser).toBeCalledWith({
          ...userData,
          password: 'hashedPassword'
        });
      }
    });
    it('should throw a InternalServerError if userData is falsy.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(false));
      try {
        await authService.signup(userData);
      } catch (err) {
        expect(MockCreateUser).toBeCalledTimes(1);
        expect(MockCreateUser).toBeCalledWith({
          ...userData,
          password: 'hashedPassword'
        });
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe('Failed to create user');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
    it('should create a activity.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));

      try {
        await authService.signup(userData);
      } catch (err) {
        console.log(err);
        expect(MockCreateActivity).toBeCalledTimes(1);
        expect(MockCreateActivity).toBeCalledWith({
          userId: userData.id
        });
      }
    });
    it('should create role.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.signup(userData);
      } catch {
        expect(MockCreateRole).toBeCalledTimes(1);
        expect(MockCreateRole).toBeCalledWith({
          userId: userData.id,
          admin: false,
          user: true
        });
      }
    });
    it('should create auth token keys keys', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.signup(userData);
      } catch (err) {
        expect(MockCreateKeys).toBeCalledTimes(1);
        expect(MockCreateKeys).toBeCalledWith({
          userId: userData.id,
          accessTokenKey: expect.any(String),
          refreshTokenKey: expect.any(String)
        });
      }
    });
    it('should throw InternalServerError if no record is returned from authTokenKeysRepo.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      MockCreateKeys.mockReturnValue(Promise.resolve(null));
      try {
        await authService.signup(userData);
      } catch (err) {
        expect(MockCreateKeys).toBeCalledTimes(1);
        expect(MockCreateKeys).toBeCalledWith({
          userId: userData.id,
          accessTokenKey: expect.any(String),
          refreshTokenKey: expect.any(String)
        });
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
    it('should generate access and refresh token.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      MockCreateRole.mockImplementation(() => Promise.resolve(roleData));
      MockCreateKeys.mockReturnValue(Promise.resolve({ keys: 'keys' }));
      try {
        await authService.signup(userData);
      } catch {
        expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
        expect(MockGenerateTokens).toHaveBeenCalledWith(
          userData,
          roleData,
          expect.any(String),
          expect.any(String)
        );
      }
    });
    it('should throw a InternalServerError if no token is returned from generateToken method.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      MockCreateKeys.mockReturnValue(Promise.resolve({ keys: 'keys' }));
      MockCreateRole.mockImplementation(() => Promise.resolve(roleData));
      MockGenerateTokens.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.signup(userData);
      } catch (err) {
        expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
        expect(MockGenerateTokens).toHaveBeenCalledWith(
          userData,
          roleData,
          expect.any(String),
          expect.any(String)
        );
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
    it('should return valid signup response', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      MockCreateKeys.mockReturnValue(Promise.resolve({ keys: 'keys' }));
      MockCreateRole.mockImplementation(() => Promise.resolve(roleData));
      MockGenerateTokens.mockImplementation(() =>
        Promise.resolve({ accessToken: 'token', refreshToken: 'token' })
      );
      const response = await authService.signup(userData);
      expect(response).toStrictEqual({
        user: userData,
        role: roleData,
        tokens: {
          accessToken: 'token',
          refreshToken: 'token'
        }
      });
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindByUsername).toHaveReturnedTimes(1);
      expect(MockGeneratePassword).toHaveBeenCalledTimes(1);
      expect(MockCreateUser).toHaveReturnedTimes(1);
      expect(MockCreateUser).toHaveBeenCalledTimes(1);
      expect(MockCreateRole).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
    });
  });
});
