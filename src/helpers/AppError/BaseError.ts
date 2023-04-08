import { TErrorType } from './errorTypes';
import { TErrorStatusCode } from './errorStatusCodes';

export default abstract class BaseError extends Error {
  constructor(
    public type: TErrorType,
    public override message: string,
    public statusCode: TErrorStatusCode,
    public isOperationalError: boolean
  ) {
    super(type);
  }
}
