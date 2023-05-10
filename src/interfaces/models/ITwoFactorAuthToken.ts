export default interface ITwoFactorAuthToken {
  id: string;
  userId: string;
  token: string;
  tokenType: string;
  tokenExpiry: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
