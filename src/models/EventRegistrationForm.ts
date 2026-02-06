import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type {
  EventRegistrationRecord,
  EventRegistrationRecordId,
} from './EventRegistrationRecord';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';

export interface EventRegistrationFormAttributes {
  id: number;
  eventId?: number;
  participantTypeId?: number;
  name: string;
  metadata?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventRegistrationFormPk = 'id';
export type EventRegistrationFormId =
  EventRegistrationForm[EventRegistrationFormPk];
export type EventRegistrationFormOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'participantTypeId'
  | 'metadata'
  | 'createdOn'
  | 'modifiedOn';
export type EventRegistrationFormCreationAttributes = Optional<
  EventRegistrationFormAttributes,
  EventRegistrationFormOptionalAttributes
>;

export class EventRegistrationForm
  extends Model<
    EventRegistrationFormAttributes,
    EventRegistrationFormCreationAttributes
  >
  implements EventRegistrationFormAttributes
{
  id!: number;
  eventId?: number;
  participantTypeId?: number;
  name!: string;
  metadata?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventRegistrationForm belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventRegistrationForm hasMany EventRegistrationRecord via eventRegistrationFormId
  eventRegistrationRecords!: EventRegistrationRecord[];
  getEventRegistrationRecords!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationRecord>;
  setEventRegistrationRecords!: Sequelize.HasManySetAssociationsMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  addEventRegistrationRecord!: Sequelize.HasManyAddAssociationMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  addEventRegistrationRecords!: Sequelize.HasManyAddAssociationsMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  createEventRegistrationRecord!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationRecord>;
  removeEventRegistrationRecord!: Sequelize.HasManyRemoveAssociationMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  removeEventRegistrationRecords!: Sequelize.HasManyRemoveAssociationsMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  hasEventRegistrationRecord!: Sequelize.HasManyHasAssociationMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  hasEventRegistrationRecords!: Sequelize.HasManyHasAssociationsMixin<
    EventRegistrationRecord,
    EventRegistrationRecordId
  >;
  countEventRegistrationRecords!: Sequelize.HasManyCountAssociationsMixin;
  // EventRegistrationForm belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<
    ParticipantType,
    ParticipantTypeId
  >;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventRegistrationForm {
    return EventRegistrationForm.init(
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
        participantTypeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'participant_type',
            key: 'id',
          },
          field: 'participant_type_id',
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        metadata: {
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
        tableName: 'event_registration_form',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_registration_form_event_FK',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'event_registration_form_participant_type_FK',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
        ],
      }
    );
  }
}
