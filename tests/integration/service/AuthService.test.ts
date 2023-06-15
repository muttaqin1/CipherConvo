import 'reflect-metadata';
import AuthService from '../../../src/api/services/AuthService';
import UserRepository from '../../../src/api/repositories/UserRepository';
import RoleRepository from '../../../src/api/repositories/RoleRepository';
import AuthUtils from '../../../src/helpers/AuthUtils';
import AuthTokenKeysRepository from '../../../src/api/repositories/AuthTokenKeysRepository';
import ActivityRepository from '../../../src/api/repositories/ActivityRepository';
import TwoFactorAuthTokenRepository from '../../../src/api/repositories/TwoFactorAuthTokenRepository';
import MockModel, {
  MockCreate,
  MockDestroy,
  MockFindOne,
  MockUpdate
} from '../../unit/repository/MockModel';
import {
  mockDecodeToken,
  mockGenToken,
  MockJwt,
  mockVerifyToken
} from '../../unit/helpers/AuthUtils/mock';
import { Password } from '../../../src/interfaces/models/IUser';
import IUserRepository from '../../../src/interfaces/repository/IUserRepository';
import IRoleRepository from '../../../src/interfaces/repository/IRoleRepository';
import IAuthUtils from '../../../src/interfaces/helpers/IAuthUtils';
import IAuthTokenKeysRepository from '../../../src/interfaces/repository/IAuthTokenKeysRepository';
import IActivityRepository from '../../../src/interfaces/repository/IActivityRepository';
import ITwoFactorAuthTokenRepository from '../../../src/interfaces/repository/ITwoFactorAuthTokenRepository';
import userData from '../../utils/userData';
import roleData from '../../utils/roleData';
import activityData from '../../utils/activityData';
import _ from 'lodash';
let authService: AuthService;
let mockModel: any;
let mockJwt: any;
let userRepository: IUserRepository;
let roleRepository: IRoleRepository;
let authUtils: IAuthUtils;
let authTokenKeysRepository: IAuthTokenKeysRepository;
let activityRepository: IActivityRepository;
let twoFactorAuthTokenRepository: ITwoFactorAuthTokenRepository;
describe('Class: AuthService', () => {
  beforeEach(() => {
    mockModel = new MockModel() as any;
    mockJwt = new MockJwt() as any;
    userRepository = new UserRepository(mockModel, mockModel, mockModel);
    roleRepository = new RoleRepository(mockModel);
    authUtils = new AuthUtils(mockJwt);
    authTokenKeysRepository = new AuthTokenKeysRepository(mockModel);
    activityRepository = new ActivityRepository(mockModel);
    twoFactorAuthTokenRepository = new TwoFactorAuthTokenRepository(mockModel);
    authService = new AuthService(
      userRepository,
      authUtils,
      authTokenKeysRepository,
      activityRepository,
      roleRepository,
      twoFactorAuthTokenRepository
    );
  });
  describe('Method: login', () => {
    it('should return expected data.', async () => {
      MockFindOne.mockReturnValueOnce({
        ...userData,
        roles: roleData,
        activities: activityData
      }).mockResolvedValueOnce(Promise.resolve(false));
      jest
        .spyOn(authUtils, 'validatePassword')
        .mockReturnValueOnce(Promise.resolve(true));
      MockUpdate.mockImplementationOnce(() => Promise.resolve());
      MockCreate.mockImplementationOnce(() => Promise.resolve(true));

      const tokens = await authService.login({
        userName: userData.userName,
        password: userData.password as Password
      });
      const data = { ...userData };
      // @ts-ignore
      delete data.password;
      expect(tokens).toStrictEqual({
        user: data,
        roles: roleData,
        tokens: { accessToken: 'token', refreshToken: 'token' }
      });
    });
  });
  describe('Method: signup', () => {
    it('should return expected data.', async () => {
      MockFindOne.mockReturnValueOnce(false).mockReturnValueOnce(false);
      MockCreate.mockReturnValueOnce(userData)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(roleData)
        .mockReturnValueOnce(true);

      expect(await authService.signup(userData)).toStrictEqual({
        user: { ..._.omit(userData, 'password') },
        role: roleData,
        tokens: { accessToken: 'token', refreshToken: 'token' }
      });
    });
  });
  describe('Method: logout', () => {
    it('should return expected data.', async () => {
      MockDestroy.mockReturnValueOnce(true);
      await expect(authService.logout({} as any)).resolves.toBe(undefined);
    });
  });
  describe('Method: refreshTokens', () => {
    it('should return expected data.', async () => {
      mockDecodeToken.mockImplementationOnce(() => {
        return Promise.resolve({
          id: '111',
          aud: 'audience',
          sub: 'subject',
          iss: 'issuer.com',
          iat: 'issuedAt',
          accessTokenKey: 'key'
        });
      });
      MockFindOne.mockReturnValueOnce({
        ...userData,
        roles: roleData
      }).mockReturnValueOnce(true);
      mockVerifyToken.mockImplementationOnce(() => {
        return Promise.resolve({
          id: '111',
          aud: 'audience',
          sub: 'subject',
          iss: 'issuer.com',
          iat: 'issuedAt',
          refreshTokenKey: 'key'
        });
      });
      MockDestroy.mockReturnValueOnce(true);
      MockCreate.mockReturnValueOnce(true);
      mockGenToken.mockReturnValueOnce('token');
      await expect(
        authService.refreshTokens({
          body: { refreshToken: 'refreshToken' },
          get() {
            return 'Bearer token';
          }
        } as any)
      ).resolves.toStrictEqual({
        accessToken: 'token',
        refreshToken: 'token'
      });
    });
  });

  describe('Method: verifyVerificationToken', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
      MockUpdate.mockClear();
      MockDestroy.mockClear();
    });
    it('should return verify account output.', async () => {
      MockFindOne.mockReturnValueOnce({
        userId: '32323',
        tokenType: 'VERIFY_ACCOUNT'
      }).mockReturnValueOnce({
        ...userData,
        activities: { ...activityData, accessRestricted: true }
      });
      await expect(
        authService.verifyVerificationToken('1323232')
      ).resolves.toStrictEqual({
        accountVerified: true
      });
      expect(MockUpdate).toHaveReturnedTimes(1);
      expect(MockDestroy).toHaveBeenCalledTimes(1);
    });
    it('should return verify email output.', async () => {
      MockFindOne.mockReturnValueOnce({
        userId: '32323',
        tokenType: 'VERIFY_EMAIL'
      }).mockReturnValueOnce({
        ...userData,
        activities: {
          ...activityData,
          accessRestricted: false,
          emailVerified: false
        }
      });
      await expect(
        authService.verifyVerificationToken('1323232')
      ).resolves.toStrictEqual({
        emailVerified: true
      });
      expect(MockUpdate).toHaveReturnedTimes(1);
      expect(MockDestroy).toHaveBeenCalledTimes(1);
    });
    it('should return the tokenId for reset password.', async () => {
      MockFindOne.mockReturnValueOnce({
        userId: '32323',
        id: '1111',
        tokenType: 'RESET_PASSWORD'
      }).mockReturnValueOnce({
        ...userData,
        activities: {
          ...activityData,
          accessRestricted: false,
          emailVerified: false
        }
      });
      await expect(
        authService.verifyVerificationToken('ddwr23')
      ).resolves.toStrictEqual({
        tokenId: '1111'
      });
    });
  });
  describe('Method: resetPassword', () => {
    it('should return reset password output.', async () => {
      MockUpdate.mockClear();
      MockDestroy.mockClear();
      MockFindOne.mockReturnValueOnce({
        id: '1111',
        userId: '3333',
        tokenType: 'RESET_PASSWORD'
      }).mockReturnValueOnce(userData);
      await expect(
        authService.resetPassword('token', 'password')
      ).resolves.toBeUndefined();
      expect(MockUpdate).toHaveBeenCalledTimes(2);
      expect(MockDestroy).toHaveBeenCalledTimes(2);
    });
  });
});
