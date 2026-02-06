import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface UserAuthAttributes {
  id: number;
  userId: number;
  username?: string;
  password?: string;
  provider?: string;
  providerUserId?: string;
  lastLogin: Date;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type UserAuthPk = 'id';
export type UserAuthId = UserAuth[UserAuthPk];
export type UserAuthOptionalAttributes =
  | 'id'
  | 'username'
  | 'password'
  | 'provider'
  | 'providerUserId'
  | 'lastLogin'
  | 'createdOn'
  | 'modifiedOn';
export type UserAuthCreationAttributes = Optional<
  UserAuthAttributes,
  UserAuthOptionalAttributes
>;

export class UserAuth
  extends Model<UserAuthAttributes, UserAuthCreationAttributes>
  implements UserAuthAttributes
{
  id!: number;
  userId!: number;
  username?: string;
  password?: string;
  provider?: string;
  providerUserId?: string;
  lastLogin!: Date;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // UserAuth belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserAuth {
    return UserAuth.init(
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
          references: {
            model: 'user',
            key: 'id',
          },
          unique: 'user_auth_ibfk_1',
          field: 'user_id',
        },
        username: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        provider: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        providerUserId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'provider_user_id',
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'last_login',
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
        tableName: 'user_auth',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'user_auth_ibfk_4',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'user_id',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'user_auth_ibfk_2',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'user_auth_ibfk_3',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
