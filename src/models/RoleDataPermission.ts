import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Action, ActionId } from './Action';
import type { Role, RoleId } from './Role';

export interface RoleDataPermissionAttributes {
  id: number;
  roleId: number;
  targetTable: string;
  rowId: number;
  actionId: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type RoleDataPermissionPk = 'id';
export type RoleDataPermissionId = RoleDataPermission[RoleDataPermissionPk];
export type RoleDataPermissionOptionalAttributes =
  | 'id'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type RoleDataPermissionCreationAttributes = Optional<
  RoleDataPermissionAttributes,
  RoleDataPermissionOptionalAttributes
>;

export class RoleDataPermission
  extends Model<
    RoleDataPermissionAttributes,
    RoleDataPermissionCreationAttributes
  >
  implements RoleDataPermissionAttributes
{
  id!: number;
  roleId!: number;
  targetTable!: string;
  rowId!: number;
  actionId!: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // RoleDataPermission belongsTo Action via actionId
  action!: Action;
  getAction!: Sequelize.BelongsToGetAssociationMixin<Action>;
  setAction!: Sequelize.BelongsToSetAssociationMixin<Action, ActionId>;
  createAction!: Sequelize.BelongsToCreateAssociationMixin<Action>;
  // RoleDataPermission belongsTo Role via roleId
  role!: Role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<Role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<Role, RoleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<Role>;

  static initModel(sequelize: Sequelize.Sequelize): typeof RoleDataPermission {
    return RoleDataPermission.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'role',
            key: 'id',
          },
          field: 'role_id',
        },
        targetTable: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'target_table',
        },
        rowId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'row_id',
        },
        actionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        tableName: 'role_data_permission',
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
            name: 'action_id',
            using: 'BTREE',
            fields: [{ name: 'action_id' }],
          },
        ],
      }
    );
  }
}
