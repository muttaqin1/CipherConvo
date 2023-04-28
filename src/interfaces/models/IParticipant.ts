export default interface IParticipant {
  id?: string;
  conversationId: string;
  participantId: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
