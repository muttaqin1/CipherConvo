import { Container } from 'inversify';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import Jwt from '@helpers/Jwt';
import User from '@models/User';
import IUserRepository from '@interfaces/repository/IUserRepository';
import UserRepository from '@repositories/UserRepository';
import AuthTokenKeys from '@models/AuthTokenKeys';
import AuthTokenKeysRepository from '@repositories/AuthTokenKeysRepository';
import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import TYPES from '@ioc/TYPES';
/**
 * @description Container for dependency injection using inversify
 * @export container - Container instance for dependency injection
 */
const container = new Container();
// models
container.bind<typeof User>(TYPES.UserModel).toConstantValue(User);
container
  .bind<typeof AuthTokenKeys>(TYPES.AuthTokenKeys)
  .toConstantValue(AuthTokenKeys);

// repositories
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IAuthTokenKeysRepository>(TYPES.AuthTokenKeysRepository)
  .to(AuthTokenKeysRepository)
  .inSingletonScope();
// helpers
container.bind<IJsonWebToken>(TYPES.JWT).to(Jwt).inSingletonScope();
export default container;
