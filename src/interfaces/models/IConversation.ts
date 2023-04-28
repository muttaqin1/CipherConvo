export default interface IConversation {
  id?: string;
  group: boolean;
  creatorId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
