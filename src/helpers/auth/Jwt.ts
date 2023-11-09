import {
} from '@config/index';
import {
  InternalServerError,
  IsApiError,
  ForbiddenError,
  BadTokenError,
  TokenExpiredError as _TokenExpiredError
} from '@helpers/AppError/ApiError';
import {
  sign,
  verify,
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError
} from 'jsonwebtoken';
import { promisify } from 'util';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import { injectable } from 'inversify';
import JwtPayload from '@interfaces/auth/JwtPayload';

const IsJsonWebTokenError = (err: unknown): err is JsonWebTokenError => err instanceof JsonWebTokenError;

@injectable()
export default class Jwt implements IJsonWebToken {
  public async generateToken(
    payload: JwtPayload,
    secrtKey: string
  ): Promise<string> {
    try {
      // @ts-ignore
      return (await promisify(sign)(payload, secrtKey)) as string;
    } catch (err) {
      if (IsJsonWebTokenError(err)) throw new InternalServerError();
      if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }

  public async verifyToken(
    token: string,
    secrtKey: string
  ): Promise<JwtPayload> {
    try {
      // @ts-ignore
      return (await promisify(verify)(token, secrtKey)) as JwtPayload;
    } catch (err) {
      // console.log(err);
      if (IsJsonWebTokenError(err)) {
        if (
          err
          && err instanceof TokenExpiredError
          && err.name === 'TokenExpiredError'
        )
          throw new _TokenExpiredError();
        else if (
          err
          && err instanceof NotBeforeError
          && err.name === 'NotBeforeError'
        ) {
          throw new ForbiddenError();
        } else throw new BadTokenError();
      } else if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }

  public async decodeToken(
    token: string,
    secrtKey: string
  ): Promise<JwtPayload> {
    try {
      // @ts-ignore
      return (await promisify(verify)(token, secrtKey, {
        ignoreExpiration: true
      })) as JwtPayload;
    } catch (err) {
      if (IsJsonWebTokenError(err)) throw new BadTokenError();
      else if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }
}
