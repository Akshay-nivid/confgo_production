import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { User, UserId } from './User';
import type { VolunteerStatus, VolunteerStatusId } from './VolunteerStatus';

export interface VolunteerEventAttributes {
  id: number;
  eventId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  userId: number;
  statusId?: number;
}

export type VolunteerEventPk = "id";
export type VolunteerEventId = VolunteerEvent[VolunteerEventPk];
export type VolunteerEventOptionalAttributes = "id" | "eventId" | "createdOn" | "modifiedOn" | "statusId";
export type VolunteerEventCreationAttributes = Optional<VolunteerEventAttributes, VolunteerEventOptionalAttributes>;

export class VolunteerEvent extends Model<VolunteerEventAttributes, VolunteerEventCreationAttributes> implements VolunteerEventAttributes {
  id!: number;
  eventId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  userId!: number;
  statusId?: number;

  // VolunteerEvent belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // VolunteerEvent belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // VolunteerEvent belongsTo VolunteerStatus via statusId
  status!: VolunteerStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<VolunteerStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<VolunteerStatus, VolunteerStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<VolunteerStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof VolunteerEvent {
    return VolunteerEvent.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'event_id'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by'
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_on'
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'volunteer_status',
        key: 'id'
      },
      field: 'status_id'
    }
  }, {
    sequelize,
    tableName: 'volunteer_event',
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
        name: "event_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "user_ibfk_1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "volunteer_event_ibfk_204_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
    ]
  });
  }
}
