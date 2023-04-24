export default interface IRole {
  id: string;
  admin: boolean;
  user: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
