import { UserIncludedRolesAndActivities } from '@interfaces/repository/IUserRepository';
import { Request as expressRequest } from 'express';

export default interface Request extends expressRequest {
  user: UserIncludedRolesAndActivities;
}
