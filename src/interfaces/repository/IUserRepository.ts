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
  roles?: roleOutput;
  activities?: activityOutput;
}
export default interface IUserRepository {
  findUsers(): Promise<User[]>
  createUser(user: userInput): Promise<userOutput | null>;
  findUserById(
    id: string,
    options?: { role?: boolean; activity?: boolean }
  ): Promise<UserIncludedRolesAndActivities | null>;
  findUserByEmail(
    email: string,
    options?: { role?: boolean; activity?: boolean }
  ): Promise<UserIncludedRolesAndActivities | null>;
  findByUsername(
    username: string,
    options?: { role?: boolean; activity?: boolean }
  ): Promise<UserIncludedRolesAndActivities | null>;
  updateUser<T extends Partial<Omit<Required<IUser>, notChangeable>>>(
    userId: string,
    data: T
  ): Promise<[affectedCount: number]>;
  updateUsername(userId: string, userName: string): Promise<[affectedCount: number]>;
  deleteUser(id: string): Promise<number>;
}
