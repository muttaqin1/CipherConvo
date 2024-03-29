import { genSalt, hash } from 'bcryptjs';
import { Request } from 'express';
import {
  AccessTokenError,
  AuthFailureError,
  BadTokenError,
  ForbiddenError,
  InternalServerError
} from '@helpers/AppError/ApiError';
import {
  JWT,
  accessTokenSecret,
  passwordHashSaltRound,
  refreshTokenSecret
} from '@config/index';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import { inject, injectable } from 'inversify';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import IToken from '@interfaces/auth/IToken';
import IUser, { Password } from '@interfaces/models/IUser';
import { TokenExpiredError } from 'jsonwebtoken';
import JwtPayload from '@interfaces/auth/JwtPayload';
import TYPES from '@ioc/TYPES';
import IRole from '@interfaces/models/IRole';

@injectable()
export default class AuthUtils implements IAuthUtils {
  constructor(@inject(TYPES.JWT) private readonly jwt: IJsonWebToken) {}

  public async generateSalt(): Promise<string> {
    return genSalt(passwordHashSaltRound);
  }

  public async generatePassword(
    password: string,
    salt?: string
  ): Promise<Password> {
    const passSalt = salt || (await this.generateSalt());
    const hashedPassword = await hash(password, passSalt);
    return `${hashedPassword}:${passSalt}`;
  }

  public async validatePassword(
    enteredPassword: string,
    databaseSavedPassword: Password
  ): Promise<boolean> {
    const [password, salt] = databaseSavedPassword.split(':');
    if (!salt || !password) throw new InternalServerError();
    // @ts-ignore
    const genPass = await this.generatePassword(enteredPassword, salt);
    const generatedPassword = genPass?.split(':')[0];
    return generatedPassword === password;
  }

  public sanitizeAuthHeader(req: Request): string | undefined {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw new ForbiddenError('Authorization Failure');
    else if (!authHeader.match(/^Bearer/))
      throw new ForbiddenError('Authorization Failure');
    else if (!authHeader.split(' ')[1])
      throw new ForbiddenError('Authorization Failure');
    else return authHeader.split(' ')[1];
  }

  public verifyJwtPayload(payload: Record<string, any>): boolean {
    if (!payload) return false;
    if (!payload.iss || !payload.iat || !payload.sub || !payload.aud)
      return false;
    if (payload.iss !== JWT.iss) return false;
    if (payload.sub !== JWT.sub) return false;
    if (payload.aud !== JWT.aud) return false;
    return true;
  }

  private async generateAccessToken<
    T extends Pick<
    JwtPayload,
    'userId' | 'roleId' | 'email' | 'userName' | 'accessTokenKey'
    >
  >(payload: Required<T>): Promise<string> {
    return this.jwt.generateToken(
      {
        iss: JWT.iss,
        iat: Math.floor(Date.now() / 1000),
        sub: JWT.sub,
        aud: JWT.aud,
        exp: JWT.accessTokenExpiry,
        ...payload
      },
      accessTokenSecret
    );
  }

  private async generateRefreshToken<
    T extends Pick<
    JwtPayload,
    'userId' | 'roleId' | 'email' | 'userName' | 'refreshTokenKey'
    >
  >(payload: Required<T>): Promise<string> {
    return this.jwt.generateToken(
      {
        iss: JWT.iss,
        iat: Math.floor(Date.now() / 1000),
        sub: JWT.sub,
        aud: JWT.aud,
        exp: JWT.refreshTokenExpiry,
        ...payload
      },
      refreshTokenSecret
    );
  }

  public async generateTokens(
    user: Required<IUser>,
    role: Required<IRole>,
    accessTokenKey: string,
    refreshTokenKey: string
  ): Promise<IToken> {
    const payload = {
      userId: user.id,
      email: user.email,
      userName: user.userName,
      roleId: role.id
    } as const;
    try {
      const accessToken = await this.generateAccessToken({
        ...payload,
        accessTokenKey
      });
      const refreshToken = await this.generateRefreshToken({
        ...payload,
        refreshTokenKey
      });

      if (!accessToken || !refreshToken) throw new InternalServerError();
      return { accessToken, refreshToken };
    } catch (err) {
      if (err instanceof InternalServerError) throw err;
      throw new InternalServerError();
    }
  }

  public async verifyAccessToken(
    req: Request | null,
    socket?: boolean,
    accessToken?: string
  ): Promise<JwtPayload> {
    try {
      let token;
      if (req && !socket && !accessToken) {
        token = this.sanitizeAuthHeader(req);
        if (!token) throw new AuthFailureError();
      } else {
        token = accessToken;
        if (!token) throw new AuthFailureError();
      }
      const payload = await this.jwt.verifyToken(token, accessTokenSecret);
      if (!payload) throw new AuthFailureError();
      if (!this.verifyJwtPayload(payload)) throw new AuthFailureError();
      return payload;
    } catch (err) {
      if (err instanceof BadTokenError || err instanceof TokenExpiredError)
        throw new AccessTokenError();
      else throw err;
    }
  }

  public async decodeAccessToken(req: Request): Promise<JwtPayload> {
    try {
      const token = this.sanitizeAuthHeader(req);
      if (!token) throw new AuthFailureError();
      const payload = await this.jwt.decodeToken(token, accessTokenSecret);
      if (!payload) throw new AuthFailureError();
      if (!this.verifyJwtPayload(payload)) throw new AuthFailureError();
      return payload;
    } catch (err) {
      if (err instanceof BadTokenError) throw new AccessTokenError();
      else throw err;
    }
  }

  public async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    if (!refreshToken) throw new AuthFailureError();
    const payload = await this.jwt.verifyToken(
      refreshToken,
      refreshTokenSecret
    );
    if (!payload) throw new AuthFailureError();
    if (!this.verifyJwtPayload(payload)) throw new AuthFailureError();
    return payload;
  }
}
