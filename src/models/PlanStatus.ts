import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Plan, PlanId } from './Plan';

export interface PlanStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type PlanStatusPk = 'id';
export type PlanStatusId = PlanStatus[PlanStatusPk];
export type PlanStatusOptionalAttributes = 'id' | 'description';
export type PlanStatusCreationAttributes = Optional<
  PlanStatusAttributes,
  PlanStatusOptionalAttributes
>;

export class PlanStatus
  extends Model<PlanStatusAttributes, PlanStatusCreationAttributes>
  implements PlanStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // PlanStatus hasMany Plan via statusId
  plans!: Plan[];
  getPlans!: Sequelize.HasManyGetAssociationsMixin<Plan>;
  setPlans!: Sequelize.HasManySetAssociationsMixin<Plan, PlanId>;
  addPlan!: Sequelize.HasManyAddAssociationMixin<Plan, PlanId>;
  addPlans!: Sequelize.HasManyAddAssociationsMixin<Plan, PlanId>;
  createPlan!: Sequelize.HasManyCreateAssociationMixin<Plan>;
  removePlan!: Sequelize.HasManyRemoveAssociationMixin<Plan, PlanId>;
  removePlans!: Sequelize.HasManyRemoveAssociationsMixin<Plan, PlanId>;
  hasPlan!: Sequelize.HasManyHasAssociationMixin<Plan, PlanId>;
  hasPlans!: Sequelize.HasManyHasAssociationsMixin<Plan, PlanId>;
  countPlans!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof PlanStatus {
    return PlanStatus.init(
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
        tableName: 'plan_status',
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
