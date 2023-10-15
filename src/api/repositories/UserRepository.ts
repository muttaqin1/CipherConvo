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

  public findUsers(): Promise<User[]>{
    return this.userModel.findAll();
  }

  public async createUser(user: userInput): Promise<userOutput | null> {
    return this.userModel.create(user);
  }

  public findUserById(
    id: string,
    options?: {
      role?: boolean;
      activity?: boolean;
    }
  ): Promise<UserIncludedRolesAndActivities | null> {
    const include = [];
    if (options?.role) include.push({ model: this.roleModel, as: 'roles' });
    if (options?.activity)
      include.push({ model: this.activityModel, as: 'activities' });
    return this.userModel.findOne({
      where: { id },
      include
    });
  }

  public findUserByEmail(
    email: string,
    options?: {
      role?: boolean;
      activity?: boolean;
    }
  ): Promise<UserIncludedRolesAndActivities | null> {
    const include = [];
    if (options?.role) include.push({ model: this.roleModel, as: 'roles' });
    if (options?.activity)
      include.push({ model: this.activityModel, as: 'activities' });
    return this.userModel.findOne({
      where: { email },
      include
    });
  }

  public findByUsername(
    userName: string,
    options?: {
      role?: boolean;
      activity?: boolean;
    }
  ): Promise<UserIncludedRolesAndActivities | null> {
    const include = [];
    if (options?.role) include.push({ model: this.roleModel, as: 'roles' });
    if (options?.activity)
      include.push({ model: this.activityModel, as: 'activities' });
    return this.userModel.findOne({
      where: { userName },
      include
    });
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

  public updateUserExceptUsernameEmailAndPassword<T extends Partial<Omit<IUser, 'userName' | 'email' | 'password' >>>(
    userId: string,
    data: T
  ): Promise<[affectedCount: number]>{
    return this.userModel.update(data,{
      where: {id: userId},
      limit: 1
    })
  }

  public updateUsername(
    userId: string,
    userName: string
  ): Promise<[affectedCount: number]>{
    return this.userModel.update({userName: userName},{
      where: { id: userId},
      limit: 1
    }
    );
  }

  public deleteUser(id: string): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }
}