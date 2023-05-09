export const MockCreateActivity = jest.fn();
export const MockUpdateActivity = jest.fn();

export default class MockActivityRepository {
  public createActivity(activity: any) {
    return MockCreateActivity(activity);
  }
  public updateActivity(activityId: string, data: any) {
    return MockUpdateActivity(activityId, data);
  }
}
