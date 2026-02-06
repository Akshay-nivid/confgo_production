import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { EventProgramScheduleStatus, EventProgramScheduleStatusId } from './EventProgramScheduleStatus';
import type { SpeakerBio, SpeakerBioId } from './SpeakerBio';
import type { User, UserId } from './User';

export interface EventSpeakerAttributes {
  id: number;
  userId?: number;
  eventId: number;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;
  statusId?: number;
  parentEventId?: number;
}

export type EventSpeakerPk = "id";
export type EventSpeakerId = EventSpeaker[EventSpeakerPk];
export type EventSpeakerOptionalAttributes = "id" | "userId" | "createdOn" | "createdBy" | "modifiedOn" | "modifiedBy" | "statusId" | "parentEventId";
export type EventSpeakerCreationAttributes = Optional<EventSpeakerAttributes, EventSpeakerOptionalAttributes>;

export class EventSpeaker extends Model<EventSpeakerAttributes, EventSpeakerCreationAttributes> implements EventSpeakerAttributes {
  id!: number;
  userId?: number;
  eventId!: number;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;
  statusId?: number;
  parentEventId?: number;

  // EventSpeaker belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventSpeaker belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventSpeaker belongsTo EventProgramScheduleStatus via statusId
  status!: EventProgramScheduleStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<EventProgramScheduleStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<EventProgramScheduleStatus, EventProgramScheduleStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<EventProgramScheduleStatus>;
  // EventSpeaker hasMany SpeakerBio via eventSpeakerId
  speakerBios!: SpeakerBio[];
  getSpeakerBios!: Sequelize.HasManyGetAssociationsMixin<SpeakerBio>;
  setSpeakerBios!: Sequelize.HasManySetAssociationsMixin<SpeakerBio, SpeakerBioId>;
  addSpeakerBio!: Sequelize.HasManyAddAssociationMixin<SpeakerBio, SpeakerBioId>;
  addSpeakerBios!: Sequelize.HasManyAddAssociationsMixin<SpeakerBio, SpeakerBioId>;
  createSpeakerBio!: Sequelize.HasManyCreateAssociationMixin<SpeakerBio>;
  removeSpeakerBio!: Sequelize.HasManyRemoveAssociationMixin<SpeakerBio, SpeakerBioId>;
  removeSpeakerBios!: Sequelize.HasManyRemoveAssociationsMixin<SpeakerBio, SpeakerBioId>;
  hasSpeakerBio!: Sequelize.HasManyHasAssociationMixin<SpeakerBio, SpeakerBioId>;
  hasSpeakerBios!: Sequelize.HasManyHasAssociationsMixin<SpeakerBio, SpeakerBioId>;
  countSpeakerBios!: Sequelize.HasManyCountAssociationsMixin;
  // EventSpeaker belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventSpeaker {
    return EventSpeaker.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'event_id'
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_on'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'modified_by'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event_program_schedule_status',
        key: 'id'
      },
      field: 'status_id'
    },
    parentEventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'parent_event_id'
    }
  }, {
    sequelize,
    tableName: 'event_speaker',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_event_id",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "event_program_schedule_ibfk_6_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "fk_status_id_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "fk_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "parent_event_id",
        using: "BTREE",
        fields: [
          { name: "parent_event_id" },
        ]
      },
    ]
  });
  }
}
