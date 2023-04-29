import { TErrorStatusCode } from '@helpers/AppError/errorStatusCodes';
import { ExtractObjValueTypes } from '@helpers/types';
import { Response } from 'express';

export const SuccessResponseCodes = {
  SUCCESS: 200,
  NO_DATA: 201
} as const;

export type successResponseCodeTypes = ExtractObjValueTypes<
  typeof SuccessResponseCodes
>;

type responseCodes = TErrorStatusCode | successResponseCodeTypes;

/**
 * @class BaseResponse
 * @description This class is the base class for all the response classes
 */
export abstract class BaseResponse {
  private ResponseStatus: responseCodes = 200;

  private defaultMessage = 'No Data available';

  constructor(protected res: Response) {}

  protected set setResponseStatus(code: responseCodes) {
    this.ResponseStatus = code;
  }

  protected get getResponseStatus(): responseCodes {
    return this.ResponseStatus;
  }

  protected send(data: object): void {
    let responseData = data;
    // if paramiter (data) is empty we will add a default Message
    if (Object.keys(data).length <= 0)
      responseData = { message: this.defaultMessage };
    this.res.status(this.ResponseStatus).json(responseData);
  }
}
