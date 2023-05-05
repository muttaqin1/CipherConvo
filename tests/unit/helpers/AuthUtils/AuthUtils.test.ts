import 'reflect-metadata';
import {
  mockDecodeToken,
  mockGenToken,
  MockJwt,
  mockVerifyToken
} from './mock';
import AuthUtils from '../../../../src/helpers/AuthUtils';
import IJsonWebToken from '../../../../src/interfaces/helpers/IJsonWebToken';
import { randomBytes } from 'crypto';
import IUser from '../../../../src/interfaces/models/IUser';
import {
  AccessTokenError,
  AuthFailureError,
  BadTokenError,
  InternalServerError,
  NoDataError
} from '../../../../src/helpers/AppError/ApiError';
import ErrorMsg from '../../../../src/helpers/AppError/errorMessages';
import { Request } from 'express';
import BaseError from '../../../../src/helpers/AppError/BaseError';

const user: IUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@gmail.com',
  password: 'password:password',
  gender: 'male',
  userName: 'john',
  avatar: 'avatar',
  activityId: '1',
  roleId: '1'
};
let authUtils = new AuthUtils(new MockJwt() as IJsonWebToken);
const spySanitizeAuthHeader = jest.spyOn(authUtils, 'sanitizeAuthHeader');
const spyVerifyJwtPayload = jest.spyOn(authUtils, 'verifyJwtPayload');

