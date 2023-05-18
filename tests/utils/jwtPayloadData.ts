import { JWT } from '../../src/config';
export default {
  userId: '123',
  email: 'test@gmail.com',
  userName: 'test1',
  roleId: '123',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  iss: JWT.iss,
  aud: JWT.aud,
  sub: JWT.sub
};
