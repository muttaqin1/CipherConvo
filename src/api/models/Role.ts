import IRole from '@interfaces/models/IRole';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';

export type roleInput = Optional<IRole, 'id'>;
export type roleOutput = Required<IRole>;
export default class Role
  extends Model<roleOutput, roleInput>
  implements IRole
{
  public id!: string;

  public admin!: boolean;

  public user!: boolean;

  public userId!: string;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid(),
      unique: true
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    userId: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'roles',
    freezeTableName: true,
    timestamps: true,
    paranoid: true
  }
);
