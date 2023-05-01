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
  response
} from 'inversify-express-utils';
import IAuthController from '@interfaces/controller/IAuthController';

@controller('/v1/auth')
export default class UserController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  @httpPost('/login')
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

  @httpPost('/signup')
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

  @httpDelete('/logout')
  public async logout(
    @request() req: Request,
    @response() res: Response
  ): Promise<void> {
    const bool = await this.authService.logout(req.user);
    const apiSuccessResponse = new ApiSuccessResponse(res);
    if (bool) apiSuccessResponse.send({ message: 'logout success' });
    else apiSuccessResponse.send({ message: 'logout fail' });
  }
}
