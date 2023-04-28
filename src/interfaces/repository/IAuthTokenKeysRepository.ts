import { AuthTokenKeysInput, AuthTokenKeysOutput } from '@models/AuthTokenKeys';

export default interface IAuthTokenKeysRepository {
  create(data: AuthTokenKeysInput): Promise<AuthTokenKeysOutput>;
  findByAccessTokenKey(
    userId: string,
    accessTokenKey: string
  ): Promise<AuthTokenKeysOutput | null>;
  findByRefreshTokenKey(
    userId: string,
    refreshTokenKey: string
  ): Promise<AuthTokenKeysOutput | null>;
}
