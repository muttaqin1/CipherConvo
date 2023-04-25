export default interface ITwoFactorAuthToken {
  id: string;
  userId: string;
  token: string;
  tokenType: string;
  tokenExpiry: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
