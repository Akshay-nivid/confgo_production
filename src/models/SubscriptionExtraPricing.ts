import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ExtraPricing, ExtraPricingId } from './ExtraPricing';
import type { Subscription, SubscriptionId } from './Subscription';

export interface SubscriptionExtraPricingAttributes {
  id: number;
  subscriptionId?: number;
  extraPricingId?: number;
  quantity?: number;
  discountCouponId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type SubscriptionExtraPricingPk = 'id';
export type SubscriptionExtraPricingId =
  SubscriptionExtraPricing[SubscriptionExtraPricingPk];
export type SubscriptionExtraPricingOptionalAttributes =
  | 'id'
  | 'subscriptionId'
  | 'extraPricingId'
  | 'quantity'
  | 'discountCouponId'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type SubscriptionExtraPricingCreationAttributes = Optional<
  SubscriptionExtraPricingAttributes,
  SubscriptionExtraPricingOptionalAttributes
>;

export class SubscriptionExtraPricing
  extends Model<
    SubscriptionExtraPricingAttributes,
    SubscriptionExtraPricingCreationAttributes
  >
  implements SubscriptionExtraPricingAttributes
{
  id!: number;
  subscriptionId?: number;
  extraPricingId?: number;
  quantity?: number;
  discountCouponId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // SubscriptionExtraPricing belongsTo ExtraPricing via extraPricingId
  extraPricing!: ExtraPricing;
  getExtraPricing!: Sequelize.BelongsToGetAssociationMixin<ExtraPricing>;
  setExtraPricing!: Sequelize.BelongsToSetAssociationMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  createExtraPricing!: Sequelize.BelongsToCreateAssociationMixin<ExtraPricing>;
  // SubscriptionExtraPricing belongsTo Subscription via subscriptionId
  subscription!: Subscription;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<Subscription>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<Subscription>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof SubscriptionExtraPricing {
    return SubscriptionExtraPricing.init(
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
        extraPricingId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'extra_pricing',
            key: 'id',
          },
          field: 'extra_pricing_id',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        discountCouponId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'discount_coupon_id',
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
        tableName: 'subscription_extra_pricing',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'subscription_extra_pricing_subscription_FK',
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }],
          },
          {
            name: 'subscription_extra_pricing_extra_pricing_FK',
            using: 'BTREE',
            fields: [{ name: 'extra_pricing_id' }],
          },
        ],
      }
    );
  }
}
