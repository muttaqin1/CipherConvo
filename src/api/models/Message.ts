import IMessage from '@interfaces/models/IMessage';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';

export type messageInput = Optional<
  IMessage,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type messageOutput = Required<IMessage>;
export type messageUpdate = Optional<
  IMessage,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export default class Message
  extends Model<IMessage, messageInput>
  implements IMessage
{
  public id!: string;

  public text!: string;

  public senderId!: string;

  public receiverId!: string;

  public conversationId!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;
}
Message.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: uuid()
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'messages',
    freezeTableName: true,
    timestamps: true
  }
);
