import { Encoding } from 'crypto';
import { JwtPayload } from 'jsonwebtoken';

export default interface IJsonWebToken {
  generateToken: (payload: JwtPayload) => Promise<string>;
  verifyToken: (token: string) => Promise<JwtPayload>;
  decodeToken: (token: string) => Promise<JwtPayload>;
}
