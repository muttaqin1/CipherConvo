import User from '@models/User';
import Message from '@models/Message';
import Conversation from '@models/Conversation';
import Role from '@models/Role';
import Activity from '@models/Activity';
import TwoFactorAuthToken from '@models/TwoFactorAuthToken';

export default async (): Promise<void> => {
  await Promise.all([
    Message.sync({ alter: true, logging: false }),
    Conversation.sync({ alter: true, logging: false }),
    Role.sync({ alter: true, logging: false }),
    User.sync({ alter: true, logging: false }),
    Activity.sync({ alter: true, logging: false }),
    TwoFactorAuthToken.sync({ alter: true, logging: false })
  ]);
};
