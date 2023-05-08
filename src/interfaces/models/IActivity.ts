export default interface IActivity {
  id: string;
  userId: string;
  failedLoginAttempts?: number;
  emailVerified?: boolean;
  sendedTwoFactorAuthCodeCount?: number;
  permanentAccessRestricted?: boolean;
  accessRestricted?: boolean;
  accessRestrictedUntil?: Date;
  twoFactorAuthRestricted?: boolean;
  twoFactorAuthRestrictedUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
