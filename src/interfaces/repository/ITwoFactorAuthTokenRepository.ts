import {
  twoFactorAuthTokenInput,
  twoFactorAuthTokenOutput
} from '@models/TwoFactorAuthToken';

export default interface ITwoFactorAuthTokenRepository {
  findTokenByUserId(userId: string): Promise<twoFactorAuthTokenOutput | null>;
  createToken(
    tokenData: twoFactorAuthTokenInput
  ): Promise<twoFactorAuthTokenOutput>;
  deleteToken(userId: string): Promise<void>;
  findTokenByToken(token: string): Promise<twoFactorAuthTokenOutput | null>;
}
