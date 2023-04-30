import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import TYPES from '@ioc/TYPES';
import AuthTokenKeys, {
  AuthTokenKeysInput,
  AuthTokenKeysOutput
} from '@models/AuthTokenKeys';
import { injectable, inject } from 'inversify';

@injectable()
export default class AuthTokenKeysRepository
  implements IAuthTokenKeysRepository
{
  constructor(
    @inject(TYPES.AuthTokenKeysModel)
    private readonly authTokeKeys: typeof AuthTokenKeys
  ) {}

  public findByUserId(userId: string): Promise<AuthTokenKeysOutput | null> {
    return this.authTokeKeys.findOne({ where: { userId } });
  }

  public deleteKeys(userId: string): Promise<number> {
    return this.authTokeKeys.destroy({ where: { userId } });
  }

  public createKeys(data: AuthTokenKeysInput): Promise<AuthTokenKeysOutput> {
    return this.authTokeKeys.create(data);
  }

  public findByAccessTokenKey(
    userId: string,
    accessTokenKey: string
  ): Promise<AuthTokenKeysOutput | null> {
    return this.authTokeKeys.findOne({ where: { userId, accessTokenKey } });
  }

  findByRefreshTokenKey(
    userId: string,
    refreshTokenKey: string
  ): Promise<AuthTokenKeysOutput | null> {
    return this.authTokeKeys.findOne({ where: { userId, refreshTokenKey } });
  }
}
