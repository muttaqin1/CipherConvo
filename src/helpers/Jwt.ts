import { keyDirPath } from '@config/index';
import {
  InternalServerError,
  IsApiError,
  ForbiddenError,
  BadTokenError,
  TokenExpiredError as _TokenExpiredError
} from '@helpers/AppError/ApiError';
import { Encoding } from 'crypto';
import { readFile } from 'fs/promises';
import {
  sign,
  verify,
  TokenExpiredError,
  NotBeforeError,
  JsonWebTokenError
} from 'jsonwebtoken';
import { promisify } from 'util';
import Logger from '@helpers/Logger';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import { injectable } from 'inversify';
import JwtPayload from '@interfaces/auth/JwtPayload';

const IsJsonWebTokenError = (err: unknown): err is JsonWebTokenError =>
  err instanceof JsonWebTokenError;

@injectable()
export default class Jwt implements IJsonWebToken {
  // eslint-disable-next-line class-methods-use-this
  protected getKeysPath(): { pubKeyPath: string; privKeyPath: string } {
    return {
      pubKeyPath: `${keyDirPath}/public.pem`,
      privKeyPath: `${keyDirPath}/private.pem`
    };
  }

  protected async readPublicKey<T extends Encoding>(
    encoding: T
  ): Promise<string> {
    const { pubKeyPath } = this.getKeysPath();
    return readFile(pubKeyPath, {
      encoding: encoding || 'utf8'
    });
  }

  protected async readPrivateKey<T extends Encoding>(
    encoding: T
  ): Promise<string> {
    const { privKeyPath } = this.getKeysPath();
    return readFile(privKeyPath, {
      encoding: encoding || 'utf8'
    });
  }

  public async generateToken(payload: JwtPayload): Promise<string> {
    try {
      const privateKey = await this.readPrivateKey('utf8');
      if (!privateKey) throw new InternalServerError();
      // @ts-ignore
      const token = promisify(sign)(payload, privateKey, {
        algorithm: 'RS256'
      }) as string;
      if (token) return token;
      throw new InternalServerError('Failed To Generate  Token');
    } catch (err) {
      if (IsJsonWebTokenError(err)) {
        Logger.debug(err);
        throw new InternalServerError();
      }
      // without checking IsApiError we can not use err.message property;
      if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }

  public async verifyToken(token: string): Promise<JwtPayload> {
    try {
      const publicKey = await this.readPublicKey('utf8');
      if (!publicKey) throw new InternalServerError();
      // @ts-ignore
      const payload = (await promisify(verify)(token, publicKey)) as JwtPayload;
      return payload;
    } catch (err) {
      if (IsJsonWebTokenError(err)) {
        if (
          err &&
          err instanceof TokenExpiredError &&
          err.name === 'TokenExpiredError'
        )
          throw new _TokenExpiredError();
        else if (
          err &&
          err instanceof NotBeforeError &&
          err.name === 'NotBeforeError'
        ) {
          throw new ForbiddenError();
        } else throw new BadTokenError();
      }
      // without checking IsApiError we can not use err.message property;
      else if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }

  public async decodeToken(token: string): Promise<JwtPayload> {
    try {
      const publicKey = await this.readPublicKey('utf8');
      if (!publicKey) throw new InternalServerError('Error Reading Key');
      // @ts-ignore
      const payload = (await promisify(verify)(token, publicKey, {
        ignoreExpiration: true
      })) as JwtPayload;
      if (payload) return payload;
      throw new InternalServerError('Failed To Decode Token');
    } catch (err) {
      if (IsJsonWebTokenError(err)) throw new BadTokenError();
      // without checking IsApiError we can not use err.message property;
      else if (IsApiError(err)) throw new InternalServerError(err.message);
      else throw new InternalServerError();
    }
  }
}
