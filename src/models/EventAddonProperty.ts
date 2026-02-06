import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Attendee, AttendeeId } from './Attendee';
import type { CartItem, CartItemId } from './CartItem';
import type { EventAddon, EventAddonId } from './EventAddon';
import type { EventParticipant, EventParticipantId } from './EventParticipant';
import type { EventSponsor, EventSponsorId } from './EventSponsor';
import type { OrderItem, OrderItemId } from './OrderItem';

export interface EventAddonPropertyAttributes {
  id: number;
  name: string;
  amount: number;
  eventAddonId: number;
  description?: string;
  enabled?: number;
  assetId?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type EventAddonPropertyPk = 'id';
export type EventAddonPropertyId = EventAddonProperty[EventAddonPropertyPk];
export type EventAddonPropertyOptionalAttributes =
  | 'id'
  | 'description'
  | 'enabled'
  | 'assetId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type EventAddonPropertyCreationAttributes = Optional<
  EventAddonPropertyAttributes,
  EventAddonPropertyOptionalAttributes
>;

export class EventAddonProperty
  extends Model<
    EventAddonPropertyAttributes,
    EventAddonPropertyCreationAttributes
  >
  implements EventAddonPropertyAttributes
{
  id!: number;
  name!: string;
  amount!: number;
  eventAddonId!: number;
  description?: string;
  enabled?: number;
  assetId?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // EventAddonProperty belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // EventAddonProperty belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // EventAddonProperty hasMany Attendee via eventAddonPropertyId
  attendees!: Attendee[];
  getAttendees!: Sequelize.HasManyGetAssociationsMixin<Attendee>;
  setAttendees!: Sequelize.HasManySetAssociationsMixin<Attendee, AttendeeId>;
  addAttendee!: Sequelize.HasManyAddAssociationMixin<Attendee, AttendeeId>;
  addAttendees!: Sequelize.HasManyAddAssociationsMixin<Attendee, AttendeeId>;
  createAttendee!: Sequelize.HasManyCreateAssociationMixin<Attendee>;
  removeAttendee!: Sequelize.HasManyRemoveAssociationMixin<
    Attendee,
    AttendeeId
  >;
  removeAttendees!: Sequelize.HasManyRemoveAssociationsMixin<
    Attendee,
    AttendeeId
  >;
  hasAttendee!: Sequelize.HasManyHasAssociationMixin<Attendee, AttendeeId>;
  hasAttendees!: Sequelize.HasManyHasAssociationsMixin<Attendee, AttendeeId>;
  countAttendees!: Sequelize.HasManyCountAssociationsMixin;
  // EventAddonProperty hasMany CartItem via eventAddonPropertyId
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
  // EventAddonProperty hasMany EventParticipant via eventAddonPropertyId
  eventParticipants!: EventParticipant[];
  getEventParticipants!: Sequelize.HasManyGetAssociationsMixin<EventParticipant>;
  setEventParticipants!: Sequelize.HasManySetAssociationsMixin<
    EventParticipant,
    EventParticipantId
  >;
  addEventParticipant!: Sequelize.HasManyAddAssociationMixin<
    EventParticipant,
    EventParticipantId
  >;
  addEventParticipants!: Sequelize.HasManyAddAssociationsMixin<
    EventParticipant,
    EventParticipantId
  >;
  createEventParticipant!: Sequelize.HasManyCreateAssociationMixin<EventParticipant>;
  removeEventParticipant!: Sequelize.HasManyRemoveAssociationMixin<
    EventParticipant,
    EventParticipantId
  >;
  removeEventParticipants!: Sequelize.HasManyRemoveAssociationsMixin<
    EventParticipant,
    EventParticipantId
  >;
  hasEventParticipant!: Sequelize.HasManyHasAssociationMixin<
    EventParticipant,
    EventParticipantId
  >;
  hasEventParticipants!: Sequelize.HasManyHasAssociationsMixin<
    EventParticipant,
    EventParticipantId
  >;
  countEventParticipants!: Sequelize.HasManyCountAssociationsMixin;
  // EventAddonProperty hasMany EventSponsor via eventAddonPropertyId
  eventSponsors!: EventSponsor[];
  getEventSponsors!: Sequelize.HasManyGetAssociationsMixin<EventSponsor>;
  setEventSponsors!: Sequelize.HasManySetAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  addEventSponsor!: Sequelize.HasManyAddAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  addEventSponsors!: Sequelize.HasManyAddAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  createEventSponsor!: Sequelize.HasManyCreateAssociationMixin<EventSponsor>;
  removeEventSponsor!: Sequelize.HasManyRemoveAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  removeEventSponsors!: Sequelize.HasManyRemoveAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  hasEventSponsor!: Sequelize.HasManyHasAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  hasEventSponsors!: Sequelize.HasManyHasAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  countEventSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // EventAddonProperty hasMany OrderItem via eventAddonPropertyId
  orderItems!: OrderItem[];
  getOrderItems!: Sequelize.HasManyGetAssociationsMixin<OrderItem>;
  setOrderItems!: Sequelize.HasManySetAssociationsMixin<OrderItem, OrderItemId>;
  addOrderItem!: Sequelize.HasManyAddAssociationMixin<OrderItem, OrderItemId>;
  addOrderItems!: Sequelize.HasManyAddAssociationsMixin<OrderItem, OrderItemId>;
  createOrderItem!: Sequelize.HasManyCreateAssociationMixin<OrderItem>;
  removeOrderItem!: Sequelize.HasManyRemoveAssociationMixin<
    OrderItem,
    OrderItemId
  >;
  removeOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<
    OrderItem,
    OrderItemId
  >;
  hasOrderItem!: Sequelize.HasManyHasAssociationMixin<OrderItem, OrderItemId>;
  hasOrderItems!: Sequelize.HasManyHasAssociationsMixin<OrderItem, OrderItemId>;
  countOrderItems!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventAddonProperty {
    return EventAddonProperty.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        eventAddonId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event_addon',
            key: 'id',
          },
          field: 'event_addon_id',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        enabled: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        assetId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          references: {
            model: 'asset',
            key: 'id',
          },
          field: 'asset_id',
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
        tableName: 'event_addon_property',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'addon_property_event_addon_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_id' }],
          },
          {
            name: 'event_addon_property_asset_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
        ],
      }
    );
  }
}
