import { errorStatusCodes, TErrorStatusCode } from './errorStatusCodes';
import ErrorMessages from './errorMessages';
import { ErrorTypes, TErrorType } from './errorTypes';
import BaseError from './BaseError';

export abstract class ApiError extends BaseError {
  constructor(type: TErrorType, message: string, statusCode: TErrorStatusCode) {
    super(type, message, statusCode, true);
  }
}

export const IsApiError = (err: unknown): err is ApiError =>
  err instanceof ApiError ? err.isOperationalError : false;

export class AuthFailureError extends ApiError {
  constructor(message: string = ErrorMessages.UNAUTHORIZED) {
    super(ErrorTypes.UNAUTHORIZED, message, errorStatusCodes.UNAUTHORIZED);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = ErrorMessages.INTERNAL) {
    super(ErrorTypes.INTERNAL, message, errorStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = ErrorMessages.BAD_REQUEST) {
    super(ErrorTypes.BAD_REQUEST, message, errorStatusCodes.BAD_REQUEST);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = ErrorMessages.NOT_FOUND) {
    super(ErrorTypes.NOT_FOUND, message, errorStatusCodes.NOT_FOUND);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = ErrorMessages.FORBIDDEN) {
    super(ErrorTypes.FORBIDDEN, message, errorStatusCodes.FORBIDDEN);
  }
}

export class BadTokenError extends ApiError {
  constructor(message: string = ErrorMessages.BAD_TOKEN) {
    super(ErrorTypes.BAD_TOKEN, message, errorStatusCodes.UNAUTHORIZED);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message: string = ErrorMessages.TOKEN_EXPIRED) {
    super(ErrorTypes.TOKEN_EXPIRED, message, errorStatusCodes.UNAUTHORIZED);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message: string = ErrorMessages.ACCESS_TOKEN) {
    super(ErrorTypes.ACCESS_TOKEN, message, errorStatusCodes.UNAUTHORIZED);
  }
}
export class NoDataError extends ApiError {
  constructor(message: string = ErrorMessages.NO_DATA) {
    super(ErrorTypes.NO_DATA, message, errorStatusCodes.NOT_FOUND);
  }
}
