/* eslint-disable import/no-extraneous-dependencies */
import ApiSuccessResponse from '@helpers/ApiResponse/ApiSuccessResponse';
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
import { SuccessResponseCodes } from '@helpers/ApiResponse/BaseResponse';
import {
  // eslint-disable-next-line max-len
  ApiPath, ApiOperationPost, ApiOperationDelete, SwaggerDefinitionConstant, ApiOperationPut, ApiOperationGet,
} from 'swagger-express-ts';

@ApiPath({
  path: '/v1/auth',
  name: 'Auth Route',
  security: {
    bearerAuth: []
  },

})
@controller('/v1/auth')
export default class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService,
    @inject(TYPES.EmailService) private readonly emailService: IEmailService
  ) {}

  @ApiOperationPost({
    path: '/login',
    description: 'User can log in to their account using email or username',
    parameters: {
      body: {
        description: 'Login credentials.',
        required: true,
        model: 'LoginDto'
      },
    },
    security: {
    },
    responses: {
      200: { description: 'SUCCESS', model: 'LoginResponse' }
    },
  })
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
    new ApiSuccessResponse(res).send(responseData);
  }

  @ApiOperationPost({
    path: '/signup',
    description: 'User can create a new account by providing some info.',
    parameters: {
      body: {
        description: 'Signup data',
        required: true,
        model: 'SignupDto'
      },
    },
    security: {
    },
    responses: {
      201: { description: 'CREATED', model: 'SignupResponse' }
    },
  })
  @httpPost('/signup', signupLimiter, validate(signupSchema))
  public async signup(@request() req: Request, @response() res: Response) {
    const {
      userName, firstName, lastName, email, password, gender
    } = req.body;

    const responseData = await this.authService.signup({
      userName,
      firstName,
      lastName,
      email,
      password,
      gender
    });
    new ApiSuccessResponse(res)
      .status(SuccessResponseCodes.CREATED)
      .send(responseData);
  }

  @ApiOperationDelete({
    path: '/logout',
    description: 'User can log out from their account.',
    parameters: {
    },
    responses: {
      204: {
        description: 'No Content',
        type: SwaggerDefinitionConstant.OBJECT
      }
    }
  })
  @httpDelete('/logout', deserializeUser)
  public async logout(
    @request() req: Request,
      @response() res: Response
  ): Promise<void> {
    await this.authService.logout(req.user);
    new ApiSuccessResponse(res)
      .status(SuccessResponseCodes.NO_CONTENT)
      .send({ message: 'logout success' });
  }

  @ApiOperationPut({
    path: '/token-refresh',
    description: 'User can refresh their access token using the refresh token.',
    parameters: {
      body: {
        description: 'Token refresh credentials.',
        required: true,
        model: 'TokenRefreshDto'
      }
    },
    responses: {
      201: {
        description: 'CREATED',
        model: 'TokenModel'
      }
    }
  })
  @httpPut(
    '/token-refresh',
    deserializeUser,
    validate(tokenRefreshSchema)
  )
  public async tokenRefresh(
    @request() req: Request,
      @response() res: Response
  ): Promise<void> {
    const responseData = await this.authService.refreshTokens(req);
    new ApiSuccessResponse(res)
      .status(SuccessResponseCodes.CREATED)
      .send(responseData);
  }

  @ApiOperationPost({
    path: '/verify-account',
    description: 'User gets an verfication email. User can verify their account using their gmail account.',
    parameters: {
      body: {
        description: 'Verify account params.',
        required: true,
        model: 'VerifyAccountDto'
      }
    },
    responses: {
      201: {
        description: 'CREATED'
      }
    }
  })
  @httpPost('/verify-account', validate(emailSchema))
  public async verifyAccount(
  @request() req: Request,
    @response() res: Response
  ) {
    const { email } = req.body;
    await this.emailService.sendAccountVerificationEmail(email);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @ApiOperationPost({
    path: '/verify-email',
    description: 'User gets an verfication email. User can verify their gmail using their gmail account.',
    parameters: {
      body: {
        description: 'Verify email params.',
        required: true,
        model: 'VerifyAccountDto'
      }
    },
    responses: {
      202: {
        description: 'ACCEPTED'
      }
    }
  })
  @httpPost('/verify-email', validate(emailSchema))
  public async verifyEmail(@request() req: Request, @response() res: Response) {
    const { email } = req.body;
    await this.emailService.sendEmailVerificationEmail(email);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @ApiOperationPost({
    path: '/forgot-password',
    description: 'User gets a verification email. User can reset their password using their gmail account',
    parameters: {
      body: {
        description: 'Forgot password params.',
        required: true,
        model: 'VerifyAccountDto'
      }
    },
    responses: {
      202: {
        description: 'ACCEPTED'
      }
    }
  })
  @httpPost('/forgot-password', validate(emailSchema))
  public async forgotPassword(
  @request() req: Request,
    @response() res: Response
  ) {
    const { email } = req.body;
    await this.emailService.sendForgotPasswordVerificationEmail(email);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @ApiOperationGet({
    path: '/verify-verification-token/{token}',
    description: 'Verify the verification token.',
    parameters: {
      path: {
        token: { required: true, type: SwaggerDefinitionConstant.STRING }
      }
    },
    responses: {
      204: {
        description: 'NO_CONTENT'
      }
    }
  })
  @httpGet('/verify-verification-token/:token', validateParams(tokenSchema))
  public async verifyVerificationToken(
  @request() req: Request,
    @response() res: Response
  ) {
    const { token } = req.params;
    const result = await this.authService.verifyVerificationToken(
      token as string
    );
    new ApiSuccessResponse(res)
      .status(SuccessResponseCodes.NO_CONTENT)
      .send(result);
  }

  @ApiOperationPut({
    path: '/reset-password/{token}',
    description: "Reset's the password.",
    parameters: {
      body: {
        description: 'New password.',
        required: true,
        model: 'ResetPasswordDto'
      },
      path: {
        token: { required: true, type: SwaggerDefinitionConstant.STRING }
      }
    },
    responses: {
      204: {
        description: 'NO_CONTENT',
      }
    }
  })

  @httpPut('/reset-password/:token', validateParams(tokenSchema))
  public async resetPassword(
  @request() req: Request,
    @response() res: Response
  ) {
    const { token } = req.params;
    const { password } = req.body;
    await this.authService.resetPassword(token as string, password);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.NO_CONTENT).send({
      message: 'Password reset successfully.'
    });
  }

  @ApiOperationPut({
    path: '/change-password',
    description: 'User can change their password by providing their old password.',
    parameters: {
      body: {
        description: 'New password.',
        required: true,
        model: 'ChangePasswordDto'
      }
    },
    responses: {
      204: {
        description: 'NO_CONTENT',
      }
    }
  })

  @httpPut('/change-password', deserializeUser)
  public async changePassword(
  @request() req: Request,
    @response() res: Response
  ) {
    const { oldPassword, newPassword } = req.body;
    await this.authService.changePassword(req.user, oldPassword, newPassword);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.NO_CONTENT).send({
      message: 'Password changed successfully.'
    });
  }
}
