import 'reflect-metadata';
import AuthService from '../../../../src/api/services/AuthService';
import MockAuthUtils, {
  MockDecodeAccessToken,
  MockGeneratePassword,
  MockGenerateTokens,
  MockValidatePassword,
  MockVerifyRefreshToken
} from './MockAuthUtils';
import MockUserRepository, {
  MockCreateUser,
  MockFindByUsername,
  MockFindUserByEmail,
  MockFindUserById,
  MockUpdateUser
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
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
  InternalServerError
} from '../../../../src/helpers/AppError/ApiError';
import BaseError from '../../../../src/helpers/AppError/BaseError';
import { errorStatusCodes } from '../../../../src/helpers/AppError/errorStatusCodes';
import errorMessages from '../../../../src/helpers/AppError/errorMessages';
import MockTwoFactorAuthTokenRepository, {
  MockDeleteToken,
  MockFindTokenById,
  MockFindTokenByToken,
  MockVerifyToken
} from './MockTwoFactorAuthTokenRepository';
import { Request } from 'express';
import userData from '../../../utils/userData';
import roleData from '../../../utils/roleData';
import activityData from '../../../utils/activityData';
let authService: AuthService;

describe('Class: AuthService', () => {
  beforeEach(() => {
    authService = new AuthService(
      new MockUserRepository() as any,
      new MockAuthUtils() as any,
      new MockAuthTokenKeysRepository() as any,
      new MockActivityRepository() as any,
      new MockRoleRepository() as any,
      new MockTwoFactorAuthTokenRepository() as any
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
        role: true,
        activity: true
      });
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
        expect(error).toBeInstanceOf(AuthFailureError);
        expect((error as BaseError).message).toBe('Invalid Password');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
      }
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
        failedLoginAttempts: 1
      });
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      expect(MockValidatePassword).toHaveBeenCalledWith(
        'test',
        userData.password
      );
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
        expect(error).toBeInstanceOf(AuthFailureError);
        expect((error as BaseError).message).toBe('Invalid Password');
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
      }
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
        accessRestricted: true,
        failedLoginAttempts: 0
      });
      expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
      expect(MockDeleteKeys).toHaveBeenCalledWith(userData.id);
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      expect(MockValidatePassword).toHaveBeenCalledWith(
        'test',
        userData.password
      );
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
      await expect(
        authService.login({
          email: 'test@gmail.com',
          password: 'test'
        })
      ).rejects.toThrowError();
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
        failedLoginAttempts: 0
      });
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      expect(MockValidatePassword).toHaveBeenCalledWith(
        'test',
        userData.password
      );
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
      await expect(
        authService.login({
          email: 'test@gmail.com',
          password: 'test'
        })
      ).rejects.toThrowError();
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith(userData.id, {
        failedLoginAttempts: 0
      });
      expect(MockFindKeys).toHaveBeenCalledTimes(1);
      expect(MockFindKeys).toHaveBeenCalledWith({ userId: userData.id });
      expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
      expect(MockDeleteKeys).toHaveBeenCalledWith(userData.id);
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

      await expect(
        authService.login({
          email: 'test@gmail.com',
          password: 'test'
        })
      ).rejects.toThrowError();
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
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
        expect(error).toBeInstanceOf(InternalServerError);
        expect((error as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((error as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
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
      expect(response).toStrictEqual({
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
        expect(e).toBeInstanceOf(BadRequestError);
        expect((e as BaseError).message).toBe(
          'User already exists with this email'
        );
        expect((e as BaseError).statusCode).toBe(errorStatusCodes.BAD_REQUEST);
      }
      expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
      expect(MockFindUserByEmail).toHaveBeenCalledWith(
        userData.email,
        undefined
      );
    });
    it('should throw a BadRequestError if user already exists with the provided userName.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(userData));
      try {
        await authService.signup(userData);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestError);
        expect((e as BaseError).message).toBe('Username already exists');
        expect((e as BaseError).statusCode).toBe(errorStatusCodes.BAD_REQUEST);
      }
      expect(MockFindByUsername).toHaveBeenCalledTimes(1);
      expect(MockFindByUsername).toHaveBeenCalledWith(
        userData.userName,
        undefined
      );
    });
    it('should create a user.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(true));
      await expect(authService.signup(userData)).rejects.toThrowError();
      expect(MockCreateUser).toBeCalledTimes(1);
      expect(MockCreateUser).toBeCalledWith({
        ...userData,
        password: 'hashedPassword'
      });
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
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe('Failed to create user');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      expect(MockCreateUser).toBeCalledTimes(1);
      expect(MockCreateUser).toBeCalledWith({
        ...userData,
        password: 'hashedPassword'
      });
    });
    it('should create a activity.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      await authService.signup(userData);
      expect(MockCreateActivity).toBeCalledTimes(1);
      expect(MockCreateActivity).toBeCalledWith({
        userId: userData.id
      });
    });
    it('should create role.', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      await authService.signup(userData);
      expect(MockCreateRole).toBeCalledTimes(1);
      expect(MockCreateRole).toBeCalledWith({
        userId: userData.id,
        admin: false,
        user: true
      });
    });
    it('should create auth token keys keys', async () => {
      MockFindUserByEmail.mockImplementation(() => Promise.resolve(null));
      MockFindByUsername.mockImplementation(() => Promise.resolve(null));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockCreateUser.mockImplementation(() => Promise.resolve(userData));
      await authService.signup(userData);
      expect(MockCreateKeys).toBeCalledTimes(1);
      expect(MockCreateKeys).toBeCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
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
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      expect(MockCreateKeys).toBeCalledTimes(1);
      expect(MockCreateKeys).toBeCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
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
      await authService.signup(userData);
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledWith(
        userData,
        roleData,
        expect.any(String),
        expect.any(String)
      );
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
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledWith(
        userData,
        roleData,
        expect.any(String),
        expect.any(String)
      );
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
  describe('Method: logout', () => {
    beforeEach(() => {
      MockDeleteKeys.mockClear();
    });
    it('should call deleteKeys method with correct params.', async () => {
      await expect(authService.logout(userData)).resolves.toBeUndefined();
      expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
      expect(MockDeleteKeys).toHaveBeenCalledWith(userData.id);
    });
    it('should throw InternalServerError if deleteKeys method throws.', async () => {
      MockDeleteKeys.mockImplementation(() => Promise.reject());
      try {
        await authService.logout(userData);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe('logout fail');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
  });

  describe('Method: refreshTokens', () => {
    beforeEach(() => {
      MockDecodeAccessToken.mockClear();
      MockFindUserById.mockClear();
      MockVerifyRefreshToken.mockClear();
      MockFindKeys.mockClear();
      MockDeleteKeys.mockClear();
      MockCreateKeys.mockClear();
      MockGenerateTokens.mockClear();
    });

    it('should decode the access token even if it is expired.', async () => {
      await expect(
        authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },

          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request)
      ).rejects.toThrowError();
      expect(MockDecodeAccessToken).toHaveBeenCalledTimes(1);
    });
    it('should find the user by using the user id.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id' };
      });
      await expect(
        authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },

          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request)
      ).rejects.toThrowError();
      expect(MockDecodeAccessToken).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('id', { role: true });
    });
    it('should throw a ForbiddenError if no user is found.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },

          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
        expect((err as BaseError).message).toBe('User not found');
        expect((err as BaseError).statusCode).toBe(errorStatusCodes.FORBIDDEN);
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('id', { role: true });
    });
    it('should verify the refresh token.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve({ id: 'id' }));
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id' })
      );
      await expect(
        authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },
          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request)
      ).rejects.toThrowError();
      expect(MockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(MockVerifyRefreshToken).toHaveBeenCalledWith('refresh-token');
    });
    it('should throw a AuthFailureError if id and sub doesnt mathch.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: '', sub: '' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve({ id: 'id' }));
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub' })
      );
      try {
        await authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },
          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
      }
      expect(MockVerifyRefreshToken).toHaveBeenCalledTimes(1);
      expect(MockVerifyRefreshToken).toHaveBeenCalledWith('refresh-token');
    });
    it('should find the auth token keys.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id', sub: 'sub', accessTokenKey: 'key' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve({ id: 'id' }));
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub', refreshTokenKey: 'key' })
      );
      await expect(
        authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },
          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request)
      ).rejects.toThrowError();
      expect(MockFindKeys).toHaveBeenCalledTimes(1);
      expect(MockFindKeys).toHaveBeenCalledWith({
        userId: 'id',
        refreshTokenKey: 'key',
        accessTokenKey: 'key'
      });
    });
    it('should throw a AuthFailureError if no auth token key is found.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id', sub: 'sub', accessTokenKey: 'key' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve({ id: 'id' }));
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub', refreshTokenKey: 'key' })
      );
      MockFindKeys.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },
          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.UNAUTHORIZED
        );
      }
      expect(MockFindKeys).toHaveBeenCalledTimes(1);
      expect(MockFindKeys).toHaveBeenCalledWith({
        userId: 'id',
        refreshTokenKey: 'key',
        accessTokenKey: 'key'
      });
    });
    it('should delete the existing auth token keys.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return Promise.resolve({ id: 'id', sub: 'sub', accessTokenKey: 'key' });
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({ ...userData, roles: roleData })
      );
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub', refreshTokenKey: 'key' })
      );
      MockFindKeys.mockImplementation(() =>
        Promise.resolve({
          data: 'data'
        })
      );
      MockDeleteKeys.mockImplementation(() => Promise.resolve());
      MockCreateKeys.mockImplementation(() => Promise.resolve({ key: 'key' }));
      MockGenerateTokens.mockImplementation(() =>
        Promise.resolve({ key: 'key' })
      );
      await authService.refreshTokens({
        body: { refreshToken: 'refresh-token' },
        get() {
          return 'Bearer access-token';
        }
      } as unknown as Request);
      expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
      expect(MockDeleteKeys).toHaveBeenCalledWith('111');
    });
    it('should create new auth token keys.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return Promise.resolve({
          id: userData.id,
          sub: 'sub',
          accessTokenKey: 'key'
        });
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({ ...userData, roles: roleData })
      );
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: userData.id, sub: 'sub', refreshTokenKey: 'key' })
      );
      MockFindKeys.mockImplementation(() =>
        Promise.resolve({
          data: 'data'
        })
      );
      MockDeleteKeys.mockImplementation(() => Promise.resolve());
      MockCreateKeys.mockImplementation(() => {
        return Promise.resolve({ keys: 'keys' });
      });
      await authService.refreshTokens({
        body: { refreshToken: 'refresh-token' },
        get() {
          return 'Bearer access-token';
        }
      } as unknown as Request);
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
    });
    it('should throw InternalServerError if no auth token keys record is returned', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id', sub: 'sub', accessTokenKey: 'key' };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve({ id: 'id' }));
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub', refreshTokenKey: 'key' })
      );
      MockFindKeys.mockImplementation(() =>
        Promise.resolve({
          data: 'data'
        })
      );
      MockDeleteKeys.mockImplementation(() => Promise.resolve());
      MockCreateKeys.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.refreshTokens({
          body: { refreshToken: 'refresh-token' },
          get() {
            return 'Bearer access-token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).message).toBe(errorMessages.INTERNAL);
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: 'id',
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
    });
    it('should issue new access and refresh tokens.', async () => {
      MockDecodeAccessToken.mockImplementation(() => {
        return { id: 'id', sub: 'sub', accessTokenKey: 'key' };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({ ...userData, roles: roleData })
      );
      MockVerifyRefreshToken.mockImplementation(() =>
        Promise.resolve({ id: 'id', sub: 'sub', refreshTokenKey: 'key' })
      );
      MockFindKeys.mockImplementation(() =>
        Promise.resolve({
          data: 'data'
        })
      );
      MockDeleteKeys.mockImplementation(() => Promise.resolve());
      MockCreateKeys.mockImplementation(() =>
        Promise.resolve({ data: 'data' })
      );
      MockGenerateTokens.mockImplementation(() => {
        return Promise.resolve({ accessToken: 'token', refreshToken: 'token' });
      });

      const tokens = await authService.refreshTokens({
        body: { refreshToken: 'refresh-token' },
        get() {
          return 'Bearer access-token';
        }
      } as unknown as Request);
      expect(tokens).toStrictEqual({
        accessToken: 'token',
        refreshToken: 'token'
      });
      expect(MockGenerateTokens).toHaveBeenCalledTimes(1);
      expect(MockGenerateTokens).toHaveBeenCalledWith(
        { ...userData, roles: roleData },
        roleData,
        expect.any(String),
        expect.any(String)
      );

      expect(MockCreateKeys).toHaveBeenCalledTimes(1);
      expect(MockCreateKeys).toHaveBeenCalledWith({
        userId: userData.id,
        accessTokenKey: expect.any(String),
        refreshTokenKey: expect.any(String)
      });
    });
  });
  describe('Method: verifyVerificationToken', () => {
    beforeEach(() => {
      MockFindTokenByToken.mockClear();
      MockFindUserById.mockClear();
      MockUpdateActivity.mockClear();
      MockDeleteToken.mockClear();
      MockVerifyToken.mockClear();
    });
    it('should throw a BadRequestError if no token is found.', async () => {
      try {
        await authService.verifyVerificationToken('');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindTokenByToken).toHaveBeenCalledTimes(1);
      expect(MockFindTokenByToken).toHaveBeenCalledWith('');
    });
    it('should throw a BadRequestError if no user is found from the token.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111'
        };
      });
      MockFindUserById.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.verifyVerificationToken('');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('111', { activity: true });
      expect(MockFindTokenByToken).toHaveBeenCalledTimes(1);
      expect(MockFindTokenByToken).toHaveBeenCalledWith('');
    });
    it('should throw a ForbiddenError if activity obj doesnt exists.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: null
        })
      );
      try {
        await authService.verifyVerificationToken('');
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
        expect((err as BaseError).message).toBe(errorMessages.FORBIDDEN);
        expect((err as BaseError).statusCode).toBe(errorStatusCodes.FORBIDDEN);
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('111', { activity: true });
      expect(MockFindTokenByToken).toHaveBeenCalledTimes(1);
      expect(MockFindTokenByToken).toHaveBeenCalledWith('');
    });
    it('should throw a BadRequestError if account already verified', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111',
          tokenType: 'VERIFY_ACCOUNT'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: { accessRestricted: false }
        })
      );
      try {
        await authService.verifyVerificationToken('');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Account already verified');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('111', { activity: true });
      expect(MockFindTokenByToken).toHaveBeenCalledTimes(1);
      expect(MockFindTokenByToken).toHaveBeenCalledWith('');
    });
    it('should throw a BadRequestError if email already verified.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111',
          tokenType: 'VERIFY_EMAIL'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: { emailVerified: true }
        })
      );
      try {
        await authService.verifyVerificationToken('');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Email already verified');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('111', { activity: true });
      expect(MockFindTokenByToken).toHaveBeenCalledTimes(1);
      expect(MockFindTokenByToken).toHaveBeenCalledWith('');
    });
    it('should verify the email.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111',
          tokenType: 'VERIFY_EMAIL'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: { ...activityData, emailVerified: false }
        })
      );
      expect(await authService.verifyVerificationToken('')).toStrictEqual({
        emailVerified: true
      });
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith('111', {
        emailVerified: true
      });
      expect(MockDeleteToken).toHaveBeenCalledTimes(1);
      expect(MockDeleteToken).toHaveBeenCalledWith('111');
    });
    it('should verify the account.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          userId: '111',
          tokenType: 'VERIFY_ACCOUNT'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: { ...activityData, accessRestricted: true }
        })
      );
      expect(await authService.verifyVerificationToken('')).toStrictEqual({
        accountVerified: true
      });
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledWith('111', {
        accessRestricted: false
      });
      expect(MockDeleteToken).toHaveBeenCalledTimes(1);
      expect(MockDeleteToken).toHaveBeenCalledWith('111');
    });
    it('should verify the two factor auth token.', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          id: '222',
          userId: '111',
          tokenType: 'RESET_PASSWORD'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: activityData
        })
      );
      expect(await authService.verifyVerificationToken('')).toStrictEqual({
        tokenId: '222'
      });
      expect(MockVerifyToken).toHaveBeenCalledTimes(1);
      expect(MockVerifyToken).toHaveBeenCalledWith('');
    });
    it('should throw a ForbiddenError if TokenType doesnt match', async () => {
      MockFindTokenByToken.mockImplementation(() => {
        return {
          id: '222',
          userId: '111',
          tokenType: 'TOKEN_TYPE'
        };
      });
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({
          ...userData,
          activities: activityData
        })
      );
      await expect(authService.verifyVerificationToken('')).rejects.toThrow(
        ForbiddenError
      );
    });
  });
  describe('Method: resetPassword', () => {
    beforeEach(() => {
      MockFindTokenById.mockClear();
      MockFindUserById.mockClear();
      MockGeneratePassword.mockClear();
      MockUpdateUser.mockClear();
      MockDeleteToken.mockClear();
      MockDeleteKeys.mockClear();
    });
    it('should throw a BadRequestError if no token found.', async () => {
      MockFindTokenById.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.resetPassword('token', 'password');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindTokenById).toHaveBeenCalledTimes(1);
      expect(MockFindTokenById).toHaveBeenCalledWith('token');
    });
    it('should throw BadRequestError if no user is accociated with the token.', async () => {
      MockFindTokenById.mockImplementation(() =>
        Promise.resolve({ token: 'token', userId: '111' })
      );
      MockFindUserById.mockImplementation(() => Promise.resolve(null));
      try {
        await authService.resetPassword('token', 'password');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Invalid Token');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockFindUserById).toHaveBeenCalledWith('111', undefined);
    });
    it('should throw a ForbiddenError if tokenType is not reset password.', async () => {
      MockFindTokenById.mockImplementation(() =>
        Promise.resolve({
          token: 'token',
          userId: '111',
          tokenType: 'VERIFY_EMAIL'
        })
      );
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({ ...userData })
      );
      try {
        await authService.resetPassword('token', 'password');
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
        expect((err as BaseError).message).toBe(errorMessages.FORBIDDEN);
        expect((err as BaseError).statusCode).toBe(errorStatusCodes.FORBIDDEN);
      }
      expect(MockFindTokenById).toHaveBeenCalledTimes(1);
      expect(MockFindTokenById).toHaveBeenCalledWith('token');
    });
    it('should reset the password.', async () => {
      MockFindTokenById.mockImplementation(() =>
        Promise.resolve({
          token: 'token',
          userId: '111',
          tokenType: 'RESET_PASSWORD'
        })
      );
      MockFindUserById.mockImplementation(() =>
        Promise.resolve({ ...userData })
      );
      MockGeneratePassword.mockImplementation(() => Promise.resolve());
      MockUpdateUser.mockImplementation(() => Promise.resolve());
      MockDeleteKeys.mockImplementation(() => Promise.resolve());
      MockDeleteToken.mockImplementation(() => Promise.resolve());
      await authService.resetPassword('token', 'password');
      expect(MockFindTokenById).toHaveBeenCalledTimes(1);
      expect(MockFindTokenById).toHaveBeenCalledWith('token');
      expect(MockFindUserById).toHaveBeenCalledTimes(1);
      expect(MockGeneratePassword).toHaveBeenCalledTimes(1);
      expect(MockUpdateUser).toHaveBeenCalledTimes(1);
      expect(MockDeleteKeys).toHaveBeenCalledTimes(1);
      expect(MockDeleteToken).toHaveBeenCalledTimes(1);
    });
  });
  describe('Method: changePassword', () => {
    beforeEach(() => {
      MockGeneratePassword.mockClear();
      MockValidatePassword.mockClear();
      MockUpdateUser.mockClear();
      MockUpdateActivity.mockClear();
    });
    it('should throw BadRequestError if failed to validate password.', async () => {
      MockValidatePassword.mockImplementation(() => Promise.resolve(false));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('muttaqin:muttaqin')
      );
      MockUpdateUser.mockImplementation(() => Promise.resolve());
      try {
        await authService.changePassword(
          { ...userData, password: 'muttaqin:muttaqin' },
          'muttaqin:muttaqin',
          'muttaqin'
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect((err as BaseError).message).toBe('Invalid Password');
        expect((err as BaseError).statusCode).toBe(
          errorStatusCodes.BAD_REQUEST
        );
      }
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
    });
    it('should validate the password.', async () => {
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockGeneratePassword.mockImplementation((data) => Promise.resolve(data));
      MockUpdateUser.mockImplementation(() => Promise.resolve());
      await authService.changePassword(
        { ...userData, password: 'muttaqin:muttaqin' },
        'muttaqin:muttaqin',
        'muttaqin'
      );
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
    });
    it('should change the password.', async () => {
      MockValidatePassword.mockImplementation(() => Promise.resolve(true));
      MockGeneratePassword.mockImplementation(() =>
        Promise.resolve('hashedPassword')
      );
      MockUpdateUser.mockImplementation(() => Promise.resolve());
      await authService.changePassword(
        { ...userData, password: 'muttaqin:muttaqin' },
        userData.password as string,
        'muttaqin'
      );
      expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      expect(MockGeneratePassword).toHaveBeenCalledTimes(1);
      expect(MockUpdateUser).toHaveBeenCalledTimes(1);
      expect(MockUpdateActivity).toHaveBeenCalledTimes(1);
    });
  });
});
