import IActivity from '@interfaces/models/IActivity';
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import { v4 as uuid } from 'uuid';
import { injectable } from 'inversify';

export type activityInput = Optional<
  IActivity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;
export type activityOutput = Required<IActivity>;

@injectable()
export default class Activity
  extends Model<activityOutput, activityInput>
  implements IActivity
{
  public id!: string;

  public userId!: string;

  public failedLoginAttempts!: number;

  public emailVerified!: boolean;

  public sendedTwoFactorAuthCodeCount!: number;

  public permanentAccessRestricted!: boolean;

  public accessRestricted!: boolean;

  public accessRestrictedUntil!: Date;

  public twoFactorAuthRestricted!: boolean;

  public twoFactorAuthRestrictedUntil!: Date;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;
}

Activity.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid(),
      unique: true
    },
    userId: DataTypes.UUID,
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sendedTwoFactorAuthCodeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    permanentAccessRestricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accessRestricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accessRestrictedUntil: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    twoFactorAuthRestricted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorAuthRestrictedUntil: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'activities',
    timestamps: true,
    freezeTableName: true
  }
);
