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
import IUser, { Password } from '../../../../src/interfaces/models/IUser';
import {
  AccessTokenError,
  AuthFailureError,
  BadTokenError,
  ForbiddenError,
  InternalServerError,
  NoDataError
} from '../../../../src/helpers/AppError/ApiError';
import ErrorMsg from '../../../../src/helpers/AppError/errorMessages';
import { Request } from 'express';
import BaseError from '../../../../src/helpers/AppError/BaseError';
import { JWT } from '../../../../src/config/index';

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
let spySanitizeAuthHeader = jest.spyOn(authUtils, 'sanitizeAuthHeader');
let spyVerifyJwtPayload = jest.spyOn(authUtils, 'verifyJwtPayload');

describe('Helper Class: AuthUtils', () => {
  describe('Method verifyJwtPayload', () => {
    it('should verify the jwt payload', () => {
      let jwtPayload = {
        userId: 'id',
        userName: 'muttaqin1',
        roleId: 'id',
        email: 'example@gmail.com',
        iat: 'iat',
        iss: JWT.iss,
        aud: JWT.aud,
        sub: JWT.sub
      };

      expect(authUtils.verifyJwtPayload(jwtPayload)).toBeTruthy();
    });
    it('should return false if any of the required properties is missing or incorrect', () => {
      let jwtPayload = {
        userId: 'id',
        userName: 'muttaqin1',
        roleId: 'id',
        email: 'example@gmail.com',
        //iss: JWT.iss,
        iat: 'iat',
        //aud: JWT.aud,
        sub: JWT.sub
      };

      expect(authUtils.verifyJwtPayload(jwtPayload)).toBeFalsy();
    });
    it('should return false if no payload is provided', () => {
      expect(authUtils.verifyJwtPayload({})).toBeFalsy();
    });
  });

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
        expect(mockDecodeToken).toBeCalledTimes(1);
      }
    });
    it('should throw a AccessTokenError', async () => {
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
  describe('Method: validatePassword', () => {
    it('should validate the password', async () => {
      const dbSavedpass = await authUtils.generatePassword('iloveyou1234');
      await expect(
        authUtils.validatePassword('iloveyou1234', dbSavedpass)
      ).resolves.toBeTruthy();
    });
    it('should throw a InternalServerError', async () => {
      const dbSavedpass = '';
      try {
        await authUtils.validatePassword(
          'iloveyou1234',
          dbSavedpass as Password
        );
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerError);
        expect((err as BaseError).type).toBe('InternalServerError');
        expect((err as BaseError).statusCode).toBe(500);
      }
    });
  });
  describe('Method: sanitizeAuthHeader', () => {
    it('should extract the auth token from headers', () => {
      expect(
        authUtils.sanitizeAuthHeader({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request)
      ).toBe('token');
    });
    it('should throw a ForbiddenError', () => {
      try {
        authUtils.sanitizeAuthHeader({
          get() {
            return 'Bearer token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
        expect((err as BaseError).type).toBe('ForbiddenError');
        expect((err as BaseError).statusCode).toBe(403);
      }
    });

    it("should throw a ForbiddenError if no 'Bearer' is present in header", () => {
      try {
        authUtils.sanitizeAuthHeader({
          get() {
            return 'token';
          }
        } as unknown as Request);
      } catch (err) {
        expect(err).toBeInstanceOf(ForbiddenError);
        expect((err as BaseError).type).toBe('ForbiddenError');
        expect((err as BaseError).statusCode).toBe(403);
      }
    });
  });
});
