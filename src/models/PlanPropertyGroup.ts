import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';

export interface PlanPropertyGroupAttributes {
  id: number;
  planPropertyId?: number;
  name: string;
  description?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type PlanPropertyGroupPk = 'id';
export type PlanPropertyGroupId = PlanPropertyGroup[PlanPropertyGroupPk];
export type PlanPropertyGroupOptionalAttributes =
  | 'id'
  | 'planPropertyId'
  | 'description'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type PlanPropertyGroupCreationAttributes = Optional<
  PlanPropertyGroupAttributes,
  PlanPropertyGroupOptionalAttributes
>;

export class PlanPropertyGroup
  extends Model<
    PlanPropertyGroupAttributes,
    PlanPropertyGroupCreationAttributes
  >
  implements PlanPropertyGroupAttributes
{
  id!: number;
  planPropertyId?: number;
  name!: string;
  description?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // PlanPropertyGroup belongsTo PlanProperty via planPropertyId
  planProperty!: PlanProperty;
  getPlanProperty!: Sequelize.BelongsToGetAssociationMixin<PlanProperty>;
  setPlanProperty!: Sequelize.BelongsToSetAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  createPlanProperty!: Sequelize.BelongsToCreateAssociationMixin<PlanProperty>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PlanPropertyGroup {
    return PlanPropertyGroup.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        planPropertyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'plan_property',
            key: 'id',
          },
          field: 'plan_property_id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: 'plan_property_group',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'plan_property_group_plan_property_FK',
            using: 'BTREE',
            fields: [{ name: 'plan_property_id' }],
          },
        ],
      }
    );
  }
}
