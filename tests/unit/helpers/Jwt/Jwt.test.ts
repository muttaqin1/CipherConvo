import 'reflect-metadata';
import Jwt from '../../../../src/helpers/Jwt';
import IJwt from '../../../../src/interfaces/helpers/IJsonWebToken';
import {
  BadTokenError,
  ForbiddenError,
  InternalServerError,
  TokenExpiredError
} from '../../../../src/helpers/AppError/ApiError';
import { readFileSpy, signSpy, verifySpy } from './mock';
import { JsonWebTokenError } from 'jsonwebtoken';
import jwtPayload from '../../../utils/jwtPayloadData';
describe('Helper Class: Jwt', () => {
  describe('Method: generateToken', () => {
    let jwt: IJwt;
    beforeEach(() => {
      readFileSpy.mockClear();
      signSpy.mockClear();
      jwt = new Jwt();
    });

    it('should throw InternalServerError if no key is returned', async () => {
      readFileSpy.mockRejectedValueOnce(Promise.resolve(false));
      await expect(jwt.generateToken(jwtPayload)).rejects.toThrow(
        InternalServerError
      );
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should throw a InternalServerError if error is not a api specific error.', async () => {
      readFileSpy.mockRejectedValueOnce(
        new Error('I am not an api specific error.')
      );
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
    it('should throw a BadTokenError if token is not valid.', async () => {
      await expect(jwt.verifyToken('token')).rejects.toThrow(BadTokenError);
      expect(readFileSpy).toHaveBeenCalledTimes(1);
    });
    it('should throw a TokenExpiredError if token is expired.', async () => {
      const Payload = {
        ...jwtPayload,
        exp: Math.floor(Date.now() / 1000)
      };
      const token = await jwt.generateToken(Payload);
      await expect(jwt.verifyToken(token)).rejects.toThrow(TokenExpiredError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should  throw a ForbiddenError if error is a NotBeforeError.', async () => {
      const Payload = {
        ...jwtPayload,

        iat: Math.floor(Date.now() / 1000) + 10000,
        nbf: Math.floor(Date.now() / 1000) + 20000
      };
      const token = await jwt.generateToken(Payload);
      await expect(jwt.verifyToken(token)).rejects.toThrow(ForbiddenError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should verify the token', async () => {
      const token = await jwt.generateToken(jwtPayload);
      await expect(jwt.verifyToken(token)).resolves.toStrictEqual(jwtPayload);
    });
  });
  describe('Method: decodeToken', () => {
    let jwt: IJwt;
    beforeEach(() => {
      jwt = new Jwt();
      readFileSpy.mockClear();
      verifySpy.mockClear();
    });
    it('should throw a BadTokenError if token is not valid.', async () => {
      verifySpy.mockImplementationOnce(() => {
        throw new JsonWebTokenError('jwt malformed');
      });
      const token = await jwt.generateToken(jwtPayload);
      await expect(jwt.decodeToken(token)).rejects.toThrow(BadTokenError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should throw a InternalServerError.', async () => {
      verifySpy.mockImplementationOnce(() => {
        throw new Error('I am not an api specific error.');
      });
      const token = await jwt.generateToken(jwtPayload);
      await expect(jwt.decodeToken(token)).rejects.toThrow(InternalServerError);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
    it('should decode the token', async () => {
      const token = await jwt.generateToken(jwtPayload);
      await expect(jwt.decodeToken(token)).resolves.toStrictEqual(jwtPayload);
      expect(readFileSpy).toHaveBeenCalledTimes(2);
    });
  });
});
