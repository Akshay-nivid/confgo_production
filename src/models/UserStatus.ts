import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface UserStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type UserStatusPk = 'id';
export type UserStatusId = UserStatus[UserStatusPk];
export type UserStatusOptionalAttributes = 'id' | 'description';
export type UserStatusCreationAttributes = Optional<
  UserStatusAttributes,
  UserStatusOptionalAttributes
>;

export class UserStatus
  extends Model<UserStatusAttributes, UserStatusCreationAttributes>
  implements UserStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // UserStatus hasMany User via statusId
  users!: User[];
  getUsers!: Sequelize.HasManyGetAssociationsMixin<User>;
  setUsers!: Sequelize.HasManySetAssociationsMixin<User, UserId>;
  addUser!: Sequelize.HasManyAddAssociationMixin<User, UserId>;
  addUsers!: Sequelize.HasManyAddAssociationsMixin<User, UserId>;
  createUser!: Sequelize.HasManyCreateAssociationMixin<User>;
  removeUser!: Sequelize.HasManyRemoveAssociationMixin<User, UserId>;
  removeUsers!: Sequelize.HasManyRemoveAssociationsMixin<User, UserId>;
  hasUser!: Sequelize.HasManyHasAssociationMixin<User, UserId>;
  hasUsers!: Sequelize.HasManyHasAssociationsMixin<User, UserId>;
  countUsers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserStatus {
    return UserStatus.init(
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
        tableName: 'user_status',
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
