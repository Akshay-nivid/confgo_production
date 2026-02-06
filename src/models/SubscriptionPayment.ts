import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Order, OrderId } from './Order';
import type { PaymentMethod, PaymentMethodId } from './PaymentMethod';
import type { Subscription, SubscriptionId } from './Subscription';
import type { User, UserId } from './User';

export interface SubscriptionPaymentAttributes {
  id: number;
  paymentMethodId: number;
  subscriptionId: number;
  userId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  orderId?: number;
  paymentReferenceNumber?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type SubscriptionPaymentPk = 'id';
export type SubscriptionPaymentId = SubscriptionPayment[SubscriptionPaymentPk];
export type SubscriptionPaymentOptionalAttributes =
  | 'id'
  | 'errorMessage'
  | 'transactionId'
  | 'metadata'
  | 'discountAmount'
  | 'orderId'
  | 'paymentReferenceNumber'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedOn';
export type SubscriptionPaymentCreationAttributes = Optional<
  SubscriptionPaymentAttributes,
  SubscriptionPaymentOptionalAttributes
>;

export class SubscriptionPayment
  extends Model<
    SubscriptionPaymentAttributes,
    SubscriptionPaymentCreationAttributes
  >
  implements SubscriptionPaymentAttributes
{
  id!: number;
  paymentMethodId!: number;
  subscriptionId!: number;
  userId!: number;
  state!: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount!: number;
  discountAmount!: number;
  finalAmount!: number;
  orderId?: number;
  paymentReferenceNumber?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // SubscriptionPayment belongsTo Order via orderId
  order!: Order;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<Order>;
  // SubscriptionPayment belongsTo PaymentMethod via paymentMethodId
  paymentMethod!: PaymentMethod;
  getPaymentMethod!: Sequelize.BelongsToGetAssociationMixin<PaymentMethod>;
  setPaymentMethod!: Sequelize.BelongsToSetAssociationMixin<
    PaymentMethod,
    PaymentMethodId
  >;
  createPaymentMethod!: Sequelize.BelongsToCreateAssociationMixin<PaymentMethod>;
  // SubscriptionPayment belongsTo Subscription via subscriptionId
  subscription!: Subscription;
  getSubscription!: Sequelize.BelongsToGetAssociationMixin<Subscription>;
  setSubscription!: Sequelize.BelongsToSetAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  createSubscription!: Sequelize.BelongsToCreateAssociationMixin<Subscription>;
  // SubscriptionPayment belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof SubscriptionPayment {
    return SubscriptionPayment.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        paymentMethodId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'payment_method',
            key: 'id',
          },
          field: 'payment_method_id',
        },
        subscriptionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'subscription',
            key: 'id',
          },
          field: 'subscription_id',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        state: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        errorMessage: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'error_message',
        },
        transactionId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'transaction_id',
        },
        metadata: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        discountAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
          field: 'discount_amount',
        },
        finalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'final_amount',
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'order',
            key: 'id',
          },
          field: 'order_id',
        },
        paymentReferenceNumber: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'payment_reference_number',
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
          allowNull: false,
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
        tableName: 'subscription_payment',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'payment_method_idfk_1_idx',
            using: 'BTREE',
            fields: [{ name: 'payment_method_id' }],
          },
          {
            name: 'subscription_idfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'subscription_id' }],
          },
          {
            name: 'user_idfk_3_idx',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'order_idfk_4_idx',
            using: 'BTREE',
            fields: [{ name: 'order_id' }],
          },
        ],
      }
    );
  }
}
