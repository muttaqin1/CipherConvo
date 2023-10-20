/* eslint-disable import/no-extraneous-dependencies */
import IRole from '@interfaces/models/IRole';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Role Description',
  name: 'RoleModel',
})
export class RoleModel implements IRole {
  @ApiModelProperty({
    description: 'Id of the role record.',
    example: 'ogmeogmoweowro234',
    required: true
  })
    id!: string;

  @ApiModelProperty({
    description: 'A boolean value to describe user autorities.',
    example: 'true',
    required: true
  })
    admin!: boolean;

  @ApiModelProperty({
    description: 'A boolean value to describe user autorities.',
    example: 'true',
    required: true
  })
    user!: boolean;

  @ApiModelProperty({
    description: 'Id of the user.',
    example: 'fegegeqwt3r3323435r3',
    required: true
  })
    userId!: string;

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
