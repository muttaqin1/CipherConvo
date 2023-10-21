import { ForbiddenError } from '@helpers/AppError/ApiError';
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  handler: (_req, _res, next) => {
    next(
      new ForbiddenError(
        'Too many accounts created from this IP, please try again after an hour'
      )
    );
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

export const signupLimiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour window
  max: 5, // start blocking after 5 requests
  handler: (_req, _res, next) => {
    next(
      new ForbiddenError(
        'Too many accounts created from this IP, please try again after an hour'
      )
    );
  }
});
