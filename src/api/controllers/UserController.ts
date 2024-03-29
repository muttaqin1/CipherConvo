import * as express from 'express';
import {
  interfaces,
  controller,
  httpGet,
  httpDelete,
  request,
  response,
  httpPut
} from 'inversify-express-utils';
import { inject } from 'inversify';
import UserRepository from '@repositories/UserRepository';
import TYPES from '@ioc/TYPES';
import Request from '@interfaces/request';
import { SuccessResponseCodes } from '@helpers/ApiResponse/BaseResponse';
import ApiSuccessResponse from '@helpers/ApiResponse/ApiSuccessResponse';
import ApiErrorResponse from '@helpers/ApiResponse/ApiErrorResponse';
import EmailService from '@services/EmailService';
import IAuthService from '@interfaces/service/IAuthService';
import ITwoFactorAuthTokenRepository from '@interfaces/repository/ITwoFactorAuthTokenRepository';
import { BadTokenError, NotFoundError } from '@helpers/AppError/ApiError';
import { deserializeUser } from '@auth/deserializeUser';

import { validateSchema as validate } from '@middlewares/validators/validateSchema';
import {
  updateSchema,
  usernameSchema
} from '@middlewares/validators/schema/auth';
import UserService from '@services/UserService';
import {
  // eslint-disable-next-line max-len
  ApiPath,
  ApiOperationGet,
  SwaggerDefinitionConstant,
  ApiOperationPut,
  ApiOperationDelete
} from 'swagger-express-ts';

@ApiPath({
  path: '/v1/user',
  name: 'User Route',
  security: {
    bearerAuth: []
  }
})
@controller('/v1/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.EmailService) private readonly emailService: EmailService,
    @inject(TYPES.AuthService) private readonly authService: IAuthService,
    @inject(TYPES.TwoFactorAuthTokenRepository)
    private readonly twoFactorAuthTokenRepo: ITwoFactorAuthTokenRepository,
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {}

  @ApiOperationGet({
    path: '/',
    description: 'User can get all the users',
    security: {},
    responses: {
      200: {
        description: 'SUCCESS',
        model: 'UserModel',
        type: SwaggerDefinitionConstant.ARRAY
      }
    }
  })
  // Get all users
  @httpGet('/')
  public async getUsers(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const users = await this.userRepository.findUsers();
    new ApiSuccessResponse(res)
      .status(SuccessResponseCodes.SUCCESS)
      .send(users);
  }

  @ApiOperationGet({
    path: '/{userId}',
    description: 'User can get their credentials',
    security: {},
    parameters: {
      path: {
        userId: {
          required: true,
          type: SwaggerDefinitionConstant.STRING,
          description: 'User Id'
        }
      }
    },
    responses: {
      201: { description: 'SUCCESSFUL', model: 'UserModel' }
    }
  })
  // Get user by id
  @httpGet('/:id')
  public async getUser(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const { id } = req.params;
    const user = await this.userRepository.findUserById(id as string);
    user != null
      ? new ApiSuccessResponse(res)
          .status(SuccessResponseCodes.SUCCESS)
          .send(user)
      : new ApiErrorResponse(res).send(
          new NotFoundError(`User with ${id} not found`)
        );
  }

  @ApiOperationPut({
    path: '/update-username',
    description: 'User can update their username',
    parameters: {
      body: {
        description: 'New Username',
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        model: 'UpdateUsernameDto'
      }
    },
    responses: {
      202: { description: 'ACCEPTED' }
    }
  })
  // update username by id
  @httpPut('/update-username', deserializeUser, validate(usernameSchema))
  public async changeUsername(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const { userName: newUsername } = req.body;
    this.userService.updateUsername(req.user.id, newUsername);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: `New Username : '${newUsername}' has updated successfully.`
    });
  }

  @ApiOperationDelete({
    path: '/delete-account',
    description:
      'Upon submitting a request to delete their account, User will receive an email confirming their request and providing a link to click to permanently delete their account.',
    parameters: {},
    responses: {
      201: { description: 'ACCEPTED' }
    }
  })
  // Send a verification email to user
  @httpDelete('/delete-account', deserializeUser)
  public async removeAccount(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const email = req.user.email;
    await this.emailService.sendEmailVerificationEmail(email);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: 'A verification email has been sended to your email account.'
    });
  }

  @ApiOperationGet({
    path: '/verify-account-deletion/{token}',
    description:
      'Users can delete their account by clicking on the link in the email that they receive after requesting to delete their account',
    parameters: {
      path: {
        token: {
          description: 'Verification Token',
          required: true,
          type: SwaggerDefinitionConstant.STRING
        }
      }
    },
    security: {},
    responses: {
      202: { description: 'ACCEPTED' }
    }
  })
  // Verify and delete user by token
  @httpGet('/verify-account-deletion/:token')
  public async verifyAndRemoveAccount(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const { token } = req.params;
    const result = await this.authService.verifyVerificationToken(
      token as string
    );
    if (result.emailVerified) {
      const tokenOutput = await this.twoFactorAuthTokenRepo.findTokenByToken(
        token as string
      );
      if (tokenOutput) {
        await this.userRepository.deleteUser(tokenOutput.userId);
        new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
          message: `User with id ${tokenOutput.userId} deleted Successfully`
        });
      } else {
        new ApiErrorResponse(res).send(
          new BadTokenError(`Token ${token} does not exist or has been removed`)
        );
      }
    } else {
      new ApiErrorResponse(res).send(
        new BadTokenError(`${token} : Email is not verified`)
      );
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'User can update their credentials',
    parameters: {
      body: {
        description: 'Updated Credentials',
        required: true,
        model: 'UpdateUserDTO'
      }
    },
    responses: {
      202: { description: 'ACCEPTED' }
    }
  })
  // Update User except username, email and password
  @httpPut('/update', deserializeUser, validate(updateSchema))
  public async changeUserDetails(
    @request() req: Request,
    @response() res: express.Response
  ) {
    const userId = req.user.id;
    const updatableUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender
    };
    await this.userRepository.updateUser(userId, updatableUser);
    new ApiSuccessResponse(res).status(SuccessResponseCodes.ACCEPTED).send({
      message: `User with id ${userId} has been updated successfully.`
    });
  }
}
