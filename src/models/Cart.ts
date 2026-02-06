import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CartItem, CartItemId } from './CartItem';
import type { CartStatus, CartStatusId } from './CartStatus';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';
import type { User, UserId } from './User';

export interface CartAttributes {
  id: number;
  parentEventId?: number;
  companyId: number;
  userId?: number;
  sessionId?: string;
  statusId: number;
  priceTierDiscount: number;
  finalPrice: number;
  participantTypeId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type CartPk = 'id';
export type CartId = Cart[CartPk];
export type CartOptionalAttributes =
  | 'id'
  | 'parentEventId'
  | 'userId'
  | 'sessionId'
  | 'priceTierDiscount'
  | 'participantTypeId'
  | 'createdOn'
  | 'modifiedOn';
export type CartCreationAttributes = Optional<
  CartAttributes,
  CartOptionalAttributes
>;

export class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  id!: number;
  parentEventId?: number;
  companyId!: number;
  userId?: number;
  sessionId?: string;
  statusId!: number;
  priceTierDiscount!: number;
  finalPrice!: number;
  participantTypeId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Cart hasMany CartItem via cartId
  cartItems!: CartItem[];
  getCartItems!: Sequelize.HasManyGetAssociationsMixin<CartItem>;
  setCartItems!: Sequelize.HasManySetAssociationsMixin<CartItem, CartItemId>;
  addCartItem!: Sequelize.HasManyAddAssociationMixin<CartItem, CartItemId>;
  addCartItems!: Sequelize.HasManyAddAssociationsMixin<CartItem, CartItemId>;
  createCartItem!: Sequelize.HasManyCreateAssociationMixin<CartItem>;
  removeCartItem!: Sequelize.HasManyRemoveAssociationMixin<
    CartItem,
    CartItemId
  >;
  removeCartItems!: Sequelize.HasManyRemoveAssociationsMixin<
    CartItem,
    CartItemId
  >;
  hasCartItem!: Sequelize.HasManyHasAssociationMixin<CartItem, CartItemId>;
  hasCartItems!: Sequelize.HasManyHasAssociationsMixin<CartItem, CartItemId>;
  countCartItems!: Sequelize.HasManyCountAssociationsMixin;
  // Cart belongsTo CartStatus via statusId
  status!: CartStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<CartStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<CartStatus, CartStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<CartStatus>;
  // Cart belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Cart belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Cart belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<
    ParticipantType,
    ParticipantTypeId
  >;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;
  // Cart belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Cart {
    return Cart.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        parentEventId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'parent_event_id',
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
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        sessionId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'session_id',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'cart_status',
            key: 'id',
          },
          field: 'status_id',
        },
        priceTierDiscount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
          field: 'price_tier_discount',
        },
        finalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'final_price',
        },
        participantTypeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'participant_type',
            key: 'id',
          },
          field: 'participant_type_id',
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
        tableName: 'cart',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_id_ibfk_1_idx',
            using: 'BTREE',
            fields: [{ name: 'parent_event_id' }],
          },
          {
            name: '_ibfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'user_ibfk_3_idx',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'status_idfk_4_idx',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
          {
            name: 'cart_participant_idfk_1_idx',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
        ],
      }
    );
  }
}
