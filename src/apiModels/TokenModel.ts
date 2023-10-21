/* eslint-disable import/no-extraneous-dependencies */
import IToken from '@interfaces/auth/IToken';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Token Description',
  name: 'TokenModel',
})
export class TokenModel implements IToken {
  @ApiModelProperty({
    description: 'Access token.',
    example: 'fmoegnoafmwofm',
    required: true
  })
    accessToken!: string;

  @ApiModelProperty({
    description: 'Refresh token.',
    example: 'fegoigmeogmeoemm',
    required: true
  })
    refreshToken!: string;
}
