import IAuthTokenKeys from '@interfaces/models/IAuthTokenKeys';
import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { sequelize } from '@database/index';
import { injectable } from 'inversify';

export type AuthTokenKeysInput = Optional<
  IAuthTokenKeys,
  'id' | 'createdAt' | 'updatedAt'
>;
export type AuthTokenKeysOutput = Required<IAuthTokenKeys>;

@injectable()
export default class AuthTokenKeys
  extends Model<IAuthTokenKeys, AuthTokenKeysInput>
  implements IAuthTokenKeys
{
  public id!: string;

  public userId!: string;

  public accessTokenKey!: string;

  public refreshTokenKey!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}
AuthTokenKeys.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid()
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accessTokenKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refreshTokenKey: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    tableName: 'auth_token_keys',
    timestamps: true
  }
);
