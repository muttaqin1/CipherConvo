import IApiSuccessResponse from '@interfaces/helpers/ApiResponse/IApiSuccessResponse';
import { BaseResponse, successResponseCodeTypes } from './BaseResponse';
/**
 * @class ApiSuccessResponse
 * @description This class is used to send success response
 */

export default class ApiSuccessResponse
  extends BaseResponse
  implements IApiSuccessResponse
{
  public setCookie(name: string, expiry: number, payload: string): this {
    this.res.cookie(name, payload, {
      httpOnly: true,
      signed: true,
      secure: true,
      maxAge: expiry
    });
    return this;
  }

  public removeCookie(name: string): this {
    this.res.clearCookie(name);
    return this;
  }

  public override send<T extends Record<string, any>>(data: T): void {
    super.send(data);
  }

  public status(code: successResponseCodeTypes): this {
    this.setResponseStatus = code;
    return this;
  }
}
