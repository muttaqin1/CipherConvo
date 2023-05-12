import ITwoFactorAuthTokenRepository from '../../../../src/interfaces/repository/ITwoFactorAuthTokenRepository';
export const MockFindTokenByUserId = jest.fn();
export const MockCreateToken = jest.fn();
export const MockDeleteToken = jest.fn();
export const MockFindTokenByToken = jest.fn();
export const MockVerifyToken = jest.fn();
export const MockFindTokenById = jest.fn();

export default class MockTwoFactorAuthTokenRepository
  implements ITwoFactorAuthTokenRepository
{
  findTokenByUserId(userId: string): Promise<any> {
    return MockFindTokenByUserId(userId);
  }
  createToken(tokenData: any): Promise<any> {
    return MockCreateToken(tokenData);
  }
  deleteToken(userId: string): Promise<number> {
    return MockDeleteToken(userId);
  }
  findTokenByToken(token: string): Promise<any> {
    return MockFindTokenByToken(token);
  }
  verifyToken(token: string): Promise<void> {
    return MockVerifyToken(token);
  }
  findTokenById(id: string): Promise<any> {
    return MockFindTokenById(id);
  }
}
