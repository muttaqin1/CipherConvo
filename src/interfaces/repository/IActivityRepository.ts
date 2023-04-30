import { activityInput, activityOutput } from '@models/Activity';

export default interface IActivityRepository {
  createActivity(data: activityInput): Promise<activityOutput>;
}
