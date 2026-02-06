import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type {
  EventAddonProperty,
  EventAddonPropertyId,
} from './EventAddonProperty';
import type { Participant, ParticipantId } from './Participant';

export interface EventParticipantAttributes {
  id: number;
  eventId?: number;
  participantId: number;
  roleName?: string;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventParticipantPk = 'id';
export type EventParticipantId = EventParticipant[EventParticipantPk];
export type EventParticipantOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'roleName'
  | 'eventAddonId'
  | 'eventAddonPropertyId'
  | 'createdOn'
  | 'modifiedOn';
export type EventParticipantCreationAttributes = Optional<
  EventParticipantAttributes,
  EventParticipantOptionalAttributes
>;

export class EventParticipant
  extends Model<EventParticipantAttributes, EventParticipantCreationAttributes>
  implements EventParticipantAttributes
{
  id!: number;
  eventId?: number;
  participantId!: number;
  roleName?: string;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventParticipant belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventParticipant belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // EventParticipant belongsTo EventAddonProperty via eventAddonPropertyId
  eventAddonProperty!: EventAddonProperty;
  getEventAddonProperty!: Sequelize.BelongsToGetAssociationMixin<EventAddonProperty>;
  setEventAddonProperty!: Sequelize.BelongsToSetAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  createEventAddonProperty!: Sequelize.BelongsToCreateAssociationMixin<EventAddonProperty>;
  // EventParticipant belongsTo Participant via participantId
  participant!: Participant;
  getParticipant!: Sequelize.BelongsToGetAssociationMixin<Participant>;
  setParticipant!: Sequelize.BelongsToSetAssociationMixin<
    Participant,
    ParticipantId
  >;
  createParticipant!: Sequelize.BelongsToCreateAssociationMixin<Participant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventParticipant {
    return EventParticipant.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        participantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'participant',
            key: 'id',
          },
          field: 'participant_id',
        },
        roleName: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'role_name',
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
        tableName: 'event_participant',
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
          {
            name: 'participant_id',
            using: 'BTREE',
            fields: [{ name: 'participant_id' }],
          },
          {
            name: 'event_participant_event_addon_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_id' }],
          },
          {
            name: 'event_participant_event_addon_property_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_property_id' }],
          },
        ],
      }
    );
  }
}
