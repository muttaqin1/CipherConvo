import IToken from '@interfaces/auth/IToken';
import JwtPayload from '@interfaces/auth/JwtPayload';
import IUser from '@interfaces/models/IUser';
import { Request } from 'express';

export default interface IAuthUtils {
  generatePassword(password: string, salt: string): Promise<string>;
  validatePassword(
    enteredPassword: string,
    databaseSavedPassword: string
  ): Promise<boolean>;
  generateTokens(
    user: IUser,
    accessTokenKey: string,
    refreshTokenKey: string
  ): Promise<IToken>;
  verifyAccessToken(req: Request): Promise<JwtPayload>;
}
