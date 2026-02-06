import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { EventAddon, EventAddonId } from './EventAddon';

export interface EventAddonStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type EventAddonStatusPk = 'id';
export type EventAddonStatusId = EventAddonStatus[EventAddonStatusPk];
export type EventAddonStatusOptionalAttributes = 'id' | 'description';
export type EventAddonStatusCreationAttributes = Optional<
  EventAddonStatusAttributes,
  EventAddonStatusOptionalAttributes
>;

export class EventAddonStatus
  extends Model<EventAddonStatusAttributes, EventAddonStatusCreationAttributes>
  implements EventAddonStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // EventAddonStatus hasMany EventAddon via statusId
  eventAddons!: EventAddon[];
  getEventAddons!: Sequelize.HasManyGetAssociationsMixin<EventAddon>;
  setEventAddons!: Sequelize.HasManySetAssociationsMixin<
    EventAddon,
    EventAddonId
  >;
  addEventAddon!: Sequelize.HasManyAddAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  addEventAddons!: Sequelize.HasManyAddAssociationsMixin<
    EventAddon,
    EventAddonId
  >;
  createEventAddon!: Sequelize.HasManyCreateAssociationMixin<EventAddon>;
  removeEventAddon!: Sequelize.HasManyRemoveAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  removeEventAddons!: Sequelize.HasManyRemoveAssociationsMixin<
    EventAddon,
    EventAddonId
  >;
  hasEventAddon!: Sequelize.HasManyHasAssociationMixin<
    EventAddon,
    EventAddonId
  >;
  hasEventAddons!: Sequelize.HasManyHasAssociationsMixin<
    EventAddon,
    EventAddonId
  >;
  countEventAddons!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventAddonStatus {
    return EventAddonStatus.init(
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
        tableName: 'event_addon_status',
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
