import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { EventSpeaker, EventSpeakerId } from './EventSpeaker';

export interface EventProgramScheduleStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type EventProgramScheduleStatusPk = "id";
export type EventProgramScheduleStatusId = EventProgramScheduleStatus[EventProgramScheduleStatusPk];
export type EventProgramScheduleStatusOptionalAttributes = "id" | "description";
export type EventProgramScheduleStatusCreationAttributes = Optional<EventProgramScheduleStatusAttributes, EventProgramScheduleStatusOptionalAttributes>;

export class EventProgramScheduleStatus extends Model<EventProgramScheduleStatusAttributes, EventProgramScheduleStatusCreationAttributes> implements EventProgramScheduleStatusAttributes {
  id!: number;
  statusName!: string;
  description?: string;

  // EventProgramScheduleStatus hasMany EventSpeaker via statusId
  eventSpeakers!: EventSpeaker[];
  getEventSpeakers!: Sequelize.HasManyGetAssociationsMixin<EventSpeaker>;
  setEventSpeakers!: Sequelize.HasManySetAssociationsMixin<EventSpeaker, EventSpeakerId>;
  addEventSpeaker!: Sequelize.HasManyAddAssociationMixin<EventSpeaker, EventSpeakerId>;
  addEventSpeakers!: Sequelize.HasManyAddAssociationsMixin<EventSpeaker, EventSpeakerId>;
  createEventSpeaker!: Sequelize.HasManyCreateAssociationMixin<EventSpeaker>;
  removeEventSpeaker!: Sequelize.HasManyRemoveAssociationMixin<EventSpeaker, EventSpeakerId>;
  removeEventSpeakers!: Sequelize.HasManyRemoveAssociationsMixin<EventSpeaker, EventSpeakerId>;
  hasEventSpeaker!: Sequelize.HasManyHasAssociationMixin<EventSpeaker, EventSpeakerId>;
  hasEventSpeakers!: Sequelize.HasManyHasAssociationsMixin<EventSpeaker, EventSpeakerId>;
  countEventSpeakers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventProgramScheduleStatus {
    return EventProgramScheduleStatus.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'status_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'event_program_schedule_status',
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
    ]
  });
  }
}
