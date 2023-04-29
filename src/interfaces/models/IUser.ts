export type Password = `${string}:${string}`;

export default interface IUser {
  id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: Password | null;
  gender: string;
  activityId: string | null;
  roleId: string | null;
  avatar: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
