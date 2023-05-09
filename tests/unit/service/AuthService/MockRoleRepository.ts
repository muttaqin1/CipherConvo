export const MockCreateRole = jest.fn();
export const MockFindRoleById = jest.fn();
export const MockFindRoleByUserId = jest.fn();
export const MockDeleteRoleById = jest.fn();

export default class MockRoleRepository {
  public createRole(role: any) {
    return MockCreateRole(role);
  }
  public findRoleById(id: string, options?: any) {
    return MockFindRoleById(id, options);
  }
  public findRoleByUserId(userId: string, options?: any) {
    return MockFindRoleByUserId(userId, options);
  }
  public deleteRoleById(id: string) {
    return MockDeleteRoleById(id);
  }
}
