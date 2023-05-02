import 'reflect-metadata';
import Jwt from '../../../../src/helpers/Jwt';
import IJwt from '../../../../src/interfaces/helpers/IJsonWebToken';
import {
  BadTokenError,
  ForbiddenError,
  InternalServerError,
  TokenExpiredError
} from '../../../../src/helpers/AppError/ApiError';
import { readFileSpy } from './mock';
import { JWT } from '../../../../src/config/index';

const jwtPayload = {
  userId: '123',
  email: 'test@gmail.com',
  userName: 'test1',
  roleId: '123',
  iat:Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  iss: JWT.iss,
  aud: JWT.aud,
  sub: JWT.sub
};

describe('Helper Class: Jwt', () => {
  describe('Method: generateToken', () => {
    let jwt: IJwt;
    beforeEach(() => {
      readFileSpy.mockClear();
      jwt = new Jwt();
    });

    it('should throw a InternalServerError.', async () => {
      readFileSpy.mockRejectedValueOnce(Promise.resolve(false));
      await expect(jwt.generateToken(jwtPayload)).rejects.toThrow(
        InternalServerError
      );
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should generate a jwt token.', async () => {
      await expect(jwt.generateToken(jwtPayload)).resolves.toBeTruthy();
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('Method: verifyToken', () => {
    let jwt: IJwt;
    beforeEach(() => {
      readFileSpy.mockClear();
      jwt = new Jwt();
    });
    it('should throw a InternalServerError.', async () => {
      readFileSpy.mockRejectedValueOnce(Promise.resolve(false));
      await expect(jwt.verifyToken('token')).rejects.toThrow(
        InternalServerError
      );
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should throw a BadTokenError.', async () => {
      await expect(jwt.verifyToken('token')).rejects.toThrow(BadTokenError);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should throw a TokenExpiredError', async () => {
      const Payload = {
        ...jwtPayload,
        exp: Math.floor(Date.now() / 1000)
      };
      const token = await jwt.generateToken(Payload);
      await expect(jwt.verifyToken(token)).rejects.toThrow(TokenExpiredError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should  throw a ForbiddenError', async () => {
      const Payload = {
        ...jwtPayload,

        iat: Math.floor(Date.now() / 1000) + 10000,
        nbf: Math.floor(Date.now() / 1000) + 20000
      };
      const token = await jwt.generateToken(Payload);
      await expect(jwt.verifyToken(token)).rejects.toThrow(ForbiddenError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should throw a InternalServerError', async () => {
      readFileSpy.mockRejectedValueOnce(
        new Error('I am not an api specific error.')
      );
      await expect(jwt.verifyToken('token')).rejects.toThrow(
        InternalServerError
      );
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should verify the token', async ()=>{
      const token = await jwt.generateToken(jwtPayload);
      await expect(jwt.verifyToken(token)).resolves.toStrictEqual(jwtPayload)
    })
  });
});
