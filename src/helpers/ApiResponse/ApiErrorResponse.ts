import { IsApiError } from '@helpers/AppError/ApiError';
import ErrorMessage from '@helpers/AppError/errorMessages';
import { errorStatusCodes } from '@helpers/AppError/errorStatusCodes';
import { BaseResponse } from './BaseResponse';

/**
 * @class ApiErrorResponse
 * @description This class is used to send error response
 */

export default class ApiErrorResponse extends BaseResponse {
  public override send(err: any): void {
    if (IsApiError(err)) {
      this.setResponseStatus = err.statusCode;
      super.send({ message: err.message });
    } else {
      this.setResponseStatus = errorStatusCodes.INTERNAL_SERVER_ERROR;
      super.send({ message: ErrorMessage.INTERNAL });
    }
  }
}
