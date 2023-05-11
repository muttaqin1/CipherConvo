import { ExtractObjValueTypes } from '@helpers/types';

export const TokenType = {
  VERIFY_ACCOUNT: 'VERIFY_ACCOUNT',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  RESET_PASSWORD: 'RESET_PASSWORD'
} as const;
export type TTokenType = ExtractObjValueTypes<typeof TokenType>;

export default interface ITwoFactorAuthToken {
  id: string;
  userId: string;
  token: string;
  tokenType: string;
  verified: boolean;
  tokenExpiry: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
