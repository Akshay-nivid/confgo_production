import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type {
  EventAddonProperty,
  EventAddonPropertyId,
} from './EventAddonProperty';
import type { Order, OrderId } from './Order';

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  eventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type OrderItemPk = 'id';
export type OrderItemId = OrderItem[OrderItemPk];
export type OrderItemOptionalAttributes =
  | 'id'
  | 'discountAmount'
  | 'eventId'
  | 'eventAddonId'
  | 'eventAddonPropertyId'
  | 'createdOn'
  | 'modifiedOn';
export type OrderItemCreationAttributes = Optional<
  OrderItemAttributes,
  OrderItemOptionalAttributes
>;

export class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  id!: number;
  orderId!: number;
  quantity!: number;
  unitPrice!: number;
  totalPrice!: number;
  discountAmount?: number;
  finalPrice!: number;
  eventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // OrderItem belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // OrderItem belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // OrderItem belongsTo EventAddonProperty via eventAddonPropertyId
  eventAddonProperty!: EventAddonProperty;
  getEventAddonProperty!: Sequelize.BelongsToGetAssociationMixin<EventAddonProperty>;
  setEventAddonProperty!: Sequelize.BelongsToSetAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  createEventAddonProperty!: Sequelize.BelongsToCreateAssociationMixin<EventAddonProperty>;
  // OrderItem belongsTo Order via orderId
  order!: Order;
  getOrder!: Sequelize.BelongsToGetAssociationMixin<Order>;
  setOrder!: Sequelize.BelongsToSetAssociationMixin<Order, OrderId>;
  createOrder!: Sequelize.BelongsToCreateAssociationMixin<Order>;

  static initModel(sequelize: Sequelize.Sequelize): typeof OrderItem {
    return OrderItem.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'order',
            key: 'id',
          },
          field: 'order_id',
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
        discountAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'discount_amount',
        },
        finalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'final_price',
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
        eventAddonPropertyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_addon_property',
            key: 'id',
          },
          field: 'event_addon_property_id',
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
        tableName: 'order_item',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'order_id',
            using: 'BTREE',
            fields: [{ name: 'order_id' }],
          },
          {
            name: 'event_id',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'order_item_event_addon_FK',
            using: 'BTREE',
            fields: [{ name: 'event_addon_id' }],
          },
          {
            name: 'order_item_event_addon_property_FK',
            using: 'BTREE',
            fields: [{ name: 'event_addon_property_id' }],
          },
        ],
      }
    );
  }
}
