import ITwoFactorAuthTokenRepository from '@interfaces/repository/ITwoFactorAuthTokenRepository';
import { inject, injectable } from 'inversify';
import TYPES from '@ioc/TYPES';
import TwoFactorAuthToken, {
  twoFactorAuthTokenInput,
  twoFactorAuthTokenOutput
} from '@models/TwoFactorAuthToken';

@injectable()
export default class TwoFactorAuthTokenRepository
  implements ITwoFactorAuthTokenRepository
{
  constructor(
    @inject(TYPES.TwoFactorAuthToken)
    private readonly TwoFactorAuthTokenModel: typeof TwoFactorAuthToken
  ) {}

  public async findTokenByUserId(
    userId: string
  ): Promise<twoFactorAuthTokenOutput | null> {
    return this.TwoFactorAuthTokenModel.findOne({
      where: { userId }
    });
  }

  public async createToken(
    tokenData: twoFactorAuthTokenInput
  ): Promise<twoFactorAuthTokenOutput> {
    return this.TwoFactorAuthTokenModel.create(tokenData);
  }

  public async deleteToken(userId: string): Promise<void> {
    this.TwoFactorAuthTokenModel.destroy({
      where: { userId }
    });
  }
}
