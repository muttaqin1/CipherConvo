import JwtPayload from '@interfaces/auth/JwtPayload';

export default interface IJsonWebToken {
  generateToken: (payload: JwtPayload, secrtKey: string) => Promise<string>;
  verifyToken: (token: string, secrtKey: string) => Promise<JwtPayload>;
  decodeToken: (token: string, secrtKey: string) => Promise<JwtPayload>;
}
