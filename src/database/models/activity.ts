import IActivity from '@interfaces/models/IActivity';
import { Model, DataTypes, Optional } from 'sequelize';
import { v4 as uuid } from 'uuid';
import connection from '@database/sequelize';

export type activityInput = Optional<
  IActivity,
  'id' | 'createdAt' | 'updatedAt'
>;
export type activityOutput = Required<IActivity>;

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

  public passwordChangedLast!: Date;

  public accessRestricted!: boolean;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
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
    passwordChangedLast: {
      type: DataTypes.DATE
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize: connection,
    tableName: 'activities',
    timestamps: true
  }
);
