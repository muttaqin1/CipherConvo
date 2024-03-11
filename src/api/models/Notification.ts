/* eslint-disable max-len */
import {
  INotification,
  NotificationType
} from '@interfaces/models/INotification';
import { DataTypes, Model, Optional } from 'sequelize';
import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';
import { sequelize } from '@database/index';
import User from './User';

type notification_input = Optional<
  INotification,
  'createdAt' | 'updatedAt' | 'id'
>;
type notification_output = Required<INotification>;

@injectable()
export default class Notification
  extends Model<notification_input, notification_output>
  implements INotification
{
  public id!: string;

  public type!: NotificationType;

  public seen!: boolean;

  public sender_id!: string;

  public reciever_id!: string;

  public title!: string;

  public body!: string;

  public img?: string | undefined;

  public readonly createdAt?: Date | undefined;

  public readonly updatedAt?: Date | undefined;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid()
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sender_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reciever_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: DataTypes.STRING
  },
  {
    tableName: 'notification',
    freezeTableName: true,
    timestamps: true,
    sequelize
  }
);

Notification.hasOne(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});
Notification.hasOne(User, {
  foreignKey: 'reciever_id',
  as: 'reciever'
});
