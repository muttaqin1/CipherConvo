import 'reflect-metadata';
import AuthTokenKeysRepository from '../../../src/api/repositories/AuthTokenKeysRepository';
import MockModel, { MockCreate, MockDestroy, MockFindOne } from './MockModel';

const mockAuthTokenKeysRepository = new AuthTokenKeysRepository(
  new MockModel() as any
);
describe('Class: AuthTokenKeysRepository', () => {
  beforeEach(() => {
    MockFindOne.mockClear();
    MockDestroy.mockClear();
    MockCreate.mockClear();
  });

  it('should call destroy method with correct params', async () => {
    MockDestroy.mockImplementation(() => Promise.resolve());
    await mockAuthTokenKeysRepository.deleteKeys('userId');
    expect(MockDestroy).toHaveBeenCalledTimes(1);
    expect(MockDestroy).toHaveBeenCalledWith({ where: { userId: 'userId' } });
  });
  it('should call create method with correct params', async () => {
    let data = {
      userId: '111',
      accessTokenKey: 'key',
      refreshTokenKey: 'key'
    };
    MockCreate.mockImplementation(() => Promise.resolve());
    await mockAuthTokenKeysRepository.createKeys(data);
    expect(MockCreate).toHaveBeenCalledTimes(1);
    expect(MockCreate).toHaveBeenCalledWith(data);
  });
  it('should call findOne method with correct params', async () => {
    MockFindOne.mockImplementation(() => Promise.resolve());
    await mockAuthTokenKeysRepository.findKeys({ userId: 'userId' });
    expect(MockFindOne).toHaveBeenCalledTimes(1);
    expect(MockFindOne).toHaveBeenCalledWith({ where: { userId: 'userId' } });
  });
});
