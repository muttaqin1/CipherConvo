import JwtPayload from '@interfaces/auth/JwtPayload';

export default interface IJsonWebToken {
  generateToken: (payload: JwtPayload) => Promise<string>;
  verifyToken: (token: string) => Promise<JwtPayload>;
  decodeToken: (token: string) => Promise<JwtPayload>;
}
