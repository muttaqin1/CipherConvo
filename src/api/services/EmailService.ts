import nodemailer, { Transporter } from 'nodemailer';
import {
  AuthFailureError,
  BadRequestError,
  InternalServerError,
  IsApiError
} from '@helpers/AppError/ApiError';
import { smtp, clientURL, twoFactorAuthTokenExpiry } from '@config/index';
import { injectable, inject } from 'inversify';
import IEmailService from '@interfaces/service/IEmailService';
import { randomBytes } from 'crypto';
import ITwoFactorAuthTokenRepository from '@interfaces/repository/ITwoFactorAuthTokenRepository';
import TYPES from '@ioc/TYPES';
import IUserRepository from '@interfaces/repository/IUserRepository';
import { TokenType, TTokenType } from '@interfaces/models/ITwoFactorAuthToken';

@injectable()
export default class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor(
    @inject(TYPES.TwoFactorAuthTokenRepository)
    private readonly twoFactorAuthTokenRepository: ITwoFactorAuthTokenRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtp.email ? smtp.email : '',
        pass: smtp.password ? smtp.password : ''
      },
      port: smtp.port,
      host: smtp.host
    });
  }

  private sendEmail(to: string, subject: string, text: string): void {
    const mailOptions = {
      from: smtp.email ? smtp.email : '',
      to,
      subject,
      text
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) throw new InternalServerError();
    });
  }

  private async generateVerificationToken(
    userId: string,
    type: TTokenType
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await this.twoFactorAuthTokenRepository.deleteToken(userId);
    await this.twoFactorAuthTokenRepository.createToken({
      token,
      tokenExpiry: twoFactorAuthTokenExpiry,
      verified: false,
      userId,
      tokenType: type
    });
    return token;
  }

  public async sendAccountVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findUserByEmail(email, {
        activity: true
      });
      if (!user || !user.activities)
        throw new AuthFailureError('User not found');
      if (!user.activities.accessRestricted)
        throw new BadRequestError('Account is already verified');
      const token = await this.generateVerificationToken(
        user.id,
        TokenType.VERIFY_ACCOUNT
      );
      const subject = 'Verify your account';
      const text = `Please verify your account by clicking the link: ${clientURL}/api/v1/auth/verify-verification-token/${token}`;
      this.sendEmail(email, subject, text);
    } catch (err) {
      if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }

  public async sendEmailVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findUserByEmail(email, {
        activity: true
      });
      if (!user || !user.activities)
        throw new AuthFailureError('User not found');
      if (!user.activities.emailVerified)
        throw new BadRequestError('Email is already verified');
      const token = await this.generateVerificationToken(
        user.id,
        TokenType.VERIFY_EMAIL
      );
      const subject = 'Verify your email';
      const text = `Please verify your email by clicking the link: ${clientURL}/api/v1/auth/verify-verification-token/${token}`;
      this.sendEmail(email, subject, text);
    } catch (err) {
      if (IsApiError(err)) throw err;
      else throw new InternalServerError();
    }
  }
}
