import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type { OrderItem, OrderItemId } from './OrderItem';
import type { OrderStatus, OrderStatusId } from './OrderStatus';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';
import type { Payment, PaymentId } from './Payment';
import type { SubscriptionPayment, SubscriptionPaymentId } from './SubscriptionPayment';
import type { User, UserId } from './User';

export interface OrderAttributes {
  id: number;
  companyId: number;
  userId: number;
  subTotal?: number;
  tax?: number;
  taxInclusive?: number;
  couponDeduction?: number;
  paymentStatus: string;
  statusId?: number;
  orderDate: Date;
  parentEventId?: number;
  discountAmount?: number;
  finalPrice: number;
  programTotalAmount?: number;
  addonTotalAmount?: number;
  priceTierDiscount?: number;
  participantTypeId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type OrderPk = "id";
export type OrderId = Order[OrderPk];
export type OrderOptionalAttributes = "id" | "subTotal" | "tax" | "taxInclusive" | "couponDeduction" | "statusId" | "orderDate" | "parentEventId" | "discountAmount" | "programTotalAmount" | "addonTotalAmount" | "priceTierDiscount" | "participantTypeId" | "createdOn" | "modifiedOn";
export type OrderCreationAttributes = Optional<OrderAttributes, OrderOptionalAttributes>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  id!: number;
  companyId!: number;
  userId!: number;
  subTotal?: number;
  tax?: number;
  taxInclusive?: number;
  couponDeduction?: number;
  paymentStatus!: string;
  statusId?: number;
  orderDate!: Date;
  parentEventId?: number;
  discountAmount?: number;
  finalPrice!: number;
  programTotalAmount?: number;
  addonTotalAmount?: number;
  priceTierDiscount?: number;
  participantTypeId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Order belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Order belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Order hasMany OrderItem via orderId
  orderItems!: OrderItem[];
  getOrderItems!: Sequelize.HasManyGetAssociationsMixin<OrderItem>;
  setOrderItems!: Sequelize.HasManySetAssociationsMixin<OrderItem, OrderItemId>;
  addOrderItem!: Sequelize.HasManyAddAssociationMixin<OrderItem, OrderItemId>;
  addOrderItems!: Sequelize.HasManyAddAssociationsMixin<OrderItem, OrderItemId>;
  createOrderItem!: Sequelize.HasManyCreateAssociationMixin<OrderItem>;
  removeOrderItem!: Sequelize.HasManyRemoveAssociationMixin<OrderItem, OrderItemId>;
  removeOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<OrderItem, OrderItemId>;
  hasOrderItem!: Sequelize.HasManyHasAssociationMixin<OrderItem, OrderItemId>;
  hasOrderItems!: Sequelize.HasManyHasAssociationsMixin<OrderItem, OrderItemId>;
  countOrderItems!: Sequelize.HasManyCountAssociationsMixin;
  // Order hasMany Payment via orderId
  payments!: Payment[];
  getPayments!: Sequelize.HasManyGetAssociationsMixin<Payment>;
  setPayments!: Sequelize.HasManySetAssociationsMixin<Payment, PaymentId>;
  addPayment!: Sequelize.HasManyAddAssociationMixin<Payment, PaymentId>;
  addPayments!: Sequelize.HasManyAddAssociationsMixin<Payment, PaymentId>;
  createPayment!: Sequelize.HasManyCreateAssociationMixin<Payment>;
  removePayment!: Sequelize.HasManyRemoveAssociationMixin<Payment, PaymentId>;
  removePayments!: Sequelize.HasManyRemoveAssociationsMixin<Payment, PaymentId>;
  hasPayment!: Sequelize.HasManyHasAssociationMixin<Payment, PaymentId>;
  hasPayments!: Sequelize.HasManyHasAssociationsMixin<Payment, PaymentId>;
  countPayments!: Sequelize.HasManyCountAssociationsMixin;
  // Order hasMany SubscriptionPayment via orderId
  subscriptionPayments!: SubscriptionPayment[];
  getSubscriptionPayments!: Sequelize.HasManyGetAssociationsMixin<SubscriptionPayment>;
  setSubscriptionPayments!: Sequelize.HasManySetAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  addSubscriptionPayment!: Sequelize.HasManyAddAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  addSubscriptionPayments!: Sequelize.HasManyAddAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  createSubscriptionPayment!: Sequelize.HasManyCreateAssociationMixin<SubscriptionPayment>;
  removeSubscriptionPayment!: Sequelize.HasManyRemoveAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  removeSubscriptionPayments!: Sequelize.HasManyRemoveAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  hasSubscriptionPayment!: Sequelize.HasManyHasAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  hasSubscriptionPayments!: Sequelize.HasManyHasAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  countSubscriptionPayments!: Sequelize.HasManyCountAssociationsMixin;
  // Order belongsTo OrderStatus via statusId
  status!: OrderStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<OrderStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<OrderStatus, OrderStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<OrderStatus>;
  // Order belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<ParticipantType, ParticipantTypeId>;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;
  // Order belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Order {
    return Order.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      },
      field: 'company_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    subTotal: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'sub_total'
    },
    tax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    taxInclusive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    couponDeduction: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'coupon_deduction'
    },
    paymentStatus: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'payment_status'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'order_status',
        key: 'id'
      },
      field: 'status_id'
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'order_date'
    },
    parentEventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'parent_event_id'
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'discount_amount'
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'final_price'
    },
    programTotalAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'program_total_amount'
    },
    addonTotalAmount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'addon_total_amount'
    },
    priceTierDiscount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
      field: 'price_tier_discount'
    },
    participantTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'participant_type',
        key: 'id'
      },
      field: 'participant_type_id'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by'
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_on'
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    }
  }, {
    sequelize,
    tableName: 'order',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "order_status_id_FK_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "company_id",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "parent_event_id",
        using: "BTREE",
        fields: [
          { name: "parent_event_id" },
        ]
      },
      {
        name: "order_participant_idfk_1_idx",
        using: "BTREE",
        fields: [
          { name: "participant_type_id" },
        ]
      },
    ]
  });
  }
}
