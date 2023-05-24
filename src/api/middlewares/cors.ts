import { corsOrigins, IsProduction } from '@config/index';
import { ForbiddenError } from '@helpers/AppError/ApiError';

export const customOrigin = (origin: any, cb: any) => {
  if (!IsProduction()) return cb(null, true);
  return origin && corsOrigins.indexOf(origin) !== -1
    ? cb(null, true)
    : cb(new ForbiddenError('Not allowed by CORS'));
};
