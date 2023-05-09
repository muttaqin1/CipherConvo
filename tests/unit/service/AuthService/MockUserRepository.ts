import IUserRepository from '../../../../src/interfaces/repository/IUserRepository';
export const MockCreateUser = jest.fn();
export const MockFindUserById = jest.fn();
export const MockFindUserByEmail = jest.fn();
export const MockFindByUsername = jest.fn();
export const MockUpdateUser = jest.fn();
export const MockDeleteUser = jest.fn();

export default class MockUserRepository implements IUserRepository {
  public createUser(user: any) {
    return MockCreateUser(user);
  }
  public findUserById(id: string, options?: any) {
    return MockFindUserById(id, options);
  }
  public findUserByEmail(email: string, options?: any) {
    return MockFindUserByEmail(email, options);
  }
  public findByUsername(username: string, options?: any) {
    return MockFindByUsername(username, options);
  }
  public updateUser(userId: string, data: any) {
    return MockUpdateUser(userId, data);
  }
  public deleteUser(id: string) {
    return MockDeleteUser(id);
  }
}
