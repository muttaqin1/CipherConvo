import IActivity from '../../src/interfaces/models/IActivity';

export default {
  id: '333',
  userId: '111',
  failedLoginAttempts: 0,
  emailVerified: true,
  accessRestricted: false,
  permanentAccessRestricted: false,
  sendedTwoFactorAuthCodeCount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
} as Required<IActivity>;
