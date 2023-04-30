import IActivityRepository from '@interfaces/repository/IActivityRepository';
import TYPES from '@ioc/TYPES';
import Activity, { activityInput, activityOutput } from '@models/Activity';
import { inject, injectable } from 'inversify';

@injectable()
export default class ActivityRepository implements IActivityRepository {
  constructor(
    @inject(TYPES.ActivityModel) private readonly activityModel: typeof Activity
  ) {}

  public async createActivity(data: activityInput): Promise<activityOutput> {
    return this.activityModel.create(data);
  }
}
