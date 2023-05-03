import 'reflect-metadata';
import { mockGenToken, MockJwt } from './mock';
import AuthUtils from '../../../../src/helpers/AuthUtils';
import IAuthUtils from '../../../../src/interfaces/helpers/IAuthUtils';
import IJsonWebToken from '../../../../src/interfaces/helpers/IJsonWebToken';
import { randomBytes } from 'crypto';
import IUser from '../../../../src/interfaces/models/IUser';
import { InternalServerError } from '../../../../src/helpers/AppError/ApiError';
import ErrorMsg from '../../../../src/helpers/AppError/errorMessages';

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
describe('Helper Class: AuthUtils', () => {
  describe('Method: generateAccessToken', () => {
    let authUtils: IAuthUtils;
    beforeEach(() => {
      authUtils = new AuthUtils(new MockJwt() as IJsonWebToken);
      mockGenToken.mockClear();
    });

    it('should generate access and refresh token', async () => {
      const token = await authUtils.generateTokens(
        user,
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
          user,
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
          user,
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
});
