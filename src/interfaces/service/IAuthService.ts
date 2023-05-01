import { UserIncludedRolesAndActivities } from '@interfaces/repository/IUserRepository';
import {
  ITokens,
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import { userInput } from '@models/User';
import { Request } from 'express';

export default interface IAuthService {
  login(loginCredentials: {
    userName?: string;
    email?: string;
    password: string;
  }): Promise<loginResponse>;
  signup(userData: userInput): Promise<singupResponse>;
  logout(user: UserIncludedRolesAndActivities): Promise<boolean>;
  refreshAccessToken(req: Request): Promise<ITokens>;
}
