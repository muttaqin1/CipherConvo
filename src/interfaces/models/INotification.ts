export enum NotificationType {
  ALERT,
  INFO,
  REMINDER,
  MESSAGE_REQUEST,
  CHAT_REQUEST
}
export interface INotification {
  id: string;
  type: NotificationType;
  seen: boolean;
  sender_id: string;
  reciever_id: string;
  title: string;
  body: string;
  img?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
