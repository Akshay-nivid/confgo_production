import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Cart, CartId } from './Cart';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type {
  EventAddonProperty,
  EventAddonPropertyId,
} from './EventAddonProperty';

export interface CartItemAttributes {
  id: number;
  cartId: number;
  eventId?: number;
  eventAddonId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  eventAddonPropertyId?: number;
}

export type CartItemPk = 'id';
export type CartItemId = CartItem[CartItemPk];
export type CartItemOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'eventAddonId'
  | 'createdOn'
  | 'modifiedOn'
  | 'eventAddonPropertyId';
export type CartItemCreationAttributes = Optional<
  CartItemAttributes,
  CartItemOptionalAttributes
>;

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  id!: number;
  cartId!: number;
  eventId?: number;
  eventAddonId?: number;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  eventAddonPropertyId?: number;

  // CartItem belongsTo Cart via cartId
  cart!: Cart;
  getCart!: Sequelize.BelongsToGetAssociationMixin<Cart>;
  setCart!: Sequelize.BelongsToSetAssociationMixin<Cart, CartId>;
  createCart!: Sequelize.BelongsToCreateAssociationMixin<Cart>;
  // CartItem belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // CartItem belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // CartItem belongsTo EventAddonProperty via eventAddonPropertyId
  eventAddonProperty!: EventAddonProperty;
  getEventAddonProperty!: Sequelize.BelongsToGetAssociationMixin<EventAddonProperty>;
  setEventAddonProperty!: Sequelize.BelongsToSetAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  createEventAddonProperty!: Sequelize.BelongsToCreateAssociationMixin<EventAddonProperty>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CartItem {
    return CartItem.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        cartId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'cart',
            key: 'id',
          },
          field: 'cart_id',
        },
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'event_id',
        },
        eventAddonId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_addon',
            key: 'id',
          },
          field: 'event_addon_id',
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'unit_price',
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'total_price',
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
        eventAddonPropertyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_addon_property',
            key: 'id',
          },
          field: 'event_addon_property_id',
        },
      },
      {
        sequelize,
        tableName: 'cart_item',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'cart_ibfk_1_idx',
            using: 'BTREE',
            fields: [{ name: 'cart_id' }],
          },
          {
            name: '_ibfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'event_addon_ibfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_id' }],
          },
          {
            name: 'cart_item_event_addon_property_idFK_4_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_property_id' }],
          },
        ],
      }
    );
  }
}
