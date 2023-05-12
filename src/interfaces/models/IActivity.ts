export default interface IActivity {
  id: string;
  userId: string;
  failedLoginAttempts?: number;
  passwordChangedLast?: Date;
  emailVerified?: boolean;
  sendedTwoFactorAuthCodeCount?: number;
  permanentAccessRestricted?: boolean;
  accessRestricted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
