import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SystemLevelPaymentAttributes {
  id: number;
  type: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type SystemLevelPaymentPk = 'id';
export type SystemLevelPaymentId = SystemLevelPayment[SystemLevelPaymentPk];
export type SystemLevelPaymentOptionalAttributes =
  | 'id'
  | 'createdOn'
  | 'modifiedOn';
export type SystemLevelPaymentCreationAttributes = Optional<
  SystemLevelPaymentAttributes,
  SystemLevelPaymentOptionalAttributes
>;

export class SystemLevelPayment
  extends Model<
    SystemLevelPaymentAttributes,
    SystemLevelPaymentCreationAttributes
  >
  implements SystemLevelPaymentAttributes
{
  id!: number;
  type!: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof SystemLevelPayment {
    return SystemLevelPayment.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        type: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
          allowNull: false,
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
        tableName: 'system_level_payment',
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
