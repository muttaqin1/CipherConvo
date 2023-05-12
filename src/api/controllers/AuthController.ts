import ApiSuccessResponse from '@helpers/ApiResponse/ApiSuccessResponse';
import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import TYPES from '@ioc/TYPES';
import { Response } from 'express';
import Request from '@interfaces/request';
import { inject } from 'inversify';
import IAuthService from '@interfaces/service/IAuthService';
import {
  controller,
  httpDelete,
  httpPost,
  request,
  response,
  httpPut,
  httpGet
} from 'inversify-express-utils';
import IAuthController from '@interfaces/controller/IAuthController';
import {
  validateSchema as validate,
  validateParamSchema as validateParams
} from '@middlewares/validators/validateSchema';
import {
  emailSchema,
  loginSchema,
  signupSchema,
  tokenRefreshSchema,
  tokenSchema
} from '@middlewares/validators/schema/auth';
import { deserializeUser } from '@auth/deserializeUser';
import { signupLimiter } from '@middlewares/rateLimit';
import IEmailService from '@interfaces/service/IEmailService';

@controller('/v1/auth')
export default class UserController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService
  ) {}

  @httpPost('/login', validate(loginSchema))
  public async login(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const { userName, email, password } = req.body;
    const responseData = await this.authService.login({
      userName,
      email,
      password
    });
    new ApiSuccessResponse(res).send<loginResponse>(responseData);
  }

  @httpPost('/signup', signupLimiter, validate(signupSchema))
  public async signup(@request() req: Request, @response() res: Response) {
    const { userName, firstName, lastName, email, password, gender, avatar } =
      req.body;

    const responseData = await this.authService.signup({
      userName,
      firstName,
      lastName,
      email,
      password,
      gender,
      avatar
    });
    new ApiSuccessResponse(res).send<singupResponse>(responseData);
  }

  @httpDelete('/logout', deserializeUser)
  public async logout(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    await this.authService.logout(req.user);
    new ApiSuccessResponse(res).send({ message: 'logout success' });
  }

  @httpPut('/token-refresh', deserializeUser, validate(tokenRefreshSchema))
  public async tokenRefresh(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const responseData = await this.authService.refreshTokens(req);
    new ApiSuccessResponse(res).send(responseData);
  }

  @httpPost('/verify-account', validate(emailSchema))
  public async verifyAccount(
    @request() req: Request,
    @response() res: Response
  ) {
    const { email } = req.body;
    await this.emailService.sendAccountVerificationEmail(email);
    new ApiSuccessResponse(res).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @httpPost('/verify-email', validate(emailSchema))
  public async verifyEmail(@request() req: Request, @response() res: Response) {
    const { email } = req.body;
    await this.emailService.sendEmailVerificationEmail(email);
    new ApiSuccessResponse(res).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @httpPost('/forgot-password', validate(emailSchema))
  public async forgotPassword(
    @request() req: Request,
    @response() res: Response
  ) {
    const { email } = req.body;
    await this.emailService.sendForgotPasswordVerificationEmail(email);
    new ApiSuccessResponse(res).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @httpGet('/verify-verification-token/:token', validateParams(tokenSchema))
  public async verifyVerificationToken(
    @request() req: Request,
    @response() res: Response
  ) {
    const { token } = req.params;
    const result = await this.authService.verifyVerificationToken(
      token as string
    );
    new ApiSuccessResponse(res).send(result);
  }

  @httpPut('/reset-password/:token', validateParams(tokenSchema))
  public async resetPassword(
    @request() req: Request,
    @response() res: Response
  ) {
    const { token } = req.params;
    const { password } = req.body;
    await this.authService.resetPassword(token as string, password);
    new ApiSuccessResponse(res).send({
      message: 'Password reset successfully.'
    });
  }

  @httpPut('/change-password', deserializeUser)
  public async changePassword(
    @request() req: Request,
    @response() res: Response
  ) {
    const { oldPassword, newPassword } = req.body;
    await this.authService.changePassword(req.user, oldPassword, newPassword);
    new ApiSuccessResponse(res).send({
      message: 'Password changed successfully.'
    });
  }
}
