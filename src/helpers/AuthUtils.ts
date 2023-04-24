import { genSalt, hash } from 'bcryptjs';
import { Request } from 'express';
import {
  ForbiddenError,
  InternalServerError
} from '@helpers/AppError/ApiError';
import { passwordHashSaltRound } from '@config/index';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import { injectable } from 'inversify';
import { Password } from '@interfaces/models/IUser';

@injectable()
export default class AuthUtils implements IAuthUtils {
  protected async generateSalt(): Promise<string> {
    return genSalt(passwordHashSaltRound);
  }

  public async generatePassword(
    password: string,
    salt: string
  ): Promise<Password> {
    const hashedPassword = await hash(password, salt);
    return `${hashedPassword}:${salt}`;
  }

  public async validatePassword(
    enteredPassword: string,
    databaseSavedPassword: Password
  ): Promise<boolean> {
    const [password, salt] = databaseSavedPassword.split(':');
    if (!salt || !password) throw new InternalServerError();
    const genPassWithEnteredPassAndDbSavedPassSalt =
      await this.generatePassword(enteredPassword, salt);
    const generatedPassword =
      genPassWithEnteredPassAndDbSavedPassSalt.split(':')[0];
    return generatedPassword === password;
  }

  private sanitizeAuthHeader(req: Request): string | undefined {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw new ForbiddenError('Authorization Failure');
    else if (!authHeader.match(/^Bearer/))
      throw new ForbiddenError('Authorization Failure');
    else if (!authHeader.split(' ')[1])
      throw new ForbiddenError('Authorization Failure');
    else return authHeader.split(' ')[0];
  }
}
