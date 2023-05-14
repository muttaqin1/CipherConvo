import 'reflect-metadata';
import TwoFactorAuthTokenRepository from '../../../src/api/repositories/TwoFactorAuthTokenRepository';
import MockModel, {
  MockCreate,
  MockDestroy,
  MockFindOne,
  MockUpdate
} from './MockModel';

let twoFactorAuthTokenRepository: TwoFactorAuthTokenRepository;

describe('TwoFactorAuthTokenRepository', () => {
  beforeEach(() => {
    twoFactorAuthTokenRepository = new TwoFactorAuthTokenRepository(
      new MockModel() as any
    );
  });

  describe('Method: findTokenByUserId', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call findOne method of the model.', async () => {
      MockFindOne.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.findTokenByUserId('123');
      expect(MockFindOne).toHaveBeenCalledWith({ where: { userId: '123' } });
    });
  });
  describe('Method: createToken', () => {
    beforeEach(() => {
      MockCreate.mockClear();
    });
    it('should call create method of the model.', async () => {
      let expiry = new Date();
      MockCreate.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.createToken({
        userId: '123',
        token: '123',
        verified: false,
        tokenExpiry: expiry,
        tokenType: '123'
      });
      expect(MockCreate).toHaveBeenCalledWith({
        userId: '123',
        token: '123',
        verified: false,
        tokenExpiry: expiry,
        tokenType: '123'
      });
      expect(MockCreate).toHaveBeenCalledTimes(1);
    });
  });
  describe('Method: deleteToken', () => {
    beforeEach(() => {
      MockDestroy.mockClear();
    });
    it('should call destroy method of the model.', async () => {
      MockDestroy.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.deleteToken('123');
      expect(MockDestroy).toHaveBeenCalledTimes(1);
      expect(MockDestroy).toHaveBeenCalledWith({ where: { userId: '123' } });
    });
  });
  describe('Method: findTokenByToken', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call findOne method of the model.', async () => {
      MockFindOne.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.findTokenByToken('123');
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({ where: { token: '123' } });
    });
  });
  describe('Method: verifyToken', () => {
    beforeEach(() => {
      MockUpdate.mockClear();
    });
    it('should call update method of the model.', async () => {
      MockUpdate.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.verifyToken('123');
      expect(MockUpdate).toHaveBeenCalledTimes(1);
      expect(MockUpdate).toHaveBeenCalledWith(
        { verified: true },
        { where: { token: '123' } }
      );
    });
  });
  describe('Method: findTokenById', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call findOne method of the model.', async () => {
      MockFindOne.mockImplementationOnce(() => Promise.resolve());
      await twoFactorAuthTokenRepository.findTokenById('123');
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });
  });
});
