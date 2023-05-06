import IConversation from '@interfaces/models/IConversation';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';
import Message from '@models/Message';
import Participant from '@models/Participant';

export type conversationInput = Optional<
  IConversation,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type conversationOutput = Required<IConversation>;
export type conversationUpdate = Optional<
  IConversation,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export default class Conversation
  extends Model<IConversation, conversationInput>
  implements IConversation
{
  public id!: string;

  public participants!: string;

  public readonly group!: boolean;

  public readonly creatorId!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;
}
Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: uuid()
    },
    group: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'conversations',
    freezeTableName: true,
    timestamps: true
  }
);

Conversation.hasMany(Message, {
  foreignKey: 'conversationId',
  as: 'messages'
});
Conversation.hasMany(Participant, {
  foreignKey: 'conversationId',
  as: 'participants'
});
