import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface UserDataAttributes {
  id: number;
  dataKey: string;
  dataValue: string;
  userId: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type UserDataPk = 'id';
export type UserDataId = UserData[UserDataPk];
export type UserDataOptionalAttributes =
  | 'id'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type UserDataCreationAttributes = Optional<
  UserDataAttributes,
  UserDataOptionalAttributes
>;

export class UserData
  extends Model<UserDataAttributes, UserDataCreationAttributes>
  implements UserDataAttributes
{
  id!: number;
  dataKey!: string;
  dataValue!: string;
  userId!: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // UserData belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserData {
    return UserData.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        dataKey: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'data_key',
        },
        dataValue: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'data_value',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
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
          defaultValue: 1,
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
        tableName: 'user_data',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'user_data_user_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
