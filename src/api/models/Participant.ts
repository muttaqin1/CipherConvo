import IParticipant from '@interfaces/models/IParticipant';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';

export type participantInput = Optional<
  IParticipant,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type participantOutput = Required<IParticipant>;
export type participantUpdate = Optional<
  IParticipant,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export default class Participant
  extends Model<IParticipant, participantInput>
  implements IParticipant
{
  public id!: string;

  public conversationId!: string;

  public participantId!: string;

  public role!: 'ADMIN' | 'MEMBER';

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;
}
Participant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      defaultValue: uuid()
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    participantId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MEMBER'),
      allowNull: false,
      defaultValue: 'MEMBER'
    }
  },
  {
    sequelize,
    tableName: 'participants',
    freezeTableName: true,
    timestamps: true
  }
);
