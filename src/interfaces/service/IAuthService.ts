import { UserIncludedRolesAndActivities } from '@interfaces/repository/IUserRepository';
import { Request } from 'express';
import IToken from '@interfaces/auth/IToken';
import IUser from '@interfaces/models/IUser';
import IRole from '@interfaces/models/IRole';
import { ILoginDto, ISignupDto } from '@interfaces/dtos/AuthControllerDtos';

export interface ILoginOutput {
  user: Omit<Required<IUser>, 'password'>;
  roles: Required<IRole>;
  tokens: IToken;
}
export interface ISingupOutput {
  user: Omit<Required<IUser>, 'password'>;
  role: Required<IRole>;
  tokens: IToken;
}
export interface IVerifyVerificationTokenOutput {
  emailVerified?: boolean;
  accountVerified?: boolean;
  tokenId?: string;
}

export default interface IAuthService {
  login(loginCredentials: ILoginDto): Promise<ILoginOutput>;
  signup(userData: ISignupDto): Promise<ISingupOutput>;
  logout(user: UserIncludedRolesAndActivities): Promise<void>;
  refreshTokens(req: Request): Promise<IToken>;
  verifyVerificationToken(
    token: string
  ): Promise<IVerifyVerificationTokenOutput>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  changePassword(
    user: UserIncludedRolesAndActivities,
    oldPassword: string,
    newPassword: string
  ): Promise<void>;
}
