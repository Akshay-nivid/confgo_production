import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type {
  EventRegistrationStatus,
  EventRegistrationStatusId,
} from './EventRegistrationStatus';

export interface EventRegistrationAttributes {
  id: number;
  eventId?: number;
  slugName: string;
  name: string;
  comments?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  statusId?: number;
}

export type EventRegistrationPk = 'id';
export type EventRegistrationId = EventRegistration[EventRegistrationPk];
export type EventRegistrationOptionalAttributes =
  | 'id'
  | 'eventId'
  | 'comments'
  | 'createdOn'
  | 'modifiedOn'
  | 'statusId';
export type EventRegistrationCreationAttributes = Optional<
  EventRegistrationAttributes,
  EventRegistrationOptionalAttributes
>;

export class EventRegistration
  extends Model<
    EventRegistrationAttributes,
    EventRegistrationCreationAttributes
  >
  implements EventRegistrationAttributes
{
  id!: number;
  eventId?: number;
  slugName!: string;
  name!: string;
  comments?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  statusId?: number;

  // EventRegistration belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventRegistration belongsTo EventRegistrationStatus via statusId
  status!: EventRegistrationStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<EventRegistrationStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    EventRegistrationStatus,
    EventRegistrationStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<EventRegistrationStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventRegistration {
    return EventRegistration.init(
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
        slugName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'slug_name',
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        comments: {
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
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_registration_status',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'event_registration',
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
            name: 'statusId',
            using: 'BTREE',
            fields: [{ name: 'statusId' }],
          },
        ],
      }
    );
  }
}
