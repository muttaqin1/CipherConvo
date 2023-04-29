import { successResponseCodeTypes } from '@helpers/ApiResponse/BaseResponse';

export default interface IApiSuccessResponse {
  setCookie(name: string, expiry: number, payload: string): this;
  removeCookie(name: string): this;
  send<T extends Record<string, any>>(data: T): void;
  status(code: successResponseCodeTypes): this;
}
