import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Payment, PaymentId } from './Payment';
import type {
  SubscriptionPayment,
  SubscriptionPaymentId,
} from './SubscriptionPayment';

export interface PaymentMethodAttributes {
  id: number;
  code: string;
  handler: string;
  enabled: number;
  name: string;
  description?: string;
  logoUrl?: string;
  minAmount?: number;
  maxAmount?: number;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;
}

export type PaymentMethodPk = 'id';
export type PaymentMethodId = PaymentMethod[PaymentMethodPk];
export type PaymentMethodOptionalAttributes =
  | 'id'
  | 'description'
  | 'logoUrl'
  | 'minAmount'
  | 'maxAmount'
  | 'createdOn'
  | 'createdBy'
  | 'modifiedOn'
  | 'modifiedBy';
export type PaymentMethodCreationAttributes = Optional<
  PaymentMethodAttributes,
  PaymentMethodOptionalAttributes
>;

export class PaymentMethod
  extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes>
  implements PaymentMethodAttributes
{
  id!: number;
  code!: string;
  handler!: string;
  enabled!: number;
  name!: string;
  description?: string;
  logoUrl?: string;
  minAmount?: number;
  maxAmount?: number;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;

  // PaymentMethod hasMany Payment via paymentMethodId
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
  // PaymentMethod hasMany SubscriptionPayment via paymentMethodId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof PaymentMethod {
    return PaymentMethod.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        handler: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        logoUrl: {
          type: DataTypes.STRING(45),
          allowNull: true,
          field: 'logo_url',
        },
        minAmount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'min_amount',
        },
        maxAmount: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'max_amount',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'created_on',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'created_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'modified_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'modified_by',
        },
      },
      {
        sequelize,
        tableName: 'payment_method',
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
