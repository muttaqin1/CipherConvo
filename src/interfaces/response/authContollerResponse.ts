import IRole from '@interfaces/models/IRole';
import IUser from '@interfaces/models/IUser';
import IToken from '@interfaces/auth/IToken';

export interface loginResponse {
  user: Omit<Required<IUser>, 'password'>;
  tokens: IToken;
}
export interface singupResponse {
  user: Omit<Required<IUser>, 'password'>;
  role: Required<IRole>;
  tokens: IToken;
}
