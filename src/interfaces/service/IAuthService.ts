import { UserIncludedRolesAndActivities } from '@interfaces/repository/IUserRepository';
import {
  loginResponse,
  singupResponse
} from '@interfaces/response/authContollerResponse';
import { userInput } from '@models/User';
import { Request } from 'express';
import IToken from '@interfaces/auth/IToken';

export default interface IAuthService {
  login(loginCredentials: {
    userName?: string;
    email?: string;
    password: string;
  }): Promise<loginResponse>;
  signup(userData: userInput): Promise<singupResponse>;
  logout(user: UserIncludedRolesAndActivities): Promise<void>;
  refreshAccessToken(req: Request): Promise<IToken>;
  verifyVerificationToken(token: string): Promise<{
    emailVerified?: boolean;
    accountVerified?: boolean;
    tokenId?: string;
  }>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}
