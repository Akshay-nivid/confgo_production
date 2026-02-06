import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  PlanPropertyAssignment,
  PlanPropertyAssignmentId,
} from './PlanPropertyAssignment';

export interface PlanPropertyAssignmentStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type PlanPropertyAssignmentStatusPk = 'id';
export type PlanPropertyAssignmentStatusId =
  PlanPropertyAssignmentStatus[PlanPropertyAssignmentStatusPk];
export type PlanPropertyAssignmentStatusOptionalAttributes =
  | 'id'
  | 'description';
export type PlanPropertyAssignmentStatusCreationAttributes = Optional<
  PlanPropertyAssignmentStatusAttributes,
  PlanPropertyAssignmentStatusOptionalAttributes
>;

export class PlanPropertyAssignmentStatus
  extends Model<
    PlanPropertyAssignmentStatusAttributes,
    PlanPropertyAssignmentStatusCreationAttributes
  >
  implements PlanPropertyAssignmentStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // PlanPropertyAssignmentStatus hasMany PlanPropertyAssignment via statusId
  planPropertyAssignments!: PlanPropertyAssignment[];
  getPlanPropertyAssignments!: Sequelize.HasManyGetAssociationsMixin<PlanPropertyAssignment>;
  setPlanPropertyAssignments!: Sequelize.HasManySetAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  addPlanPropertyAssignment!: Sequelize.HasManyAddAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  addPlanPropertyAssignments!: Sequelize.HasManyAddAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  createPlanPropertyAssignment!: Sequelize.HasManyCreateAssociationMixin<PlanPropertyAssignment>;
  removePlanPropertyAssignment!: Sequelize.HasManyRemoveAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  removePlanPropertyAssignments!: Sequelize.HasManyRemoveAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  hasPlanPropertyAssignment!: Sequelize.HasManyHasAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  hasPlanPropertyAssignments!: Sequelize.HasManyHasAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  countPlanPropertyAssignments!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof PlanPropertyAssignmentStatus {
    return PlanPropertyAssignmentStatus.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        statusName: {
          type: DataTypes.STRING(55),
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
        tableName: 'plan_property_assignment_status',
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
