import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Addon, AddonId } from './Addon';
import type { Attendee, AttendeeId } from './Attendee';
import type { CartItem, CartItemId } from './CartItem';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type {
  EventAddonProperty,
  EventAddonPropertyId,
} from './EventAddonProperty';
import type { EventAddonStatus, EventAddonStatusId } from './EventAddonStatus';
import type { EventParticipant, EventParticipantId } from './EventParticipant';
import type { EventSponsor, EventSponsorId } from './EventSponsor';
import type { OrderItem, OrderItemId } from './OrderItem';

export interface EventAddonAttributes {
  id: number;
  eventId: number;
  addonId: number;
  companyId: number;
  amount: number;
  tier?: string;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  statusId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type EventAddonPk = 'id';
export type EventAddonId = EventAddon[EventAddonPk];
export type EventAddonOptionalAttributes =
  | 'id'
  | 'amount'
  | 'tier'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'statusId'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type EventAddonCreationAttributes = Optional<
  EventAddonAttributes,
  EventAddonOptionalAttributes
>;

export class EventAddon
  extends Model<EventAddonAttributes, EventAddonCreationAttributes>
  implements EventAddonAttributes
{
  id!: number;
  eventId!: number;
  addonId!: number;
  companyId!: number;
  amount!: number;
  tier?: string;
  startTime?: Date;
  endTime?: Date;
  description?: string;
  statusId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // EventAddon belongsTo Addon via addonId
  addon!: Addon;
  getAddon!: Sequelize.BelongsToGetAssociationMixin<Addon>;
  setAddon!: Sequelize.BelongsToSetAssociationMixin<Addon, AddonId>;
  createAddon!: Sequelize.BelongsToCreateAssociationMixin<Addon>;
  // EventAddon belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // EventAddon belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventAddon hasMany Attendee via eventAddonId
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
  // EventAddon hasMany CartItem via eventAddonId
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
  // EventAddon hasMany EventAddonProperty via eventAddonId
  eventAddonProperties!: EventAddonProperty[];
  getEventAddonProperties!: Sequelize.HasManyGetAssociationsMixin<EventAddonProperty>;
  setEventAddonProperties!: Sequelize.HasManySetAssociationsMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  addEventAddonProperty!: Sequelize.HasManyAddAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  addEventAddonProperties!: Sequelize.HasManyAddAssociationsMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  createEventAddonProperty!: Sequelize.HasManyCreateAssociationMixin<EventAddonProperty>;
  removeEventAddonProperty!: Sequelize.HasManyRemoveAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  removeEventAddonProperties!: Sequelize.HasManyRemoveAssociationsMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  hasEventAddonProperty!: Sequelize.HasManyHasAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  hasEventAddonProperties!: Sequelize.HasManyHasAssociationsMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  countEventAddonProperties!: Sequelize.HasManyCountAssociationsMixin;
  // EventAddon hasMany EventParticipant via eventAddonId
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
  // EventAddon hasMany EventSponsor via eventAddonId
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
  // EventAddon hasMany OrderItem via eventAddonId
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
  // EventAddon belongsTo EventAddonStatus via statusId
  status!: EventAddonStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<EventAddonStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    EventAddonStatus,
    EventAddonStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<EventAddonStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventAddon {
    return EventAddon.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        addonId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'addon',
            key: 'id',
          },
          field: 'addon_id',
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
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        tier: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'start_time',
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'end_time',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_addon_status',
            key: 'id',
          },
          field: 'status_id',
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
        tableName: 'event_addon',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_addon_company_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'event_addon_event_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'event_addon_addon_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'addon_id' }],
          },
          {
            name: 'event_addon_event_addon_status_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
