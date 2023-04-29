import IUser from '@interfaces/models/IUser';

export interface loginResponse {
  user: Omit<IUser, 'password' | 'roleId' | 'activityId'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
