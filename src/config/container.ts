import { Container } from 'inversify';
import IJsonWebToken from '@interfaces/helpers/IJsonWebToken';
import Jwt from '@helpers/Jwt';
import { IUserService, UserService } from '@services/UserService';
/**
 * @description Container for dependency injection using inversify
 * @export container - Container instance for dependency injection
 */
const container = new Container();

// helpers
container.bind<IJsonWebToken>(Jwt).toSelf();
container.bind<IUserService>(UserService).toSelf();
export default container;
