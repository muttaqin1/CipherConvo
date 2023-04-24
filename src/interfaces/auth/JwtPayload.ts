import { JwtPayload as TokenPayload } from 'jsonwebtoken';

export default interface JwtPayload extends TokenPayload {
  userId: string;
  email: string;
  roleId: string;
  userName: string;
  accessTokenKey?: string;
  refreshTokenKey?: string;
}
