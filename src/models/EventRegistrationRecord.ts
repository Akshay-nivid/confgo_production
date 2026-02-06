import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type {
  EventRegistrationForm,
  EventRegistrationFormId,
} from './EventRegistrationForm';
import type { Participant, ParticipantId } from './Participant';
import type { User, UserId } from './User';

export interface EventRegistrationRecordAttributes {
  id: number;
  eventId?: number;
  participantId?: number;
  userId: number;
  eventRegistrationFormId?: number;
  response?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventRegistrationRecordPk = 'id';
export type EventRegistrationRecordId =
  EventRegistrationRecord[EventRegistrationRecordPk];
export type EventRegistrationRecordOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'participantId'
  | 'eventRegistrationFormId'
  | 'response'
  | 'createdOn'
  | 'modifiedOn';
export type EventRegistrationRecordCreationAttributes = Optional<
  EventRegistrationRecordAttributes,
  EventRegistrationRecordOptionalAttributes
>;

export class EventRegistrationRecord
  extends Model<
    EventRegistrationRecordAttributes,
    EventRegistrationRecordCreationAttributes
  >
  implements EventRegistrationRecordAttributes
{
  id!: number;
  eventId?: number;
  participantId?: number;
  userId!: number;
  eventRegistrationFormId?: number;
  response?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventRegistrationRecord belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventRegistrationRecord belongsTo EventRegistrationForm via eventRegistrationFormId
  eventRegistrationForm!: EventRegistrationForm;
  getEventRegistrationForm!: Sequelize.BelongsToGetAssociationMixin<EventRegistrationForm>;
  setEventRegistrationForm!: Sequelize.BelongsToSetAssociationMixin<
    EventRegistrationForm,
    EventRegistrationFormId
  >;
  createEventRegistrationForm!: Sequelize.BelongsToCreateAssociationMixin<EventRegistrationForm>;
  // EventRegistrationRecord belongsTo Participant via participantId
  participant!: Participant;
  getParticipant!: Sequelize.BelongsToGetAssociationMixin<Participant>;
  setParticipant!: Sequelize.BelongsToSetAssociationMixin<
    Participant,
    ParticipantId
  >;
  createParticipant!: Sequelize.BelongsToCreateAssociationMixin<Participant>;
  // EventRegistrationRecord belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventRegistrationRecord {
    return EventRegistrationRecord.init(
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
          allowNull: true,
          references: {
            model: 'participant',
            key: 'id',
          },
          field: 'participant_id',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        eventRegistrationFormId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_registration_form',
            key: 'id',
          },
          field: 'event_registration_form_id',
        },
        response: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: 'event_registration_record',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_registration_response_event_registration_form_FK',
            using: 'BTREE',
            fields: [{ name: 'event_registration_form_id' }],
          },
          {
            name: 'event_registration_response_participant_FK',
            using: 'BTREE',
            fields: [{ name: 'participant_id' }],
          },
          {
            name: 'event_registration_response_event_FK',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'event_registration_record_ibfk_229',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
