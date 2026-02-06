import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Attendee, AttendeeId } from './Attendee';
import type { Event, EventId } from './Event';
import type { EventParticipant, EventParticipantId } from './EventParticipant';
import type {
  EventRegistrationRecord,
  EventRegistrationRecordId,
} from './EventRegistrationRecord';
import type { ParticipantGroup, ParticipantGroupId } from './ParticipantGroup';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';
import type { User, UserId } from './User';

export interface ParticipantAttributes {
  id: number;
  registrationType: string;
  eventId: number;
  amountPaid?: number;
  qrCode?: string;
  userId: number;
  participantTypeId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type ParticipantPk = 'id';
export type ParticipantId = Participant[ParticipantPk];
export type ParticipantOptionalAttributes =
  | 'id'
  | 'amountPaid'
  | 'qrCode'
  | 'participantTypeId'
  | 'createdOn'
  | 'modifiedOn';
export type ParticipantCreationAttributes = Optional<
  ParticipantAttributes,
  ParticipantOptionalAttributes
>;

export class Participant
  extends Model<ParticipantAttributes, ParticipantCreationAttributes>
  implements ParticipantAttributes
{
  id!: number;
  registrationType!: string;
  eventId!: number;
  amountPaid?: number;
  qrCode?: string;
  userId!: number;
  participantTypeId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Participant belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Participant hasMany Attendee via participantId
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
  // Participant hasMany EventParticipant via participantId
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
  // Participant hasMany EventRegistrationRecord via participantId
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
  // Participant hasMany ParticipantGroup via participantId
  participantGroups!: ParticipantGroup[];
  getParticipantGroups!: Sequelize.HasManyGetAssociationsMixin<ParticipantGroup>;
  setParticipantGroups!: Sequelize.HasManySetAssociationsMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  addParticipantGroup!: Sequelize.HasManyAddAssociationMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  addParticipantGroups!: Sequelize.HasManyAddAssociationsMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  createParticipantGroup!: Sequelize.HasManyCreateAssociationMixin<ParticipantGroup>;
  removeParticipantGroup!: Sequelize.HasManyRemoveAssociationMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  removeParticipantGroups!: Sequelize.HasManyRemoveAssociationsMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  hasParticipantGroup!: Sequelize.HasManyHasAssociationMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  hasParticipantGroups!: Sequelize.HasManyHasAssociationsMixin<
    ParticipantGroup,
    ParticipantGroupId
  >;
  countParticipantGroups!: Sequelize.HasManyCountAssociationsMixin;
  // Participant belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<
    ParticipantType,
    ParticipantTypeId
  >;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;
  // Participant belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Participant {
    return Participant.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        registrationType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'registration_type',
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
        amountPaid: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
          field: 'amount_paid',
        },
        qrCode: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'qr_code',
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
        participantTypeId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'participant_type',
            key: 'id',
          },
          field: 'participant_type_id',
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
        tableName: 'participant',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'participant_participant_type_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
          {
            name: 'event_id',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'user_id',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
