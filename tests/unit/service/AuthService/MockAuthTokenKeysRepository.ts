export const MockCreateKeys = jest.fn();
export const MockDeleteKeys = jest.fn();
export const MockFindKeys = jest.fn();

export default class MockAuthTokenKeysRepository {
  public createKeys(data: any) {
    return MockCreateKeys(data);
  }
  public deleteKeys(userId: string) {
    return MockDeleteKeys(userId);
  }
  public findKeys(data: any) {
    return MockFindKeys(data);
  }
}
