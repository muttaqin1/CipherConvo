import { ExtractObjValueTypes } from '@helpers/types';

export const ErrorTypes = {
  BAD_TOKEN: 'BadTokenError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  UNAUTHORIZED: 'AuthFailureError',
  ACCESS_TOKEN: 'AccessTokenError',
  INTERNAL: 'InternalServerError',
  NOT_FOUND: 'NotFoundError',
  BAD_REQUEST: 'BadRequestError',
  FORBIDDEN: 'ForbiddenError',
  NO_DATA: 'NoDataError',
  CONFLICT: 'ConflictError'
} as const;

export type TErrorType = ExtractObjValueTypes<typeof ErrorTypes>;
