import IRole from '@interfaces/models/IRole';
import { Model, DataTypes } from 'sequelize';
import { roleInput, roleOutput } from '@models/Role';
import connection from '@database/sequelize';

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
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    updatedAt: DataTypes.DATE
  },
  {
    sequelize: connection,
    timestamps: true
  }
);
