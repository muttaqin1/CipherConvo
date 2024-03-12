import { sequelize } from '@database/index';
import { Model, DataTypes } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { injectable } from 'inversify';

@injectable()
export default class NotificationTab extends Model {
  public id!: string;

  public readonly createdAt?: Date | undefined;

  public readonly updatedAt?: Date | undefined;
}

NotificationTab.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid()
    }
  },
  {
    sequelize,
    tableName: 'notification_tab',
    freezeTableName: true,
    timestamps: true
  }
);
