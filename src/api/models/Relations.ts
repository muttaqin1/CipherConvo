import Activity from './Activity';
import Conversation from './Conversation';
import Message from './Message';
import Notification from './Notification';
import NotificationTab from './NotificationTab';
import Participant from './Participant';
import Role from './Role';
import User from './User';

Conversation.hasMany(Message, {
  foreignKey: 'conversationId',
  as: 'messages'
});
Conversation.hasMany(Participant, {
  foreignKey: 'conversationId',
  as: 'participants'
});

User.hasOne(Role, {
  foreignKey: 'userId',
  as: 'roles'
});

User.hasOne(Activity, {
  foreignKey: 'userId',
  as: 'activities'
});

Notification.belongsTo(User, {
  foreignKey: 'reciever_id',
  as: 'reciever'
});
Notification.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});

NotificationTab.hasMany(Notification, {
  foreignKey: 'notification_tab_id',
  as: 'notificationTab'
});
