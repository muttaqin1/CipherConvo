import { environment, IsProduction } from '@config/index';
import { IsApiError } from '@helpers/AppError/ApiError';
import { errorStatusCodes } from '@helpers/AppError/errorStatusCodes';
import { NextFunction, Request, Response } from 'express';
import Logger from '@helpers/Logger';
import ApiErrorResponse from '@helpers/ApiResponse/ApiErrorResponse';
import ApiSuccessResponse from '@helpers/ApiResponse/ApiSuccessResponse';

export const globalErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  if (res.headersSent) return next(err);
  if (IsApiError(err)) return new ApiErrorResponse(res).send(err);
  if (!IsProduction()) {
    Logger.error(err.stack);
    return new ApiSuccessResponse(res)
      .status(err.statusCode || errorStatusCodes.INTERNAL_SERVER_ERROR)
      .send({ env: environment, message: err.message });
  }
  Logger.error(err.stack);
  return new ApiErrorResponse(res).send(err);
};