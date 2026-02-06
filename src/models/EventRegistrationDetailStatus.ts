import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type {
  EventRegistrationDetail,
  EventRegistrationDetailId,
} from './EventRegistrationDetail';

export interface EventRegistrationDetailStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type EventRegistrationDetailStatusPk = 'id';
export type EventRegistrationDetailStatusId =
  EventRegistrationDetailStatus[EventRegistrationDetailStatusPk];
export type EventRegistrationDetailStatusOptionalAttributes =
  | 'id'
  | 'description';
export type EventRegistrationDetailStatusCreationAttributes = Optional<
  EventRegistrationDetailStatusAttributes,
  EventRegistrationDetailStatusOptionalAttributes
>;

export class EventRegistrationDetailStatus
  extends Model<
    EventRegistrationDetailStatusAttributes,
    EventRegistrationDetailStatusCreationAttributes
  >
  implements EventRegistrationDetailStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // EventRegistrationDetailStatus hasMany EventRegistrationDetail via statusId
  eventRegistrationDetails!: EventRegistrationDetail[];
  getEventRegistrationDetails!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationDetail>;
  setEventRegistrationDetails!: Sequelize.HasManySetAssociationsMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  addEventRegistrationDetail!: Sequelize.HasManyAddAssociationMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  addEventRegistrationDetails!: Sequelize.HasManyAddAssociationsMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  createEventRegistrationDetail!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationDetail>;
  removeEventRegistrationDetail!: Sequelize.HasManyRemoveAssociationMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  removeEventRegistrationDetails!: Sequelize.HasManyRemoveAssociationsMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  hasEventRegistrationDetail!: Sequelize.HasManyHasAssociationMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  hasEventRegistrationDetails!: Sequelize.HasManyHasAssociationsMixin<
    EventRegistrationDetail,
    EventRegistrationDetailId
  >;
  countEventRegistrationDetails!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventRegistrationDetailStatus {
    return EventRegistrationDetailStatus.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        statusName: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'status_name',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'event_registration_detail_status',
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
