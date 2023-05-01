import { AuthTokenKeysInput, AuthTokenKeysOutput } from '@models/AuthTokenKeys';

export default interface IAuthTokenKeysRepository {
  createKeys(data: AuthTokenKeysInput): Promise<AuthTokenKeysOutput>;
  deleteKeys(userId: string): Promise<number>;
  find(data: {
    userId?: string;
    accessTokenKey?: string;
    refreshTokenKey?: string;
  }): Promise<AuthTokenKeysOutput | null>;
}
