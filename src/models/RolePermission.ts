import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Action, ActionId } from './Action';
import type { Resource, ResourceId } from './Resource';
import type { Role, RoleId } from './Role';

export interface RolePermissionAttributes {
  id: number;
  roleId?: number;
  resourceId?: number;
  actionId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type RolePermissionPk = 'id';
export type RolePermissionId = RolePermission[RolePermissionPk];
export type RolePermissionOptionalAttributes =
  | 'id'
  | 'roleId'
  | 'resourceId'
  | 'actionId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type RolePermissionCreationAttributes = Optional<
  RolePermissionAttributes,
  RolePermissionOptionalAttributes
>;

export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  id!: number;
  roleId?: number;
  resourceId?: number;
  actionId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // RolePermission belongsTo Action via actionId
  action!: Action;
  getAction!: Sequelize.BelongsToGetAssociationMixin<Action>;
  setAction!: Sequelize.BelongsToSetAssociationMixin<Action, ActionId>;
  createAction!: Sequelize.BelongsToCreateAssociationMixin<Action>;
  // RolePermission belongsTo Resource via resourceId
  resource!: Resource;
  getResource!: Sequelize.BelongsToGetAssociationMixin<Resource>;
  setResource!: Sequelize.BelongsToSetAssociationMixin<Resource, ResourceId>;
  createResource!: Sequelize.BelongsToCreateAssociationMixin<Resource>;
  // RolePermission belongsTo Role via roleId
  role!: Role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Role, RoleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Role>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RolePermission {
    return RolePermission.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'role',
            key: 'id',
          },
          field: 'role_id',
        },
        resourceId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'resource',
            key: 'id',
          },
          field: 'resource_id',
        },
        actionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'action',
            key: 'id',
          },
          field: 'action_id',
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
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'role_permission',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'role_id',
            using: 'BTREE',
            fields: [{ name: 'role_id' }],
          },
          {
            name: 'resource_id',
            using: 'BTREE',
            fields: [{ name: 'resource_id' }],
          },
          {
            name: 'action_id',
            using: 'BTREE',
            fields: [{ name: 'action_id' }],
          },
        ],
      }
    );
  }
}
