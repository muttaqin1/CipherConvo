import { Request, Response } from 'express';
import compression from 'compression';

export default (req: Request, res: Response): any => {
  if (req.headers['x-no-compression']) return false;
  return compression.filter(req, res);
};
