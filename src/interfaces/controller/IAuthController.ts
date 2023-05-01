import { Response } from 'express';
import Request from '@interfaces/request';

export default interface IAuthController {
  login(req: Request, res: Response): Promise<void>;
  signup(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  tokenRefresh(req: Request, res: Response): Promise<void>;
}
