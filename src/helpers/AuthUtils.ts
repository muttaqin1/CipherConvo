import { genSalt, hash } from 'bcryptjs';
import { passwordHashSaltRound } from '@config/index';
import IAuthUtils from '@interfaces/auth/IAuthUtils';
import { injectable } from 'inversify';
import { Password } from '@interfaces/models/IUser';
import { InternalServerError } from '@helpers/AppError/ApiError';

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
}
