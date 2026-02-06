import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { SmsConfig, SmsConfigId } from './SmsConfig';

export interface SmsConfigStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type SmsConfigStatusPk = 'id';
export type SmsConfigStatusId = SmsConfigStatus[SmsConfigStatusPk];
export type SmsConfigStatusOptionalAttributes = 'id' | 'description';
export type SmsConfigStatusCreationAttributes = Optional<
  SmsConfigStatusAttributes,
  SmsConfigStatusOptionalAttributes
>;

export class SmsConfigStatus
  extends Model<SmsConfigStatusAttributes, SmsConfigStatusCreationAttributes>
  implements SmsConfigStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // SmsConfigStatus hasMany SmsConfig via statusId
  smsConfigs!: SmsConfig[];
  getSmsConfigs!: Sequelize.HasManyGetAssociationsMixin<SmsConfig>;
  setSmsConfigs!: Sequelize.HasManySetAssociationsMixin<SmsConfig, SmsConfigId>;
  addSmsConfig!: Sequelize.HasManyAddAssociationMixin<SmsConfig, SmsConfigId>;
  addSmsConfigs!: Sequelize.HasManyAddAssociationsMixin<SmsConfig, SmsConfigId>;
  createSmsConfig!: Sequelize.HasManyCreateAssociationMixin<SmsConfig>;
  removeSmsConfig!: Sequelize.HasManyRemoveAssociationMixin<
    SmsConfig,
    SmsConfigId
  >;
  removeSmsConfigs!: Sequelize.HasManyRemoveAssociationsMixin<
    SmsConfig,
    SmsConfigId
  >;
  hasSmsConfig!: Sequelize.HasManyHasAssociationMixin<SmsConfig, SmsConfigId>;
  hasSmsConfigs!: Sequelize.HasManyHasAssociationsMixin<SmsConfig, SmsConfigId>;
  countSmsConfigs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof SmsConfigStatus {
    return SmsConfigStatus.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        statusName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'status_name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'sms_config_status',
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
