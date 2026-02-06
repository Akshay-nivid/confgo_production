import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type {
  PlanPropertyAssignment,
  PlanPropertyAssignmentId,
} from './PlanPropertyAssignment';
import type { PlanStatus, PlanStatusId } from './PlanStatus';
import type { Subscription, SubscriptionId } from './Subscription';

export interface PlanAttributes {
  id: number;
  name: string;
  amount: number;
  currency?: string;
  eventAllotment?: string;
  organizationType?: string;
  eventLimits?: string;
  validityDay: number;
  statusId: number;
  description?: string;
  assetId?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type PlanPk = 'id';
export type PlanId = Plan[PlanPk];
export type PlanOptionalAttributes =
  | 'id'
  | 'currency'
  | 'eventAllotment'
  | 'organizationType'
  | 'eventLimits'
  | 'description'
  | 'assetId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type PlanCreationAttributes = Optional<
  PlanAttributes,
  PlanOptionalAttributes
>;

export class Plan
  extends Model<PlanAttributes, PlanCreationAttributes>
  implements PlanAttributes
{
  id!: number;
  name!: string;
  amount!: number;
  currency?: string;
  eventAllotment?: string;
  organizationType?: string;
  eventLimits?: string;
  validityDay!: number;
  statusId!: number;
  description?: string;
  assetId?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Plan belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Plan hasMany PlanPropertyAssignment via planId
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
  // Plan hasMany Subscription via planId
  subscriptions!: Subscription[];
  getSubscriptions!: Sequelize.HasManyGetAssociationsMixin<Subscription>;
  setSubscriptions!: Sequelize.HasManySetAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  addSubscription!: Sequelize.HasManyAddAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  addSubscriptions!: Sequelize.HasManyAddAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  createSubscription!: Sequelize.HasManyCreateAssociationMixin<Subscription>;
  removeSubscription!: Sequelize.HasManyRemoveAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  removeSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  hasSubscription!: Sequelize.HasManyHasAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  hasSubscriptions!: Sequelize.HasManyHasAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  countSubscriptions!: Sequelize.HasManyCountAssociationsMixin;
  // Plan belongsTo PlanStatus via statusId
  status!: PlanStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<PlanStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<PlanStatus, PlanStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<PlanStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Plan {
    return Plan.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        currency: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        eventAllotment: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'event_allotment',
        },
        organizationType: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'organization_type',
        },
        eventLimits: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'event_limits',
        },
        validityDay: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'validity_day',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'plan_status',
            key: 'id',
          },
          field: 'status_id',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        assetId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          references: {
            model: 'asset',
            key: 'id',
          },
          field: 'asset_id',
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
        tableName: 'plan',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'plan_asset_FK',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
          {
            name: 'plan_asset_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
        ],
      }
    );
  }
}
