import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  ExtraPricingStatus,
  ExtraPricingStatusId,
} from './ExtraPricingStatus';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';
import type {
  SubscriptionExtraPricing,
  SubscriptionExtraPricingId,
} from './SubscriptionExtraPricing';

export interface ExtraPricingAttributes {
  id: number;
  planPropertyId?: number;
  price: number;
  description?: string;
  maxLimit?: number;
  currency?: string;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type ExtraPricingPk = 'id';
export type ExtraPricingId = ExtraPricing[ExtraPricingPk];
export type ExtraPricingOptionalAttributes =
  | 'id'
  | 'planPropertyId'
  | 'description'
  | 'maxLimit'
  | 'currency'
  | 'statusId'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type ExtraPricingCreationAttributes = Optional<
  ExtraPricingAttributes,
  ExtraPricingOptionalAttributes
>;

export class ExtraPricing
  extends Model<ExtraPricingAttributes, ExtraPricingCreationAttributes>
  implements ExtraPricingAttributes
{
  id!: number;
  planPropertyId?: number;
  price!: number;
  description?: string;
  maxLimit?: number;
  currency?: string;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // ExtraPricing hasMany SubscriptionExtraPricing via extraPricingId
  subscriptionExtraPricings!: SubscriptionExtraPricing[];
  getSubscriptionExtraPricings!: Sequelize.HasManyGetAssociationsMixin<SubscriptionExtraPricing>;
  setSubscriptionExtraPricings!: Sequelize.HasManySetAssociationsMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  addSubscriptionExtraPricing!: Sequelize.HasManyAddAssociationMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  addSubscriptionExtraPricings!: Sequelize.HasManyAddAssociationsMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  createSubscriptionExtraPricing!: Sequelize.HasManyCreateAssociationMixin<SubscriptionExtraPricing>;
  removeSubscriptionExtraPricing!: Sequelize.HasManyRemoveAssociationMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  removeSubscriptionExtraPricings!: Sequelize.HasManyRemoveAssociationsMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  hasSubscriptionExtraPricing!: Sequelize.HasManyHasAssociationMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  hasSubscriptionExtraPricings!: Sequelize.HasManyHasAssociationsMixin<
    SubscriptionExtraPricing,
    SubscriptionExtraPricingId
  >;
  countSubscriptionExtraPricings!: Sequelize.HasManyCountAssociationsMixin;
  // ExtraPricing belongsTo ExtraPricingStatus via statusId
  status!: ExtraPricingStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<ExtraPricingStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    ExtraPricingStatus,
    ExtraPricingStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<ExtraPricingStatus>;
  // ExtraPricing belongsTo PlanProperty via planPropertyId
  planProperty!: PlanProperty;
  getPlanProperty!: Sequelize.BelongsToGetAssociationMixin<PlanProperty>;
  setPlanProperty!: Sequelize.BelongsToSetAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  createPlanProperty!: Sequelize.BelongsToCreateAssociationMixin<PlanProperty>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ExtraPricing {
    return ExtraPricing.init(
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
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        maxLimit: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'max_limit',
        },
        currency: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'extra_pricing_status',
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
        tableName: 'extra_pricing',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'extra_pricing_plan_property_FK',
            using: 'BTREE',
            fields: [{ name: 'plan_property_id' }],
          },
          {
            name: 'extra_pricing_extra_pricing_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
