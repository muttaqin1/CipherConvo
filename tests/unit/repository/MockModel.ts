export const MockCreate = jest.fn();
export const MockFindOne = jest.fn();
export const MockUpdate = jest.fn();
export const MockDestroy = jest.fn();
export const MockFindByPk = jest.fn();

export default class MockModel {
  public create(data: any) {
    return MockCreate(data);
  }
  public findOne(data: any) {
    return MockFindOne(data);
  }
  public update(data: any) {
    return MockUpdate(data);
  }
  public destroy(data: any) {
    return MockDestroy(data);
  }
  public findByPk(data: any) {
    return MockFindByPk(data);
  }
}
