import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Plan, PlanId } from './Plan';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';
import type {
  PlanPropertyAssignmentStatus,
  PlanPropertyAssignmentStatusId,
} from './PlanPropertyAssignmentStatus';

export interface PlanPropertyAssignmentAttributes {
  id: number;
  planId?: number;
  planPropertyId?: number;
  maxLimit?: number;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type PlanPropertyAssignmentPk = 'id';
export type PlanPropertyAssignmentId =
  PlanPropertyAssignment[PlanPropertyAssignmentPk];
export type PlanPropertyAssignmentOptionalAttributes =
  | 'id'
  | 'planId'
  | 'planPropertyId'
  | 'maxLimit'
  | 'statusId'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type PlanPropertyAssignmentCreationAttributes = Optional<
  PlanPropertyAssignmentAttributes,
  PlanPropertyAssignmentOptionalAttributes
>;

export class PlanPropertyAssignment
  extends Model<
    PlanPropertyAssignmentAttributes,
    PlanPropertyAssignmentCreationAttributes
  >
  implements PlanPropertyAssignmentAttributes
{
  id!: number;
  planId?: number;
  planPropertyId?: number;
  maxLimit?: number;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // PlanPropertyAssignment belongsTo Plan via planId
  plan!: Plan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<Plan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<Plan, PlanId>;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<Plan>;
  // PlanPropertyAssignment belongsTo PlanProperty via planPropertyId
  planProperty!: PlanProperty;
  getPlanProperty!: Sequelize.BelongsToGetAssociationMixin<PlanProperty>;
  setPlanProperty!: Sequelize.BelongsToSetAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  createPlanProperty!: Sequelize.BelongsToCreateAssociationMixin<PlanProperty>;
  // PlanPropertyAssignment belongsTo PlanPropertyAssignmentStatus via statusId
  status!: PlanPropertyAssignmentStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<PlanPropertyAssignmentStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    PlanPropertyAssignmentStatus,
    PlanPropertyAssignmentStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<PlanPropertyAssignmentStatus>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof PlanPropertyAssignment {
    return PlanPropertyAssignment.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        planId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'plan',
            key: 'id',
          },
          field: 'plan_id',
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
        maxLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'max_limit',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'plan_property_assignment_status',
            key: 'id',
          },
          field: 'status_id',
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
        tableName: 'plan_property_assignment',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'plan_property_assignment_plan_property_FK',
            using: 'BTREE',
            fields: [{ name: 'plan_property_id' }],
          },
          {
            name: 'plan_property_assignment_plan_FK_1',
            using: 'BTREE',
            fields: [{ name: 'plan_id' }],
          },
          {
            name: 'PPAssignment_PPAssignment_status_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
