import 'reflect-metadata';
import Jwt from '../../../../src/helpers/Jwt';
import IJwt from '../../../../src/interfaces/helpers/IJsonWebToken';
import { InternalServerError } from '../../../../src/helpers/AppError/ApiError';
import { readFileSpy } from './mock';
import { JWT } from '../../../../src/config/index';

const jwtPayload = {
  userId: '123',
  email: 'test@gmail.com',
  userName: 'test1',
  roleId: '123',
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

});
