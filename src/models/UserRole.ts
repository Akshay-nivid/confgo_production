import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Role, RoleId } from './Role';
import type { User, UserId } from './User';

export interface UserRoleAttributes {
  id: number;
  userId?: number;
  roleId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type UserRolePk = "id";
export type UserRoleId = UserRole[UserRolePk];
export type UserRoleOptionalAttributes = "id" | "userId" | "roleId" | "createdBy" | "createdOn" | "modifiedBy" | "modifiedOn";
export type UserRoleCreationAttributes = Optional<UserRoleAttributes, UserRoleOptionalAttributes>;

export class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
  id!: number;
  userId?: number;
  roleId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // UserRole belongsTo Role via roleId
  role!: Role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Role, RoleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Role>;
  // UserRole belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserRole {
    return UserRole.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'role',
        key: 'id'
      },
      field: 'role_id'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by'
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_on'
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    }
  }, {
    sequelize,
    tableName: 'user_role',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_role_roleId_foreign_idx",
        using: "BTREE",
        fields: [
          { name: "role_id" },
        ]
      },
    ]
  });
  }
}
