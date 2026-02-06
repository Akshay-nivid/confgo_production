import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Cart, CartId } from './Cart';
import type { Event, EventId } from './Event';
import type {
  EventParticipantEntry,
  EventParticipantEntryId,
} from './EventParticipantEntry';
import type { EventPriceTier, EventPriceTierId } from './EventPriceTier';
import type {
  EventRegistrationForm,
  EventRegistrationFormId,
} from './EventRegistrationForm';
import type { Order, OrderId } from './Order';
import type { Participant, ParticipantId } from './Participant';

export interface ParticipantTypeAttributes {
  id: number;
  name: string;
  eventId: number;
  description?: string;
  isContributor: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type ParticipantTypePk = 'id';
export type ParticipantTypeId = ParticipantType[ParticipantTypePk];
export type ParticipantTypeOptionalAttributes =
  | 'id'
  | 'description'
  | 'isContributor'
  | 'createdOn'
  | 'modifiedOn';
export type ParticipantTypeCreationAttributes = Optional<
  ParticipantTypeAttributes,
  ParticipantTypeOptionalAttributes
>;

export class ParticipantType
  extends Model<ParticipantTypeAttributes, ParticipantTypeCreationAttributes>
  implements ParticipantTypeAttributes
{
  id!: number;
  name!: string;
  eventId!: number;
  description?: string;
  isContributor!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // ParticipantType belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // ParticipantType hasMany Cart via participantTypeId
  carts!: Cart[];
  getCarts!: Sequelize.HasManyGetAssociationsMixin<Cart>;
  setCarts!: Sequelize.HasManySetAssociationsMixin<Cart, CartId>;
  addCart!: Sequelize.HasManyAddAssociationMixin<Cart, CartId>;
  addCarts!: Sequelize.HasManyAddAssociationsMixin<Cart, CartId>;
  createCart!: Sequelize.HasManyCreateAssociationMixin<Cart>;
  removeCart!: Sequelize.HasManyRemoveAssociationMixin<Cart, CartId>;
  removeCarts!: Sequelize.HasManyRemoveAssociationsMixin<Cart, CartId>;
  hasCart!: Sequelize.HasManyHasAssociationMixin<Cart, CartId>;
  hasCarts!: Sequelize.HasManyHasAssociationsMixin<Cart, CartId>;
  countCarts!: Sequelize.HasManyCountAssociationsMixin;
  // ParticipantType hasMany EventParticipantEntry via participantTypeId
  eventParticipantEntries!: EventParticipantEntry[];
  getEventParticipantEntries!: Sequelize.HasManyGetAssociationsMixin<EventParticipantEntry>;
  setEventParticipantEntries!: Sequelize.HasManySetAssociationsMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  addEventParticipantEntry!: Sequelize.HasManyAddAssociationMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  addEventParticipantEntries!: Sequelize.HasManyAddAssociationsMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  createEventParticipantEntry!: Sequelize.HasManyCreateAssociationMixin<EventParticipantEntry>;
  removeEventParticipantEntry!: Sequelize.HasManyRemoveAssociationMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  removeEventParticipantEntries!: Sequelize.HasManyRemoveAssociationsMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  hasEventParticipantEntry!: Sequelize.HasManyHasAssociationMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  hasEventParticipantEntries!: Sequelize.HasManyHasAssociationsMixin<
    EventParticipantEntry,
    EventParticipantEntryId
  >;
  countEventParticipantEntries!: Sequelize.HasManyCountAssociationsMixin;
  // ParticipantType hasMany EventPriceTier via participantTypeId
  eventPriceTiers!: EventPriceTier[];
  getEventPriceTiers!: Sequelize.HasManyGetAssociationsMixin<EventPriceTier>;
  setEventPriceTiers!: Sequelize.HasManySetAssociationsMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  addEventPriceTier!: Sequelize.HasManyAddAssociationMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  addEventPriceTiers!: Sequelize.HasManyAddAssociationsMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  createEventPriceTier!: Sequelize.HasManyCreateAssociationMixin<EventPriceTier>;
  removeEventPriceTier!: Sequelize.HasManyRemoveAssociationMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  removeEventPriceTiers!: Sequelize.HasManyRemoveAssociationsMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  hasEventPriceTier!: Sequelize.HasManyHasAssociationMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  hasEventPriceTiers!: Sequelize.HasManyHasAssociationsMixin<
    EventPriceTier,
    EventPriceTierId
  >;
  countEventPriceTiers!: Sequelize.HasManyCountAssociationsMixin;
  // ParticipantType hasMany EventRegistrationForm via participantTypeId
  eventRegistrationForms!: EventRegistrationForm[];
  getEventRegistrationForms!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationForm>;
  setEventRegistrationForms!: Sequelize.HasManySetAssociationsMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  addEventRegistrationForm!: Sequelize.HasManyAddAssociationMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  addEventRegistrationForms!: Sequelize.HasManyAddAssociationsMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  createEventRegistrationForm!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationForm>;
  removeEventRegistrationForm!: Sequelize.HasManyRemoveAssociationMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  removeEventRegistrationForms!: Sequelize.HasManyRemoveAssociationsMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  hasEventRegistrationForm!: Sequelize.HasManyHasAssociationMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  hasEventRegistrationForms!: Sequelize.HasManyHasAssociationsMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  countEventRegistrationForms!: Sequelize.HasManyCountAssociationsMixin;
  // ParticipantType hasMany Order via participantTypeId
  orders!: Order[];
  getOrders!: Sequelize.HasManyGetAssociationsMixin<Order>;
  setOrders!: Sequelize.HasManySetAssociationsMixin<Order, OrderId>;
  addOrder!: Sequelize.HasManyAddAssociationMixin<Order, OrderId>;
  addOrders!: Sequelize.HasManyAddAssociationsMixin<Order, OrderId>;
  createOrder!: Sequelize.HasManyCreateAssociationMixin<Order>;
  removeOrder!: Sequelize.HasManyRemoveAssociationMixin<Order, OrderId>;
  removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<Order, OrderId>;
  hasOrder!: Sequelize.HasManyHasAssociationMixin<Order, OrderId>;
  hasOrders!: Sequelize.HasManyHasAssociationsMixin<Order, OrderId>;
  countOrders!: Sequelize.HasManyCountAssociationsMixin;
  // ParticipantType hasMany Participant via participantTypeId
  participants!: Participant[];
  getParticipants!: Sequelize.HasManyGetAssociationsMixin<Participant>;
  setParticipants!: Sequelize.HasManySetAssociationsMixin<
    Participant,
    ParticipantId
  >;
  addParticipant!: Sequelize.HasManyAddAssociationMixin<
    Participant,
    ParticipantId
  >;
  addParticipants!: Sequelize.HasManyAddAssociationsMixin<
    Participant,
    ParticipantId
  >;
  createParticipant!: Sequelize.HasManyCreateAssociationMixin<Participant>;
  removeParticipant!: Sequelize.HasManyRemoveAssociationMixin<
    Participant,
    ParticipantId
  >;
  removeParticipants!: Sequelize.HasManyRemoveAssociationsMixin<
    Participant,
    ParticipantId
  >;
  hasParticipant!: Sequelize.HasManyHasAssociationMixin<
    Participant,
    ParticipantId
  >;
  hasParticipants!: Sequelize.HasManyHasAssociationsMixin<
    Participant,
    ParticipantId
  >;
  countParticipants!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ParticipantType {
    return ParticipantType.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
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
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isContributor: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'is_contributor',
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
        tableName: 'participant_type',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_id',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
        ],
      }
    );
  }
}
