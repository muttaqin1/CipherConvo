export default interface IAuthTokenKeys {
  id:string;
  userId: string;
  accessTokenKey: string;
  refreshTokenKey: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
