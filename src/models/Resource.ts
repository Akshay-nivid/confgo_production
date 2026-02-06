import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { RolePermission, RolePermissionId } from './RolePermission';

export interface ResourceAttributes {
  id: number;
  resourceName: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type ResourcePk = 'id';
export type ResourceId = Resource[ResourcePk];
export type ResourceOptionalAttributes =
  | 'id'
  | 'description'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type ResourceCreationAttributes = Optional<
  ResourceAttributes,
  ResourceOptionalAttributes
>;

export class Resource
  extends Model<ResourceAttributes, ResourceCreationAttributes>
  implements ResourceAttributes
{
  id!: number;
  resourceName!: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Resource hasMany RolePermission via resourceId
  rolePermissions!: RolePermission[];
  getRolePermissions!: Sequelize.HasManyGetAssociationsMixin<RolePermission>;
  setRolePermissions!: Sequelize.HasManySetAssociationsMixin<
    RolePermission,
    RolePermissionId
  >;
  addRolePermission!: Sequelize.HasManyAddAssociationMixin<
    RolePermission,
    RolePermissionId
  >;
  addRolePermissions!: Sequelize.HasManyAddAssociationsMixin<
    RolePermission,
    RolePermissionId
  >;
  createRolePermission!: Sequelize.HasManyCreateAssociationMixin<RolePermission>;
  removeRolePermission!: Sequelize.HasManyRemoveAssociationMixin<
    RolePermission,
    RolePermissionId
  >;
  removeRolePermissions!: Sequelize.HasManyRemoveAssociationsMixin<
    RolePermission,
    RolePermissionId
  >;
  hasRolePermission!: Sequelize.HasManyHasAssociationMixin<
    RolePermission,
    RolePermissionId
  >;
  hasRolePermissions!: Sequelize.HasManyHasAssociationsMixin<
    RolePermission,
    RolePermissionId
  >;
  countRolePermissions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Resource {
    return Resource.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        resourceName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: 'resource_name',
          field: 'resource_name',
        },
        description: {
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
        tableName: 'resource',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'resource_name',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'resource_name' }],
          },
        ],
      }
    );
  }
}
