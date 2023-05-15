import 'reflect-metadata';

import RoleReposiotry from '../../../src/api/repositories/RoleRepository';
import MockModel, {
  MockCreate,
  MockDestroy,
  MockFindByPk,
  MockFindOne
} from './MockModel';

let roleRepository = new RoleReposiotry(new MockModel() as any);
describe('Class: RoleRepository', () => {
  beforeEach(() => {
    MockCreate.mockClear();
    MockFindByPk.mockClear();
    MockDestroy.mockClear();
    MockDestroy.mockClear();
  });
  describe('Method: createRole', () => {
    it('should call create method of model', async () => {
      MockCreate.mockResolvedValueOnce({} as any);
      await roleRepository.createRole({} as any);
      expect(MockCreate).toBeCalledTimes(1);
    });
  });
  describe('Method: findRoleById', () => {
    it('should call findByPk method of model', async () => {
      MockFindByPk.mockResolvedValueOnce({} as any);
      await roleRepository.findRoleById('1');
      expect(MockFindByPk).toBeCalledTimes(1);
    });
  });
  describe('Method: findRoleByUserId', () => {
    it('should call findOne method of model', async () => {
      MockFindOne.mockResolvedValueOnce({} as any);
      await roleRepository.findRoleByUserId('1');
      expect(MockFindOne).toBeCalledTimes(1);
    });
  });
  describe('Method: deleteRoleById', () => {
    it('should call destroy method of model', async () => {
      MockDestroy.mockResolvedValueOnce({} as any);
      await roleRepository.deleteRoleById('1');
      expect(MockDestroy).toBeCalledTimes(1);
    });
  });
});
