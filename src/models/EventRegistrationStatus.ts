import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  EventRegistration,
  EventRegistrationId,
} from './EventRegistration';

export interface EventRegistrationStatusAttributes {
  id: number;
  statusName?: string;
  description?: string;
}

export type EventRegistrationStatusPk = 'id';
export type EventRegistrationStatusId =
  EventRegistrationStatus[EventRegistrationStatusPk];
export type EventRegistrationStatusOptionalAttributes =
  | 'id'
  | 'statusName'
  | 'description';
export type EventRegistrationStatusCreationAttributes = Optional<
  EventRegistrationStatusAttributes,
  EventRegistrationStatusOptionalAttributes
>;

export class EventRegistrationStatus
  extends Model<
    EventRegistrationStatusAttributes,
    EventRegistrationStatusCreationAttributes
  >
  implements EventRegistrationStatusAttributes
{
  id!: number;
  statusName?: string;
  description?: string;

  // EventRegistrationStatus hasMany EventRegistration via statusId
  eventRegistrations!: EventRegistration[];
  getEventRegistrations!: Sequelize.HasManyGetAssociationsMixin<EventRegistration>;
  setEventRegistrations!: Sequelize.HasManySetAssociationsMixin<
    EventRegistration,
    EventRegistrationId
  >;
  addEventRegistration!: Sequelize.HasManyAddAssociationMixin<
    EventRegistration,
    EventRegistrationId
  >;
  addEventRegistrations!: Sequelize.HasManyAddAssociationsMixin<
    EventRegistration,
    EventRegistrationId
  >;
  createEventRegistration!: Sequelize.HasManyCreateAssociationMixin<EventRegistration>;
  removeEventRegistration!: Sequelize.HasManyRemoveAssociationMixin<
    EventRegistration,
    EventRegistrationId
  >;
  removeEventRegistrations!: Sequelize.HasManyRemoveAssociationsMixin<
    EventRegistration,
    EventRegistrationId
  >;
  hasEventRegistration!: Sequelize.HasManyHasAssociationMixin<
    EventRegistration,
    EventRegistrationId
  >;
  hasEventRegistrations!: Sequelize.HasManyHasAssociationsMixin<
    EventRegistration,
    EventRegistrationId
  >;
  countEventRegistrations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventRegistrationStatus {
    return EventRegistrationStatus.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        statusName: {
          type: DataTypes.STRING(45),
          allowNull: true,
          field: 'status_name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'event_registration_status',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
