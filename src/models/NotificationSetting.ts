import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface NotificationSettingAttributes {
  id: number;
  actionName: string;
  description?: string;
  email?: number;
  sms?: number;
  whatsapp?: number;
  isEnabled?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type NotificationSettingPk = 'id';
export type NotificationSettingId = NotificationSetting[NotificationSettingPk];
export type NotificationSettingOptionalAttributes =
  | 'id'
  | 'description'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'isEnabled'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type NotificationSettingCreationAttributes = Optional<
  NotificationSettingAttributes,
  NotificationSettingOptionalAttributes
>;

export class NotificationSetting
  extends Model<
    NotificationSettingAttributes,
    NotificationSettingCreationAttributes
  >
  implements NotificationSettingAttributes
{
  id!: number;
  actionName!: string;
  description?: string;
  email?: number;
  sms?: number;
  whatsapp?: number;
  isEnabled?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof NotificationSetting {
    return NotificationSetting.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        actionName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'action_name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        email: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 0,
        },
        sms: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 0,
        },
        whatsapp: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 0,
        },
        isEnabled: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 1,
          field: 'is_enabled',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'created_by',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'modified_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'notification_setting',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
