import {
  ConflictError,
  InternalServerError,
  IsApiError
} from '@helpers/AppError/ApiError';
import IUserRepository from '@interfaces/repository/IUserRepository';
import IUserService from '@interfaces/service/IUserService';
import TYPES from '@ioc/TYPES';
import { inject, injectable } from 'inversify';

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  private async usernameTaken(username: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(username);
    return user ? true : false;
  }

  public async updateUsername(
    userId: string,
    newUsername: string
  ): Promise<void> {
    const isUsernameTaken = await this.usernameTaken(newUsername);
    try {
      if (isUsernameTaken) throw new ConflictError('Username is taken');
      await this.userRepository.updateUsername(userId, newUsername);
    } catch (err) {
      throw IsApiError(err) ? err : new InternalServerError();
    }
  }
}
