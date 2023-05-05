import IToken from '@interfaces/auth/IToken';
import JwtPayload from '@interfaces/auth/JwtPayload';
import IUser, { Password } from '@interfaces/models/IUser';
import { Request } from 'express';

export default interface IAuthUtils {
  generateSalt(): Promise<string>;
  generatePassword(password: string, salt?: string): Promise<Password>;
  sanitizeAuthHeader(req: Request): string | undefined;
  verifyJwtPayload(payload: Record<string, any>): boolean;
  validatePassword(
    enteredPassword: string,
    databaseSavedPassword: Password
  ): Promise<boolean>;
  generateTokens(
    user: IUser,
    accessTokenKey: string,
    refreshTokenKey: string
  ): Promise<IToken>;
  verifyAccessToken(req: Request): Promise<JwtPayload>;
  decodeAccessToken(req: Request): Promise<JwtPayload>;
  verifyRefreshToken(refreshToken: string): Promise<JwtPayload>;
}
