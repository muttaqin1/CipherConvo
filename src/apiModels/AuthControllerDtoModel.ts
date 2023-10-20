/* eslint-disable import/no-extraneous-dependencies */
import { ApiModel, ApiModelProperty, } from 'swagger-express-ts';

@ApiModel({
  description: 'Login Dto',
  name: 'LoginDto',
})
export class LoginDto {
  @ApiModelProperty({
    description: 'Email of the account.',
    example: 'example@gmail.com',
    required: false,
  })
    email?: string;

  @ApiModelProperty({
    description: 'Username of the account.',
    example: 'john1',
    required: false
  })
    userName?: string;

  @ApiModelProperty({
    description: 'Password of the account.',
    example: 'john@123',
    required: true,
  })
    password!: string;
}
@ApiModel({
  description: 'Signup dto.',
  name: 'SignupDto',
})

export class SignupDto {
  @ApiModelProperty({
    description: 'Id of the account.',
    example: 'ogmeogmoweowro234',
    required: true
  })
    id!: string;

  @ApiModelProperty({
    description: 'Username of the account.',
    example: 'john1',
    required: true
  })
    userName!: string;

  @ApiModelProperty({
    description: 'First name of the user.',
    example: 'Muhammad',
    required: true
  })
    firstName!: string;

  @ApiModelProperty({
    description: 'Last name of the user.',
    example: 'Muttaqin',
    required: true
  })
    lastName!: string;

  @ApiModelProperty({
    description: 'Email of the user.',
    example: 'example@gmail.com',
    required: true
  })
    email!: string;

  @ApiModelProperty({
    description: 'Password of the user.',
    example: 'john@1223',
    required: true
  })
    password!:string;

  @ApiModelProperty({
    description: 'Gender of the user.',
    example: 'male',
    enum: ['male', 'female'],
    required: true
  })
    gender!: string;

  @ApiModelProperty({
    description: 'Avatar of the user.',
    example: 'default.jpg',
    required: true
  })
    avatar!: string;

  @ApiModelProperty({
    description: 'Account create time.',
    example: new Date(Date.now()).toISOString(),
    required: true,
  })
    createdAt?: Date | undefined;

  @ApiModelProperty({
    description: 'Last account update time.',
    example: new Date(Date.now()).toISOString(),
    required: true
  })
    updatedAt?: Date | undefined;
}

@ApiModel({
  description: 'Token refresh dto.',
  name: 'TokenRefreshDto'
})
export class TokenRefreshDto {
  @ApiModelProperty({
    description: 'Refresh token',
    example: 'fmegoeneondfegpmrrognmgogne',
    required: true
  })
    refreshToken!:string;
}

@ApiModel({
  description: 'Verify account dto.',
  name: 'VerifyAccountDto'
})
export class VerifyAccountDto {
  @ApiModelProperty({
    description: 'email',
    example: 'example@gmail.com',
    required: true
  })
    email!:string;
}

@ApiModel({
  description: 'Verify verification token dto.',
  name: 'VerifyVerificationTokenDto'
})
export class VerifyVerificationToken {
  @ApiModelProperty({
    description: 'token',
    example: 'dfnwwqokwofhjwoij',
    required: true
  })
    token!:string;
}

@ApiModel({
  description: 'Reset password dto.',
  name: 'ResetPasswordDto'
})
export class ResetPasswordDto {
  @ApiModelProperty({
    description: 'new password',
    example: 'john@123',
    required: true
  })
    password!:string;
}
@ApiModel({
  description: 'Change password dto.',
  name: 'ChangePasswordDto'
})
export class ChangePasswordDto {
  @ApiModelProperty({
    description: 'old password of the user',
    example: 'john@123',
    required: true
  })
    oldPassword!:string;

  @ApiModelProperty({
    description: 'new password of the user.',
    example: 'doe@123',
    required: true
  })
    newassword!:string;
}
