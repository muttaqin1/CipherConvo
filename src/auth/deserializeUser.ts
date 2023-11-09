import { AuthFailureError } from '@helpers/AppError/ApiError';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import AuthTokenKeysRepository from '@repositories/AuthTokenKeysRepository';
import TYPES from '@ioc/TYPES';
import { Response, NextFunction } from 'express';
import container from '@ioc/container';
import IUserRepository from '@interfaces/repository/IUserRepository';
import Request from '@interfaces/request';

export const deserializeUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUtils = container.get<IAuthUtils>(TYPES.AuthUtils);
    const authTokenKeysRepository = container.get<AuthTokenKeysRepository>(
      TYPES.AuthTokenKeysRepository
    );
    const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
    // Verify access token
    const payload = await authUtils.verifyAccessToken(req, undefined, undefined);
    // Find user
    const user = await userRepository.findUserById(payload.userId, {
      role: true,
      activity: true
    });
    if (!user) throw new AuthFailureError('User not found');
    if (!payload.accessTokenKey) throw new AuthFailureError();
    // Find access token key
    const keys = await authTokenKeysRepository.findKeys({
      userId: user.id,
      accessTokenKey: payload.accessTokenKey
    });
    if (!keys) throw new AuthFailureError();
    // set user to req
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