describe('Helper Class: AuthUtils', () => {
  describe('Method: generateAccessToken', () => {
    beforeEach(() => {
      mockGenToken.mockClear();
    });

    it('should generate access and refresh token', async () => {
      const token = await authUtils.generateTokens(
        user as Required<IUser>,
        randomBytes(64).toString('hex'),
        randomBytes(64).toString('hex')
      );
      expect(token).toStrictEqual({
        accessToken: 'token',
        refreshToken: 'token'
      });
      expect(mockGenToken).toHaveBeenCalledTimes(2);
    });
    it('should throw InternalServerError', async () => {
      mockGenToken.mockReturnValue(null);
      try {
        await authUtils.generateTokens(
          user as Required<IUser>,
          randomBytes(64).toString('hex'),
          randomBytes(64).toString('hex')
        );
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerError);
        expect((e as Error).message).toBe(ErrorMsg.INTERNAL);
        expect(mockGenToken).toHaveBeenCalledTimes(2);
      }
    });
    it('should throw InternalServerError', async () => {
      mockGenToken.mockRejectedValue(
        new Error('I am not a api scpecific error.')
      );
      try {
        await authUtils.generateTokens(
          user as Required<IUser>,
          randomBytes(64).toString('hex'),
          randomBytes(64).toString('hex')
        );
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerError);
        expect((e as Error).message).toBe(ErrorMsg.INTERNAL);
        expect(mockGenToken).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Method: verifyAccessToken', () => {
    beforeEach(() => {
      spySanitizeAuthHeader.mockClear();
      mockVerifyToken.mockClear();
      spyVerifyJwtPayload.mockClear();
    });
    it('should verify the token', async () => {
      spySanitizeAuthHeader.mockReturnValue('token');
      mockVerifyToken.mockReturnValue({ type: 'JwtPayload' });
      spyVerifyJwtPayload.mockReturnValue(true);
      const jwtPayload = await authUtils.verifyAccessToken({
        get() {
          return 'Bearer token';
        }
      } as unknown as Request);
      expect(jwtPayload).toStrictEqual({ type: 'JwtPayload' });
      expect(spySanitizeAuthHeader).toBeCalledTimes(1);
      expect(spyVerifyJwtPayload).toBeCalledTimes(1);
      expect(mockVerifyToken).toBeCalledTimes(1);
    });
    it('should throw a AuthFailureError', async () => {
      try {
        spySanitizeAuthHeader.mockReturnValue('');
        await authUtils.verifyAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).type).toEqual('AuthFailureError');
        expect((err as BaseError).statusCode).toEqual(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
      }
    });
    it('should throw a AuthFailureError', async () => {
      try {
        spySanitizeAuthHeader.mockReturnValue('token');
        mockVerifyToken.mockReturnValue('');
        await authUtils.verifyAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).type).toEqual('AuthFailureError');
        expect((err as BaseError).statusCode).toEqual(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
        expect(mockVerifyToken).toBeCalledTimes(1);
      }
    });
    it('should throw a AuthFailureError', async () => {
      try {
        spySanitizeAuthHeader.mockReturnValue('token');
        mockVerifyToken.mockReturnValue({ type: 'JwtPayload' });
        spyVerifyJwtPayload.mockReturnValue(false);
        await authUtils.verifyAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).type).toEqual('AuthFailureError');
        expect((err as BaseError).statusCode).toEqual(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
        expect(spyVerifyJwtPayload).toBeCalledTimes(1);
        expect(mockVerifyToken).toBeCalledTimes(1);
      }
    });
    it('should throw a AccessTokenError', async () => {
      try {
        spySanitizeAuthHeader.mockImplementation(() => {
          throw new BadTokenError();
        });
        await authUtils.verifyAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AccessTokenError);
        expect((err as BaseError).type).toEqual('AccessTokenError');
        expect((err as BaseError).statusCode).toEqual(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
      }
    });
    //to test that other errors can pass through the validation.
    it('should throw a NoDataError', async () => {
      try {
        spySanitizeAuthHeader.mockImplementation(() => {
          throw new NoDataError();
        });
        await authUtils.verifyAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(NoDataError);
        expect((err as BaseError).type).toEqual('NoDataError');
        expect((err as BaseError).statusCode).toEqual(404);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
      }
    });
  });
  describe('Method: decodeAccessToken', () => {
    beforeEach(() => {
      spySanitizeAuthHeader.mockClear();
      spyVerifyJwtPayload.mockClear();
      mockDecodeToken.mockClear();
    });
    it('should decode the access token', async () => {
      spySanitizeAuthHeader.mockReturnValue('token');
      mockDecodeToken.mockReturnValue({ type: 'jwtPayload' });
      spyVerifyJwtPayload.mockReturnValue(true);

      const jwtPayload = await authUtils.decodeAccessToken({
        get() {
          return 'Bearer token';
        }
      } as unknown as Request);
      expect(jwtPayload).toStrictEqual({
        type: 'jwtPayload'
      });
      expect(spySanitizeAuthHeader).toBeCalledTimes(1);
      expect(mockDecodeToken).toBeCalledTimes(1);
    });
    it('should throw a AuthFailureError', async () => {
      spySanitizeAuthHeader.mockReturnValue('token');
      mockDecodeToken.mockReturnValue('');
      try {
        await authUtils.decodeAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).type).toBe('AuthFailureError');
        expect((err as BaseError).statusCode).toBe(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
        expect(mockDecodeToken).toBeCalledTimes(1);
      }
    });
    it('should throw a AccessTokenError', async () => {
      spySanitizeAuthHeader.mockReturnValue('token');
      mockDecodeToken.mockImplementation(() => {
        throw new BadTokenError();
      });
      try {
        await authUtils.decodeAccessToken({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(AccessTokenError);
        expect((err as BaseError).type).toBe('AccessTokenError');
        expect((err as BaseError).statusCode).toBe(401);
        expect(spySanitizeAuthHeader).toBeCalledTimes(1);
        expect(mockDecodeToken).toBeCalledTimes(1);
      }
    });
  });
  describe('Method: verifyRefreshToken', () => {
    beforeEach(() => {
      mockVerifyToken.mockClear();
      spyVerifyJwtPayload.mockClear();
    });

    it('should verify the refresh token', async () => {
      mockVerifyToken.mockReturnValue({ data: 'data' });
      spyVerifyJwtPayload.mockReturnValue(true);
      const token = await authUtils.verifyRefreshToken('refresh token');
      expect(token).toStrictEqual({
        data: 'data'
      });
      expect(mockVerifyToken).toBeCalledTimes(1);
      expect(spyVerifyJwtPayload).toBeCalledTimes(1);
    });
    it('should throw a AuthFailureError', async () => {
      mockVerifyToken.mockReturnValue({});
      try {
        await authUtils.verifyRefreshToken('refresh token');
      } catch (err) {
        console.log(err);
        expect(err).toBeInstanceOf(AuthFailureError);
        expect((err as BaseError).type).toBe('AuthFailureError');
        expect((err as BaseError).statusCode).toBe(401);
        expect(mockVerifyToken).toBeCalledTimes(1);
      }
    });
  });

  describe('Method: generatePassword', () => {
    it('should hash the password even if no salt is provided', async () => {
      const password = await authUtils.generatePassword('iloveyou1234');
      expect(password).toBeTruthy();
    });
    it('should hash a password by using the salt', async () => {
      const salt = await authUtils.generateSalt();
      await expect(
        authUtils.generatePassword('iloveyou1234', salt)
      ).resolves.toBeTruthy();
    });
  });
});
