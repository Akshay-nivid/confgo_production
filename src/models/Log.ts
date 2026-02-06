import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface LogAttributes {
  id: number;
  userId: number;
  request?: string;
  response?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type LogPk = 'id';
export type LogId = Log[LogPk];
export type LogOptionalAttributes =
  | 'id'
  | 'request'
  | 'response'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedOn';
export type LogCreationAttributes = Optional<
  LogAttributes,
  LogOptionalAttributes
>;

export class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes
{
  id!: number;
  userId!: number;
  request?: string;
  response?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof Log {
    return Log.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        request: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        response: {
          type: DataTypes.TEXT,
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
        tableName: 'log',
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
