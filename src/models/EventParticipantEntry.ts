import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';

export interface EventParticipantEntryAttributes {
  id: number;
  totalSeat: number;
  seatAllocated: number;
  participantTypeId?: number;
  eventId: number;
  parentEventId: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventParticipantEntryPk = 'id';
export type EventParticipantEntryId =
  EventParticipantEntry[EventParticipantEntryPk];
export type EventParticipantEntryOptionalAttributes =
  | 'id'
  | 'participantTypeId'
  | 'createdOn'
  | 'modifiedOn';
export type EventParticipantEntryCreationAttributes = Optional<
  EventParticipantEntryAttributes,
  EventParticipantEntryOptionalAttributes
>;

export class EventParticipantEntry
  extends Model<
    EventParticipantEntryAttributes,
    EventParticipantEntryCreationAttributes
  >
  implements EventParticipantEntryAttributes
{
  id!: number;
  totalSeat!: number;
  seatAllocated!: number;
  participantTypeId?: number;
  eventId!: number;
  parentEventId!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventParticipantEntry belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventParticipantEntry belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventParticipantEntry belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<
    ParticipantType,
    ParticipantTypeId
  >;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventParticipantEntry {
    return EventParticipantEntry.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        totalSeat: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'total_seat',
        },
        seatAllocated: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'seat_allocated',
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
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'event_id',
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
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'event_participant_entry',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'id_idx',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
          {
            name: 'event_idFK_2_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'parent_event_idFK_3_idx',
            using: 'BTREE',
            fields: [{ name: 'parent_event_id' }],
          },
          {
            name: 'participant_type_idFK_1',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
          {
            name: 'event_idFK_2',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'parent_event_idFK_3',
            using: 'BTREE',
            fields: [{ name: 'parent_event_id' }],
          },
        ],
      }
    );
  }
}
