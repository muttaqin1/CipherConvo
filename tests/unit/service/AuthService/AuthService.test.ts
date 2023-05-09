import 'reflect-metadata';
import AuthService from '../../../../src/api/services/AuthService';
import MockAuthUtils, {
  MockGenerateTokens,
  MockValidatePassword
} from './MockAuthUtils';
import MockUserRepository, { MockFindUserByEmail } from './MockUserRepository';
import MockAuthTokenKeysRepository, {
  MockCreateKeys,
  MockDeleteKeys,
  MockFindKeys
} from './MockAuthTokenKeysRepository';
import MockActivityRepository, {
  MockUpdateActivity
} from './MockActivityRepository';
import MockRoleRepository from './MockRoleRepository';
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
        expect(MockFindUserByEmail).toHaveBeenCalledTimes(1);
        expect(MockFindUserByEmail).toHaveBeenCalledWith('test@gmail.com', {
          role: true,
          activity: true
        });
        expect(MockValidatePassword).toHaveBeenCalledTimes(1);
      }
    });
    it('should restrict account access if failed login attempts is greater than 8 and  throw AuthFailureError.', async () => {
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
        expect(MockValidatePassword).toHaveBeenCalledTimes(1);
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
      expect(response).toStrictEqual<loginResponse>({ ...response });
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
});
