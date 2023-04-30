import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import { userInput } from '@models/User';

export default interface IAuthService {
  login(loginCredentials: {
    userName?: string;
    email?: string;
    password: string;
  }): Promise<loginResponse>;
  signup(userData: userInput): Promise<singupResponse>;
}
