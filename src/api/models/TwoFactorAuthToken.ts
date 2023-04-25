import ITwoFactorAuthToken from '@interfaces/models/ITwoFactorAuthToken';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';

export type twoFactorAuthTokenInput = Optional<ITwoFactorAuthToken, 'id'>;
export type twoFactorAuthTokenOutput = Required<ITwoFactorAuthToken>;

export default class TwoFactorAuthToken
  extends Model<ITwoFactorAuthToken, twoFactorAuthTokenInput>
  implements ITwoFactorAuthToken
{
  public id!: string;

  public userId!: string;

  public token!: string;

  public tokenType!: string;

  public tokenExpiry!: number;

  public createdAt!: Date;

  public updatedAt!: Date;

  public deletedAt!: Date;
}
TwoFactorAuthToken.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid(),
      unique: true
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tokenType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'two_factor_auth_tokens',
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  }
);
