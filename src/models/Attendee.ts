import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type {
  EventAddonProperty,
  EventAddonPropertyId,
} from './EventAddonProperty';
import type { Participant, ParticipantId } from './Participant';

export interface AttendeeAttributes {
  id: number;
  participantId: number;
  parentEventId: number;
  eventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  scanDate: string;
  scannedBy: number;
  scanTime: string;
  isDeleted: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type AttendeePk = 'id';
export type AttendeeId = Attendee[AttendeePk];
export type AttendeeOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'eventAddonId'
  | 'eventAddonPropertyId'
  | 'isDeleted'
  | 'createdOn'
  | 'modifiedOn';
export type AttendeeCreationAttributes = Optional<
  AttendeeAttributes,
  AttendeeOptionalAttributes
>;

export class Attendee
  extends Model<AttendeeAttributes, AttendeeCreationAttributes>
  implements AttendeeAttributes
{
  id!: number;
  participantId!: number;
  parentEventId!: number;
  eventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  scanDate!: string;
  scannedBy!: number;
  scanTime!: string;
  isDeleted!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Attendee belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Attendee belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Attendee belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // Attendee belongsTo EventAddonProperty via eventAddonPropertyId
  eventAddonProperty!: EventAddonProperty;
  getEventAddonProperty!: Sequelize.BelongsToGetAssociationMixin<EventAddonProperty>;
  setEventAddonProperty!: Sequelize.BelongsToSetAssociationMixin<
    EventAddonProperty,
    EventAddonPropertyId
  >;
  createEventAddonProperty!: Sequelize.BelongsToCreateAssociationMixin<EventAddonProperty>;
  // Attendee belongsTo Participant via participantId
  participant!: Participant;
  getParticipant!: Sequelize.BelongsToGetAssociationMixin<Participant>;
  setParticipant!: Sequelize.BelongsToSetAssociationMixin<
    Participant,
    ParticipantId
  >;
  createParticipant!: Sequelize.BelongsToCreateAssociationMixin<Participant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Attendee {
    return Attendee.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        parentEventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'parent_event_id',
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
        scanDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'scan_date',
        },
        scannedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'scanned_by',
        },
        scanTime: {
          type: DataTypes.TIME,
          allowNull: false,
          field: 'scan_time',
        },
        isDeleted: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'is_deleted',
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
        tableName: 'attendee',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'attendee_event_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'participant_id',
            using: 'BTREE',
            fields: [{ name: 'participant_id' }],
          },
          {
            name: 'attendee_event_addon_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_id' }],
          },
          {
            name: 'attendee_event_addon_property_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_addon_property_id' }],
          },
          {
            name: 'attendee_parent_event_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'parent_event_id' }],
          },
        ],
      }
    );
  }
}
