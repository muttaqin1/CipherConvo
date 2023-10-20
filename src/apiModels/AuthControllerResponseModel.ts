/* eslint-disable import/no-extraneous-dependencies */
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { UserModel } from './UserModel';
import { RoleModel } from './RoleModel';
import { TokenModel } from './TokenModel';

@ApiModel({
  description: 'Login response',
  name: 'LoginResponse',
})
export class LoginResponse {
  @ApiModelProperty({
    description: 'User data.',
    required: true,
    model: 'User'
  })
    user!: UserModel;

  @ApiModelProperty({
    description: 'Role data.',
    required: true,
    model: 'RoleModel'
  })
    roles!:RoleModel;

  @ApiModelProperty({
    description: 'Token data.',
    required: true,
    model: 'TokenModel'
  })
    tokens!:TokenModel;
}
@ApiModel({
  description: 'Signup response',
  name: 'SignupResponse',
})
export class SignupResponse {
  @ApiModelProperty({
    description: 'User data.',
    required: true,
    model: 'User'
  })
    user!: UserModel;

  @ApiModelProperty({
    description: 'Role data.',
    required: true,
    model: 'RoleModel'
  })
    roles!:RoleModel;

  @ApiModelProperty({
    description: 'Token data.',
    required: true,
    model: 'TokenModel'
  })
    tokens!:TokenModel;
}
// @ApiModel({
//   description: 'Token refresh response',
//   name: 'TokenRefreshResponse'
// })
// export class TokenRefreshResponse {

// }
