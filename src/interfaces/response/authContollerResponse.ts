import IRole from '@interfaces/models/IRole';
import IUser from '@interfaces/models/IUser';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface loginResponse {
  user: Omit<Required<IUser>, 'password' | 'roleId' | 'activityId'>;
  tokens: ITokens;
}
export interface singupResponse {
  user: Omit<Required<IUser>, 'password' | 'roleId' | 'activityId'>;
  role: Required<IRole>;
  tokens: ITokens;
}
