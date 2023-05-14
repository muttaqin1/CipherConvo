import 'reflect-metadata';
import ActivityRepository from '../../../src/api/repositories/ActivityRepository';
import IActivity from '../../../src/interfaces/models/IActivity';
import MockModel, { MockCreate, MockUpdate } from './MockModel';

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

let activityRepository: ActivityRepository;
describe('Class: ActivityRepository', () => {
  beforeEach(() => {
    activityRepository = new ActivityRepository(new MockModel() as any);
  });
  describe('Method: createActivity', () => {
    beforeEach(() => {
      MockCreate.mockClear();
    });
    it('should call create method of model', async () => {
      MockCreate.mockResolvedValue(activityData);
      await activityRepository.createActivity(activityData);
      expect(MockCreate).toHaveBeenCalled();
    });
  });
  describe('Method: updateActivity', () => {
    beforeEach(() => {
      MockUpdate.mockClear();
    });
    it('should call update method of model', async () => {
      MockUpdate.mockResolvedValue(activityData);
      await activityRepository.updateActivity(activityData.userId, {
        failedLoginAttempts: 1
      });
      expect(MockUpdate).toHaveBeenCalledTimes(1);
      expect(MockUpdate).toHaveBeenCalledWith(
        { failedLoginAttempts: 1 },
        { where: { userId: activityData.userId }, limit: 1 }
      );
    });
  });
});
