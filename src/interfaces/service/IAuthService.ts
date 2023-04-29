import { loginInput } from '@interfaces/dao/IAuthDao';
import { loginResponse } from '@interfaces/response/authContollerResponse';

export default interface IAuthService {
  login(loginCredentials: loginInput): Promise<loginResponse>;
}
