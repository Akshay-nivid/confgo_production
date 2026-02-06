import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Payment, PaymentId } from './Payment';
import type { Plan, PlanId } from './Plan';
import type {
  SubscriptionExtraPricing,
  SubscriptionExtraPricingId,
} from './SubscriptionExtraPricing';
import type {
  SubscriptionPayment,
  SubscriptionPaymentId,
} from './SubscriptionPayment';
import type {
  SubscriptionStatus,
  SubscriptionStatusId,
} from './SubscriptionStatus';
import type { UsageRecord, UsageRecordId } from './UsageRecord';
import type { User, UserId } from './User';

export interface SubscriptionAttributes {
  id: number;
  userId?: number;
  validityDay?: number;
  planId?: number;
  isTrial?: number;
  endDate?: Date;
  startDate?: Date;
  statusId?: number;
  discountCouponId?: number;
  extendedPlanId?: number;
  extendedPlanStart?: Date;
  paymentId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type SubscriptionPk = 'id';
export type SubscriptionId = Subscription[SubscriptionPk];
export type SubscriptionOptionalAttributes =
  | 'id'
  | 'userId'
  | 'validityDay'
  | 'planId'
  | 'isTrial'
  | 'endDate'
  | 'startDate'
  | 'statusId'
  | 'discountCouponId'
  | 'extendedPlanId'
  | 'extendedPlanStart'
  | 'paymentId'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type SubscriptionCreationAttributes = Optional<
  SubscriptionAttributes,
  SubscriptionOptionalAttributes
>;

export class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  id!: number;
  userId?: number;
  validityDay?: number;
  planId?: number;
  isTrial?: number;
  endDate?: Date;
  startDate?: Date;
  statusId?: number;
  discountCouponId?: number;
  extendedPlanId?: number;
  extendedPlanStart?: Date;
  paymentId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Subscription belongsTo Payment via paymentId
  payment!: Payment;
  getPayment!: Sequelize.BelongsToGetAssociationMixin<Payment>;
  setPayment!: Sequelize.BelongsToSetAssociationMixin<Payment, PaymentId>;
  createPayment!: Sequelize.BelongsToCreateAssociationMixin<Payment>;
  // Subscription belongsTo Plan via planId
  plan!: Plan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<Plan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<Plan, PlanId>;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<Plan>;
  // Subscription hasMany SubscriptionExtraPricing via subscriptionId
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
  // Subscription hasMany SubscriptionPayment via subscriptionId
  subscriptionPayments!: SubscriptionPayment[];
  getSubscriptionPayments!: Sequelize.HasManyGetAssociationsMixin<SubscriptionPayment>;
  setSubscriptionPayments!: Sequelize.HasManySetAssociationsMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  addSubscriptionPayment!: Sequelize.HasManyAddAssociationMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  addSubscriptionPayments!: Sequelize.HasManyAddAssociationsMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  createSubscriptionPayment!: Sequelize.HasManyCreateAssociationMixin<SubscriptionPayment>;
  removeSubscriptionPayment!: Sequelize.HasManyRemoveAssociationMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  removeSubscriptionPayments!: Sequelize.HasManyRemoveAssociationsMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  hasSubscriptionPayment!: Sequelize.HasManyHasAssociationMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  hasSubscriptionPayments!: Sequelize.HasManyHasAssociationsMixin<
    SubscriptionPayment,
    SubscriptionPaymentId
  >;
  countSubscriptionPayments!: Sequelize.HasManyCountAssociationsMixin;
  // Subscription hasMany UsageRecord via subscriptionId
  usageRecords!: UsageRecord[];
  getUsageRecords!: Sequelize.HasManyGetAssociationsMixin<UsageRecord>;
  setUsageRecords!: Sequelize.HasManySetAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  addUsageRecord!: Sequelize.HasManyAddAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  addUsageRecords!: Sequelize.HasManyAddAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  createUsageRecord!: Sequelize.HasManyCreateAssociationMixin<UsageRecord>;
  removeUsageRecord!: Sequelize.HasManyRemoveAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  removeUsageRecords!: Sequelize.HasManyRemoveAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  hasUsageRecord!: Sequelize.HasManyHasAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  hasUsageRecords!: Sequelize.HasManyHasAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  countUsageRecords!: Sequelize.HasManyCountAssociationsMixin;
  // Subscription belongsTo SubscriptionStatus via statusId
  status!: SubscriptionStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<SubscriptionStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    SubscriptionStatus,
    SubscriptionStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<SubscriptionStatus>;
  // Subscription belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Subscription {
    return Subscription.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        validityDay: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'validity_day',
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
        isTrial: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'is_trial',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'end_date',
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'start_date',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'subscription_status',
            key: 'id',
          },
          field: 'status_id',
        },
        discountCouponId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'discount_coupon_id',
        },
        extendedPlanId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'extended_plan_id',
        },
        extendedPlanStart: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'extended_plan_start',
        },
        paymentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'payment',
            key: 'id',
          },
          field: 'payment_id',
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
        tableName: 'subscription',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'subscription_plan_FK',
            using: 'BTREE',
            fields: [{ name: 'plan_id' }],
          },
          {
            name: 'subscription_plan_FK_1',
            using: 'BTREE',
            fields: [{ name: 'extended_plan_id' }],
          },
          {
            name: 'subscription_user_FK',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'subscription_subscription_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
          {
            name: 'subscription_payment_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'payment_id' }],
          },
        ],
      }
    );
  }
}
