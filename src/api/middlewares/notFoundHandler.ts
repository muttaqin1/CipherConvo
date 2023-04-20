import { NotFoundError } from '@helpers/AppError/ApiError';
import { controller, all } from 'inversify-express-utils';

@controller('*')
export default class {
  @all('*')
  public notFoundHandler(): void {
    throw new NotFoundError('404 Not Found');
  }
}
