import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RoleDataPermission, RoleDataPermissionId } from './RoleDataPermission';
import type { RolePermission, RolePermissionId } from './RolePermission';

export interface ActionAttributes {
  id: number;
  actionName: 'READ' | 'WRITE' | 'CREATE' | 'DELETE';
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type ActionPk = "id";
export type ActionId = Action[ActionPk];
export type ActionOptionalAttributes = "id" | "description" | "createdBy" | "createdOn" | "modifiedBy" | "modifiedOn";
export type ActionCreationAttributes = Optional<ActionAttributes, ActionOptionalAttributes>;

export class Action extends Model<ActionAttributes, ActionCreationAttributes> implements ActionAttributes {
  id!: number;
  actionName!: 'READ' | 'WRITE' | 'CREATE' | 'DELETE';
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Action hasMany RoleDataPermission via actionId
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
  // Action hasMany RolePermission via actionId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Action {
    return Action.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    actionName: {
      type: DataTypes.ENUM('READ','WRITE','CREATE','DELETE'),
      allowNull: false,
      field: 'action_name'
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
    tableName: 'action',
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
    ]
  });
  }
}
