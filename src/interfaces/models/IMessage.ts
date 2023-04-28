export default interface IMessage {
  id: string;
  conversationId: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
