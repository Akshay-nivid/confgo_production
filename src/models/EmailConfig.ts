import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface EmailConfigAttributes {
  id: number;
  configName: string;
  template: string;
  subject: string;
  enabled?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type EmailConfigPk = 'id';
export type EmailConfigId = EmailConfig[EmailConfigPk];
export type EmailConfigOptionalAttributes =
  | 'id'
  | 'enabled'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type EmailConfigCreationAttributes = Optional<
  EmailConfigAttributes,
  EmailConfigOptionalAttributes
>;

export class EmailConfig
  extends Model<EmailConfigAttributes, EmailConfigCreationAttributes>
  implements EmailConfigAttributes
{
  id!: number;
  configName!: string;
  template!: string;
  subject!: string;
  enabled?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof EmailConfig {
    return EmailConfig.init(
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
        template: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        subject: {
          type: DataTypes.STRING(225),
          allowNull: false,
        },
        enabled: {
          type: DataTypes.TINYINT,
          allowNull: true,
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
        tableName: 'email_config',
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
