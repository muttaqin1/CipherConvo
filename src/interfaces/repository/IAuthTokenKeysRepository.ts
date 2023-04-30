import { AuthTokenKeysInput, AuthTokenKeysOutput } from '@models/AuthTokenKeys';

export default interface IAuthTokenKeysRepository {
  createKeys(data: AuthTokenKeysInput): Promise<AuthTokenKeysOutput>;
  findByAccessTokenKey(
    userId: string,
    accessTokenKey: string
  ): Promise<AuthTokenKeysOutput | null>;
  findByRefreshTokenKey(
    userId: string,
    refreshTokenKey: string
  ): Promise<AuthTokenKeysOutput | null>;
  deleteKeys(userId: string): Promise<number>;
  findByUserId(userId: string): Promise<AuthTokenKeysOutput | null>;
}
