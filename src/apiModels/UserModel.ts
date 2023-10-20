/* eslint-disable import/no-extraneous-dependencies */
import { ApiModel, ApiModelProperty, } from 'swagger-express-ts';

@ApiModel({
  description: 'User Description',
  name: 'User',
})
export class UserModel {
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
