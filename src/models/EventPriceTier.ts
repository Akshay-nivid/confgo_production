import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';

export interface EventPriceTierAttributes {
  id: number;
  name: string;
  description?: string;
  participantTypeId: number;
  eventId: number;
  percentage?: number;
  startDate: Date;
  endDate: Date;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventPriceTierPk = 'id';
export type EventPriceTierId = EventPriceTier[EventPriceTierPk];
export type EventPriceTierOptionalAttributes =
  | 'id'
  | 'description'
  | 'percentage'
  | 'createdOn'
  | 'modifiedOn';
export type EventPriceTierCreationAttributes = Optional<
  EventPriceTierAttributes,
  EventPriceTierOptionalAttributes
>;

export class EventPriceTier
  extends Model<EventPriceTierAttributes, EventPriceTierCreationAttributes>
  implements EventPriceTierAttributes
{
  id!: number;
  name!: string;
  description?: string;
  participantTypeId!: number;
  eventId!: number;
  percentage?: number;
  startDate!: Date;
  endDate!: Date;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventPriceTier belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventPriceTier belongsTo ParticipantType via participantTypeId
  participantType!: ParticipantType;
  getParticipantType!: Sequelize.BelongsToGetAssociationMixin<ParticipantType>;
  setParticipantType!: Sequelize.BelongsToSetAssociationMixin<
    ParticipantType,
    ParticipantTypeId
  >;
  createParticipantType!: Sequelize.BelongsToCreateAssociationMixin<ParticipantType>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventPriceTier {
    return EventPriceTier.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        participantTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        percentage: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_date',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'end_date',
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
        tableName: 'event_price_tier',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_price_tier_participant_type_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'participant_type_id' }],
          },
          {
            name: 'event_participant_tier_event_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
        ],
      }
    );
  }
}
