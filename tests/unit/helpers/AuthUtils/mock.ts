export const mockGenToken = jest.fn().mockReturnValue('token');
export const mockVerifyToken = jest.fn().mockReturnValue({});
export const mockDecodeToken = jest.fn().mockReturnValue({});
export const mockSanitizeAuthHeader = jest.fn().mockReturnValue('token');

export class MockJwt {
  public generateToken() {
    return mockGenToken();
  }
  public verifyToken() {
    return mockVerifyToken();
  }
  public decodeToken() {
    return mockDecodeToken();
  }
}
