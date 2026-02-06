import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { SmsConfigStatus, SmsConfigStatusId } from './SmsConfigStatus';

export interface SmsConfigAttributes {
  id: number;
  configName: string;
  enabled?: number;
  templateBody: string;
  senderId?: string;
  statusId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type SmsConfigPk = 'id';
export type SmsConfigId = SmsConfig[SmsConfigPk];
export type SmsConfigOptionalAttributes =
  | 'id'
  | 'enabled'
  | 'senderId'
  | 'statusId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type SmsConfigCreationAttributes = Optional<
  SmsConfigAttributes,
  SmsConfigOptionalAttributes
>;

export class SmsConfig
  extends Model<SmsConfigAttributes, SmsConfigCreationAttributes>
  implements SmsConfigAttributes
{
  id!: number;
  configName!: string;
  enabled?: number;
  templateBody!: string;
  senderId?: string;
  statusId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // SmsConfig belongsTo SmsConfigStatus via statusId
  status!: SmsConfigStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<SmsConfigStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    SmsConfigStatus,
    SmsConfigStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<SmsConfigStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof SmsConfig {
    return SmsConfig.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        configName: {
          type: DataTypes.STRING(45),
          allowNull: false,
          field: 'config_name',
        },
        enabled: {
          type: DataTypes.TINYINT,
          allowNull: true,
        },
        templateBody: {
          type: DataTypes.STRING(225),
          allowNull: false,
          field: 'template_body',
        },
        senderId: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'sender_id',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'sms_config_status',
            key: 'id',
          },
          field: 'status_id',
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
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'sms_config',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'sms_config_sms_config_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
