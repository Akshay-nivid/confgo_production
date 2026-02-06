import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RoleDataPermission, RoleDataPermissionId } from './RoleDataPermission';
import type { RolePermission, RolePermissionId } from './RolePermission';
import type { UserRole, UserRoleId } from './UserRole';

export interface RoleAttributes {
  id: number;
  roleName: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type RolePk = "id";
export type RoleId = Role[RolePk];
export type RoleOptionalAttributes = "id" | "description" | "createdBy" | "createdOn" | "modifiedBy" | "modifiedOn";
export type RoleCreationAttributes = Optional<RoleAttributes, RoleOptionalAttributes>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  id!: number;
  roleName!: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Role hasMany RoleDataPermission via roleId
  roleDataPermissions!: RoleDataPermission[];
  getRoleDataPermissions!: Sequelize.HasManyGetAssociationsMixin<RoleDataPermission>;
  setRoleDataPermissions!: Sequelize.HasManySetAssociationsMixin<RoleDataPermission, RoleDataPermissionId>;
  addRoleDataPermission!: Sequelize.HasManyAddAssociationMixin<RoleDataPermission, RoleDataPermissionId>;
  addRoleDataPermissions!: Sequelize.HasManyAddAssociationsMixin<RoleDataPermission, RoleDataPermissionId>;
  createRoleDataPermission!: Sequelize.HasManyCreateAssociationMixin<RoleDataPermission>;
  removeRoleDataPermission!: Sequelize.HasManyRemoveAssociationMixin<RoleDataPermission, RoleDataPermissionId>;
  removeRoleDataPermissions!: Sequelize.HasManyRemoveAssociationsMixin<RoleDataPermission, RoleDataPermissionId>;
  hasRoleDataPermission!: Sequelize.HasManyHasAssociationMixin<RoleDataPermission, RoleDataPermissionId>;
  hasRoleDataPermissions!: Sequelize.HasManyHasAssociationsMixin<RoleDataPermission, RoleDataPermissionId>;
  countRoleDataPermissions!: Sequelize.HasManyCountAssociationsMixin;
  // Role hasMany RolePermission via roleId
  rolePermissions!: RolePermission[];
  getRolePermissions!: Sequelize.HasManyGetAssociationsMixin<RolePermission>;
  setRolePermissions!: Sequelize.HasManySetAssociationsMixin<RolePermission, RolePermissionId>;
  addRolePermission!: Sequelize.HasManyAddAssociationMixin<RolePermission, RolePermissionId>;
  addRolePermissions!: Sequelize.HasManyAddAssociationsMixin<RolePermission, RolePermissionId>;
  createRolePermission!: Sequelize.HasManyCreateAssociationMixin<RolePermission>;
  removeRolePermission!: Sequelize.HasManyRemoveAssociationMixin<RolePermission, RolePermissionId>;
  removeRolePermissions!: Sequelize.HasManyRemoveAssociationsMixin<RolePermission, RolePermissionId>;
  hasRolePermission!: Sequelize.HasManyHasAssociationMixin<RolePermission, RolePermissionId>;
  hasRolePermissions!: Sequelize.HasManyHasAssociationsMixin<RolePermission, RolePermissionId>;
  countRolePermissions!: Sequelize.HasManyCountAssociationsMixin;
  // Role hasMany UserRole via roleId
  userRoles!: UserRole[];
  getUserRoles!: Sequelize.HasManyGetAssociationsMixin<UserRole>;
  setUserRoles!: Sequelize.HasManySetAssociationsMixin<UserRole, UserRoleId>;
  addUserRole!: Sequelize.HasManyAddAssociationMixin<UserRole, UserRoleId>;
  addUserRoles!: Sequelize.HasManyAddAssociationsMixin<UserRole, UserRoleId>;
  createUserRole!: Sequelize.HasManyCreateAssociationMixin<UserRole>;
  removeUserRole!: Sequelize.HasManyRemoveAssociationMixin<UserRole, UserRoleId>;
  removeUserRoles!: Sequelize.HasManyRemoveAssociationsMixin<UserRole, UserRoleId>;
  hasUserRole!: Sequelize.HasManyHasAssociationMixin<UserRole, UserRoleId>;
  hasUserRoles!: Sequelize.HasManyHasAssociationsMixin<UserRole, UserRoleId>;
  countUserRoles!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Role {
    return Role.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "role_name",
      field: 'role_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'role',
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
        name: "role_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_name" },
        ]
      },
    ]
  });
  }
}
