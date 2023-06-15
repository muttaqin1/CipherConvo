import { Container } from 'inversify';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import Jwt from '@helpers/auth/Jwt';
import User from '@models/User';
import IUserRepository from '@interfaces/repository/IUserRepository';
import UserRepository from '@repositories/UserRepository';
import AuthTokenKeys from '@models/AuthTokenKeys';
import AuthTokenKeysRepository from '@repositories/AuthTokenKeysRepository';
import IAuthTokenKeysRepository from '@interfaces/repository/IAuthTokenKeysRepository';
import AuthUtils from '@helpers/auth/AuthUtils';
import TYPES from '@ioc/TYPES';
import Role from '@models/Role';
import Activity from '@models/Activity';
import AuthService from '@services/AuthService';
import IAuthService from '@interfaces/service/IAuthService';
import IActivityRepository from '@interfaces/repository/IActivityRepository';
import IRoleRepository from '@interfaces/repository/IRoleRepository';
import ActivityRepository from '@repositories/ActivityRepository';
import RoleRepository from '@repositories/RoleRepository';
import IEmailService from '@interfaces/service/IEmailService';
import EmailService from '@services/EmailService';
import TwoFactorAuthToken from '@models/TwoFactorAuthToken';
import ITwoFactorAuthTokenRepository from '@interfaces/repository/ITwoFactorAuthTokenRepository';
import TwoFactorAuthTokenRepository from '@repositories/TwoFactorAuthTokenRepository';
import nodeMailer from 'nodemailer';
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
container
  .bind<typeof TwoFactorAuthToken>(TYPES.TwoFactorAuthToken)
  .toConstantValue(TwoFactorAuthToken);

// repositories
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<IAuthTokenKeysRepository>(TYPES.AuthTokenKeysRepository)
  .to(AuthTokenKeysRepository)
  .inSingletonScope();
container
  .bind<IActivityRepository>(TYPES.ActivityRepository)
  .to(ActivityRepository)
  .inSingletonScope();
container
  .bind<IRoleRepository>(TYPES.RoleRepository)
  .to(RoleRepository)
  .inSingletonScope();

// services
container
  .bind<IAuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<IEmailService>(TYPES.EmailService)
  .to(EmailService)
  .inSingletonScope();
container
  .bind<ITwoFactorAuthTokenRepository>(TYPES.TwoFactorAuthTokenRepository)
  .to(TwoFactorAuthTokenRepository)
  .inSingletonScope();

// helpers
container.bind<IJsonWebToken>(TYPES.JWT).to(Jwt).inSingletonScope();
container.bind<AuthUtils>(TYPES.AuthUtils).to(AuthUtils).inSingletonScope();

// libraries
container.bind<typeof nodeMailer>(TYPES.NodeMailer).toConstantValue(nodeMailer);

export default container;
