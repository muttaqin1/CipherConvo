import 'reflect-metadata';
import MockModel, {
  MockCreate,
  MockUpdate,
  MockDestroy,
  MockFindOne
} from './MockModel';
import UserRepository from '../../../src/api/repositories/UserRepository';
import IUser from '../../../src/interfaces/models/IUser';
import IRole from '../../../src/interfaces/models/IRole';
import IActivity from '../../../src/interfaces/models/IActivity';

export const userData: Required<IUser> = {
  id: '111',
  userName: 'muttaqin1',
  firstName: 'muttaqin',
  lastName: 'muhammad',
  email: 'email@gmail.com',
  password: 'muttaqin:muttaqin',
  gender: 'male',
  avatar: 'avatar',
  createdAt: new Date(),
  updatedAt: new Date()
};
export const roleData: Required<IRole> = {
  id: '222',
  userId: '111',
  admin: false,
  user: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const activityData: Required<IActivity> = {
  id: '333',
  userId: '111',
  failedLoginAttempts: 0,
  emailVerified: true,
  accessRestricted: false,
  permanentAccessRestricted: false,
  sendedTwoFactorAuthCodeCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  passwordChangedLast: new Date()
};

let userRepo: UserRepository;
describe('Class: UserRepository', () => {
  beforeEach(() => {
    userRepo = new UserRepository(
      new MockModel() as any,
      new MockModel() as any,
      new MockModel() as any
    );
  });
  describe('Method: createUser', () => {
    beforeEach(() => {
      MockCreate.mockClear();
    });
    it('should call create method of the model.', async () => {
      MockCreate.mockResolvedValue(userData);
      const user = await userRepo.createUser(userData);
      expect(user).toEqual(userData);
      expect(MockCreate).toHaveBeenCalledTimes(1);
      expect(MockCreate).toHaveBeenCalledWith(userData);
    });
  });
  describe('Method: findUserById', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call find method of the model.', async () => {
      MockFindOne.mockResolvedValue(userData);
      const user = await userRepo.findUserById(userData.id);
      expect(user).toEqual(userData);
    });
    it('should call find method including role of the model', async () => {
      MockFindOne.mockResolvedValue({ ...userData, roles: roleData });
      const user = await userRepo.findUserById(userData.id, { role: true });
      expect(user).toEqual({ ...userData, roles: roleData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { id: '111' },
        include: [{ model: expect.anything(), as: 'roles' }]
      });
    });
    it('should call find method including activity of the model.', async () => {
      MockFindOne.mockResolvedValue({ ...userData, activities: activityData });
      const user = await userRepo.findUserById(userData.id, { activity: true });
      expect(user).toEqual({ ...userData, activities: activityData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { id: '111' },
        include: [{ model: expect.anything(), as: 'activities' }]
      });
    });
    it('should call find method including role and activity of the model.', async () => {
      MockFindOne.mockResolvedValue({
        ...userData,
        activities: activityData,
        roles: roleData
      });
      const user = await userRepo.findUserById(userData.id, {
        activity: true,
        role: true
      });
      expect(user).toEqual({
        ...userData,
        activities: activityData,
        roles: roleData
      });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { id: '111' },
        include: [
          { model: expect.anything(), as: 'roles' },
          { model: expect.anything(), as: 'activities' }
        ]
      });
    });
  });
  describe('Method: findUserByEmail', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call the find method of the  model.', async () => {
      MockFindOne.mockResolvedValue(userData);
      const user = await userRepo.findUserByEmail(userData.email);
      expect(user).toEqual(userData);
    });
    it('should call the find method including activities of the model.', async () => {
      MockFindOne.mockResolvedValue({ ...userData, activities: activityData });
      const user = await userRepo.findUserByEmail(userData.email, {
        activity: true
      });
      expect(user).toEqual({ ...userData, activities: activityData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { email: userData.email },
        include: [{ model: expect.anything(), as: 'activities' }]
      });
    });
    it('should call the find method including roles of the model.', async () => {
      MockFindOne.mockResolvedValue({ ...userData, roles: roleData });
      const user = await userRepo.findUserByEmail(userData.email, {
        role: true
      });
      expect(user).toEqual({ ...userData, roles: roleData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { email: userData.email },
        include: [{ model: expect.anything(), as: 'roles' }]
      });
    });
    it('should call the find method including activities and role of the model.', async () => {
      MockFindOne.mockResolvedValue({
        ...userData,
        roles: roleData,
        activities: activityData
      });
      const user = await userRepo.findUserByEmail(userData.email, {
        role: true,
        activity: true
      });
      expect(user).toEqual({
        ...userData,
        roles: roleData,
        activities: activityData
      });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { email: userData.email },
        include: [
          { model: expect.anything(), as: 'roles' },
          { model: expect.anything(), as: 'activities' }
        ]
      });
    });
  });
  describe('Method: findByUsername', () => {
    beforeEach(() => {
      MockFindOne.mockClear();
    });
    it('should call the find method of the model.', async () => {
      MockFindOne.mockResolvedValue(userData);
      const user = await userRepo.findByUsername(userData.userName);
      expect(user).toEqual(userData);
    });
    it('should call the find method including roles of the model.', async () => {
      MockFindOne.mockResolvedValue({ ...userData, roles: roleData });
      const user = await userRepo.findByUsername(userData.userName, {
        role: true
      });
      expect(user).toEqual({ ...userData, roles: roleData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { userName: userData.userName },
        include: [{ model: expect.anything(), as: 'roles' }]
      });
    });
    it('should call the find method including activities for the model.', async () => {
      MockFindOne.mockResolvedValue({ ...userData, activities: activityData });
      const user = await userRepo.findByUsername(userData.userName, {
        activity: true
      });
      expect(user).toEqual({ ...userData, activities: activityData });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { userName: userData.userName },
        include: [{ model: expect.anything(), as: 'activities' }]
      });
    });
    it('should call the find method including roles and activities of the model.', async () => {
      MockFindOne.mockResolvedValue({
        ...userData,
        activities: activityData,
        roles: roleData
      });
      const user = await userRepo.findByUsername(userData.userName, {
        activity: true,
        role: true
      });
      expect(user).toEqual({
        ...userData,
        activities: activityData,
        roles: roleData
      });
      expect(MockFindOne).toHaveBeenCalledTimes(1);
      expect(MockFindOne).toHaveBeenCalledWith({
        where: { userName: userData.userName },
        include: [
          { model: expect.anything(), as: 'roles' },
          { model: expect.anything(), as: 'activities' }
        ]
      });
    });
  });
  describe('Method: updateUser', () => {
    beforeEach(() => {
      MockUpdate.mockClear();
    });
    it('should call the update method of the model.', async () => {
      MockUpdate.mockResolvedValue(userData);
      const user = await userRepo.updateUser(userData.id, userData);
      expect(user).toEqual(userData);
    });
  });
  describe('Method: deleteUser', () => {
    beforeEach(() => {
      MockDestroy.mockClear();
    });
    it('should call the delete method of the model.', async () => {
      MockDestroy.mockResolvedValue(userData);
      const user = await userRepo.deleteUser(userData.id);
      expect(user).toEqual(userData);
    });
  });
});
