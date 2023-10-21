import { InternalServerError } from '@helpers/AppError/ApiError';
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
    private readonly authTokenKeys: typeof AuthTokenKeys
  ) {}

  public deleteKeys(userId: string): Promise<number> {
    return this.authTokenKeys.destroy({ where: { userId } });
  }

  public async createKeys(
    data: AuthTokenKeysInput
  ): Promise<AuthTokenKeysOutput> {
    try {
      return await this.authTokenKeys.create(data, {
        fields: ['userId', 'accessTokenKey', 'refreshTokenKey']
      });
    } catch (e) {
      throw new InternalServerError('Error while creating auth token keys');
    }
  }

  public findKeys(data: {
    userId?: string;
    accessTokenKey?: string;
    refreshTokenKey?: string;
  }): Promise<AuthTokenKeysOutput | null> {
    return this.authTokenKeys.findOne({ where: data });
  }
}
