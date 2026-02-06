import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';

export interface PlanPropertyStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type PlanPropertyStatusPk = 'id';
export type PlanPropertyStatusId = PlanPropertyStatus[PlanPropertyStatusPk];
export type PlanPropertyStatusOptionalAttributes = 'id' | 'description';
export type PlanPropertyStatusCreationAttributes = Optional<
  PlanPropertyStatusAttributes,
  PlanPropertyStatusOptionalAttributes
>;

export class PlanPropertyStatus
  extends Model<
    PlanPropertyStatusAttributes,
    PlanPropertyStatusCreationAttributes
  >
  implements PlanPropertyStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // PlanPropertyStatus hasMany PlanProperty via statusId
  planProperties!: PlanProperty[];
  getPlanProperties!: Sequelize.HasManyGetAssociationsMixin<PlanProperty>;
  setPlanProperties!: Sequelize.HasManySetAssociationsMixin<
    PlanProperty,
    PlanPropertyId
  >;
  addPlanProperty!: Sequelize.HasManyAddAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  addPlanProperties!: Sequelize.HasManyAddAssociationsMixin<
    PlanProperty,
    PlanPropertyId
  >;
  createPlanProperty!: Sequelize.HasManyCreateAssociationMixin<PlanProperty>;
  removePlanProperty!: Sequelize.HasManyRemoveAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  removePlanProperties!: Sequelize.HasManyRemoveAssociationsMixin<
    PlanProperty,
    PlanPropertyId
  >;
  hasPlanProperty!: Sequelize.HasManyHasAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  hasPlanProperties!: Sequelize.HasManyHasAssociationsMixin<
    PlanProperty,
    PlanPropertyId
  >;
  countPlanProperties!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof PlanPropertyStatus {
    return PlanPropertyStatus.init(
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
        tableName: 'plan_property_status',
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
