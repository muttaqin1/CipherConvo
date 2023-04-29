import IUser from '@interfaces/models/IUser';
import { activityOutput } from '@models/Activity';
import { roleOutput } from '@models/Role';
import User, { userInput, userOutput } from '@models/User';

export type notChangeable =
  | 'userName'
  | 'email'
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

export interface UserIncludedRolesAndActivities extends userOutput {
  roles: roleOutput;
  activities: activityOutput | null;
}
export default interface IUserRepository {
  createUser(user: userInput): Promise<userOutput | null>;
  findUserById(id: string): Promise<UserIncludedRolesAndActivities | null>;
  findUserByEmail(
    email: string
  ): Promise<UserIncludedRolesAndActivities | null>;
  findByUsername(
    username: string
  ): Promise<UserIncludedRolesAndActivities | null>;
  updateUser<T extends Partial<Omit<Required<IUser>, notChangeable>>>(
    userId: string,
    data: T
  ): Promise<[affectedCount: number]>;
  deleteUser(id: string): Promise<number>;
  setRoleAndActivityId(
    userId: string,
    roleId: string,
    activityId: string
  ): Promise<[affectedCount: number]>;
}
