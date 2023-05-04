import Activity, { activityInput, activityOutput } from '@models/Activity';

export default interface IActivityRepository {
  createActivity(data: activityInput): Promise<activityOutput>;
  updateActivity(
    userId: string,
    data: Partial<activityInput>
  ): Promise<[affectedCount: number]>;
}
