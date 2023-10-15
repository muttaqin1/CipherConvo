import { AuthFailureError, ForbiddenError } from '@helpers/AppError/ApiError';
import IAuthUtils from '@interfaces/helpers/IAuthUtils';
import AuthTokenKeysRepository from '@repositories/AuthTokenKeysRepository';
import TYPES from '@ioc/TYPES';
import container from '@ioc/container';
import IUserRepository from '@interfaces/repository/IUserRepository';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export type UserSocket = Socket & { userId: string };

export type SocketMap = Map<string, UserSocket>;

export const authorizeSocket = (socketMap: SocketMap) => (async (
  socket: UserSocket,
  next: (err?: ExtendedError) => void
): Promise<void> => {
  try {
    const authUtils = container.get<IAuthUtils>(TYPES.AuthUtils);
    const authTokenKeysRepository = container.get<AuthTokenKeysRepository>(
      TYPES.AuthTokenKeysRepository
    );
    const userRepository = container.get<IUserRepository>(
      TYPES.UserRepository
    );
    if (!socket.handshake.auth.token) throw new ForbiddenError();
    // Verify access token
    const payload = await authUtils.verifySocketAccessToken(
      socket.handshake.auth.token
    );
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
    // eslint-disable-next-line no-param-reassign
    socket.userId = user.id;
    if (socketMap.has(user.id)) socketMap.delete(user.id);
    socketMap.set(user.id, socket);
    next();
  } catch (e) {
    next(e as ExtendedError);
  }
}) as unknown as (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => void;
