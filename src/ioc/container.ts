import { Container } from 'inversify';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import Jwt from '@helpers/Jwt';
import User from '@models/User';
import IUserRepository from '@interfaces/repository/IUserRepository';
import UserRepository from '@repositories/UserRepository';
import AuthTokenKeys from '@models/AuthTokenKeys';
import AuthTokenKeysRepository from '@repositories/AuthTokenKeysRepository';
import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import AuthUtils from '@helpers/AuthUtils';
import TYPES from '@ioc/TYPES';
import Role from '@models/Role';
import Activity from '@models/Activity';
import AuthService from '@services/AuthService';
import IAuthService from '@interfaces/service/IUserService';
/**
 * @description Container for dependency injection using inversify
 * @export container - Container instance for dependency injection
 */
const container = new Container();
// models
container.bind<typeof User>(TYPES.UserModel).toConstantValue(User);
container
  .bind<typeof AuthTokenKeys>(TYPES.AuthTokenKeysModel)
  .toConstantValue(AuthTokenKeys);
container.bind<typeof Role>(TYPES.RoleModel).toConstantValue(Role);
container.bind<typeof Activity>(TYPES.ActivityModel).toConstantValue(Activity);

// repositories
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IAuthTokenKeysRepository>(TYPES.AuthTokenKeysRepository)
  .to(AuthTokenKeysRepository)
  .inSingletonScope();

// services
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();

// helpers
container.bind<IJsonWebToken>(TYPES.JWT).to(Jwt).inSingletonScope();
container.bind<AuthUtils>(TYPES.AuthUtils).to(AuthUtils).inSingletonScope();

export default container;
