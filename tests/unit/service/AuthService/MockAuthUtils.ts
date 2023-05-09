export const MockGeneratePassword = jest.fn();
export const MockValidatePassword = jest.fn();
export const MockGenerateTokens = jest.fn();
export const MockVerifyAccessToken = jest.fn();
export const MockDecodeAccessToken = jest.fn();
export const MockVerifyRefreshToken = jest.fn();

export default class MockAuthUtils {
  public generatePassword(password: string, salt?: string) {
    return MockGeneratePassword(password, salt);
  }

  public validatePassword(
    enteredPassword: string,
    databaseSavedPassword: string
  ) {
    return MockValidatePassword(enteredPassword, databaseSavedPassword);
  }
  public generateTokens(
    user: any,
    role: any,
    accessTokenKey: string,
    refreshTokenKey: string
  ) {
    return MockGenerateTokens(user, role, accessTokenKey, refreshTokenKey);
  }
  public verifyAccessToken(req: any) {
    return MockVerifyAccessToken(req);
  }
  public decodeAccessToken(req: any) {
    return MockDecodeAccessToken(req);
  }
  public verifyRefreshToken(refreshToken: string) {
    return MockVerifyRefreshToken(refreshToken);
  }
}
