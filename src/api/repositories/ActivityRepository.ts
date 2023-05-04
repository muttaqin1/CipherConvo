import IActivityRepository from '@interfaces/repository/IActivityRepository';
import TYPES from '@ioc/TYPES';
import Activity, { activityInput, activityOutput } from '@models/Activity';
import { inject, injectable } from 'inversify';

@injectable()
export default class ActivityRepository implements IActivityRepository {
  constructor(
    @inject(TYPES.ActivityModel) private readonly activityModel: typeof Activity
  ) {}

  public createActivity(data: activityInput): Promise<activityOutput> {
    return this.activityModel.create(data);
  }

  public async updateActivity(
    userId: string,
    data: Partial<activityInput>
  ): Promise<[affectedCount: number]> {
    return this.activityModel.update(data, {
      where: { userId },
      limit: 1
    });
  }
}
