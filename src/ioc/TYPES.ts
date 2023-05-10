const TYPES = {
  UserModel: Symbol('UserModel'),
  RoleModel: Symbol('RoleModel'),
  AuthTokenKeysModel: Symbol('AuthTokenKeys'),
  ActivityModel: Symbol('ActivityModel'),
  UserRepository: Symbol('UserRepository'),
  AuthTokenKeysRepository: Symbol('AuthTokenKeysRepository'),
  ActivityRepository: Symbol('ActivityRepository'),
  RoleRepository: Symbol('RoleRepository'),
  AuthService: Symbol('AuthService'),
  JWT: Symbol('JWT'),
  AuthUtils: Symbol('AuthUtils'),
  EmailService: Symbol('EmailService'),
  TwoFactorAuthToken: Symbol('TwoFactorAuthToken'),
  TwoFactorAuthTokenRepository: Symbol('TwoFactorAuthTokenRepository')
};
export default TYPES;
