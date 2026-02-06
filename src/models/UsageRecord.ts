import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';
import type { Subscription, SubscriptionId } from './Subscription';
import type { User, UserId } from './User';

export interface UsageRecordAttributes {
  id: number;
  subscriptionId?: number;
  userId?: number;
  planPropertyId?: number;
  maxLimit?: number;
  currentUsage?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type UsageRecordPk = 'id';
export type UsageRecordId = UsageRecord[UsageRecordPk];
export type UsageRecordOptionalAttributes =
  | 'id'
  | 'subscriptionId'
  | 'userId'
  | 'planPropertyId'
  | 'maxLimit'
  | 'currentUsage'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type UsageRecordCreationAttributes = Optional<
  UsageRecordAttributes,
  UsageRecordOptionalAttributes
>;

export class UsageRecord
  extends Model<UsageRecordAttributes, UsageRecordCreationAttributes>
  implements UsageRecordAttributes
{
  id!: number;
  subscriptionId?: number;
  userId?: number;
  planPropertyId?: number;
  maxLimit?: number;
  currentUsage?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // UsageRecord belongsTo PlanProperty via planPropertyId
  planProperty!: PlanProperty;
  getPlanProperty!: Sequelize.BelongsToGetAssociationMixin<PlanProperty>;
  setPlanProperty!: Sequelize.BelongsToSetAssociationMixin<
    PlanProperty,
    PlanPropertyId
  >;
  createPlanProperty!: Sequelize.BelongsToCreateAssociationMixin<PlanProperty>;
  // UsageRecord belongsTo Subscription via subscriptionId
  subscription!: Subscription;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<Subscription>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<Subscription>;
  // UsageRecord belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UsageRecord {
    return UsageRecord.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        subscriptionId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'subscription',
            key: 'id',
          },
          field: 'subscription_id',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
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
        currentUsage: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'current_usage',
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
        tableName: 'usage_record',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'usage_record_subscription_FK',
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }],
          },
          {
            name: 'usage_record_plan_property_FK',
            using: 'BTREE',
            fields: [{ name: 'plan_property_id' }],
          },
          {
            name: 'usage_record_user_FK',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
