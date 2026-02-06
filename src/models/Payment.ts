import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type { Order, OrderId } from './Order';
import type { PaymentMethod, PaymentMethodId } from './PaymentMethod';
import type { Subscription, SubscriptionId } from './Subscription';
import type { User, UserId } from './User';

export interface PaymentAttributes {
  id: number;
  paymentMethodId: number;
  companyId: number;
  eventId: number;
  userId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount: number;
  paymentReferenceNumber?: string;
  orderId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type PaymentPk = 'id';
export type PaymentId = Payment[PaymentPk];
export type PaymentOptionalAttributes =
  | 'id'
  | 'errorMessage'
  | 'transactionId'
  | 'metadata'
  | 'paymentReferenceNumber'
  | 'orderId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedOn';
export type PaymentCreationAttributes = Optional<
  PaymentAttributes,
  PaymentOptionalAttributes
>;

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  id!: number;
  paymentMethodId!: number;
  companyId!: number;
  eventId!: number;
  userId!: number;
  state!: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount!: number;
  paymentReferenceNumber?: string;
  orderId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Payment belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Payment belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Payment belongsTo Order via orderId
  order!: Order;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<Order>;
  // Payment hasMany Subscription via paymentId
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
  // Payment belongsTo PaymentMethod via paymentMethodId
  paymentMethod!: PaymentMethod;
  getPaymentMethod!: Sequelize.BelongsToGetAssociationMixin<PaymentMethod>;
  setPaymentMethod!: Sequelize.BelongsToSetAssociationMixin<
    PaymentMethod,
    PaymentMethodId
  >;
  createPaymentMethod!: Sequelize.BelongsToCreateAssociationMixin<PaymentMethod>;
  // Payment belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Payment {
    return Payment.init(
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
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'company',
            key: 'id',
          },
          field: 'company_id',
        },
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'event_id',
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
        paymentReferenceNumber: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'payment_reference_number',
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
        tableName: 'payment',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'payment_ibfk_17_idx',
            using: 'BTREE',
            fields: [{ name: 'payment_method_id' }],
          },
          {
            name: 'payment_order_idfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'order_id' }],
          },
          {
            name: 'user_idfk_3_idx',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'company_idfk_4_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'event_idfk_5_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
        ],
      }
    );
  }
}
