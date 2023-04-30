import IUserRepository, {
  notChangeable,
  UserIncludedRolesAndActivities
} from '@interfaces/repository/IUserRepository';
import User, { userInput, userOutput } from '@models/User';
import { inject, injectable } from 'inversify';
import TYPES from '@ioc/TYPES';
import IUser from '@interfaces/models/IUser';
import Role from '@models/Role';
import Activity from '@models/Activity';

@injectable()
export default class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.UserModel) private readonly userModel: typeof User,
    @inject(TYPES.RoleModel) private readonly roleModel: typeof Role,
    @inject(TYPES.ActivityModel) private readonly activityModel: typeof Activity
  ) {}

  public createUser(user: userInput): Promise<userOutput | null> {
    return this.userModel.create(user);
  }

  public findUserById(
    id: string
  ): Promise<UserIncludedRolesAndActivities | null> {
    return this.userModel.findByPk(id, {
      include: [
        { model: this.roleModel, as: 'roles' },
        { model: this.activityModel, as: 'activities' }
      ]
    }) as Promise<UserIncludedRolesAndActivities | null>;
  }

  public findUserByEmail(
    email: string
  ): Promise<UserIncludedRolesAndActivities | null> {
    return this.userModel.findOne({
      where: { email },
      include: [
        { model: this.roleModel, as: 'roles' },
        { model: this.activityModel, as: 'activities' }
      ]
    }) as Promise<UserIncludedRolesAndActivities | null>;
  }

  public findByUsername(
    userName: string
  ): Promise<UserIncludedRolesAndActivities | null> {
    return this.userModel.findOne({
      where: { userName },
      include: [
        { model: this.roleModel, as: 'roles' },
        { model: this.activityModel, as: 'activities' }
      ]
    }) as Promise<UserIncludedRolesAndActivities | null>;
  }

  public updateUser<T extends Partial<Omit<IUser, notChangeable>>>(
    userId: string,
    data: T
  ): Promise<[affectedCount: number]> {
    return this.userModel.update(data, {
      where: { id: userId },
      limit: 1
    });
  }

  public deleteUser(id: string): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }

  public setRoleAndActivityId(
    userId: string,
    roleId: string,
    activityId: string
  ): Promise<[affectedCount: number]> {
    return this.userModel.update(
      { roleId, activityId },
      { where: { id: userId } }
    );
  }
}
