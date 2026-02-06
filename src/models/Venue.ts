import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type {
  EventNearbyAttraction,
  EventNearbyAttractionId,
} from './EventNearbyAttraction';

export interface VenueAttributes {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  totalCapacity?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  mapUrl?: string;
}

export type VenuePk = 'id';
export type VenueId = Venue[VenuePk];
export type VenueOptionalAttributes =
  | 'id'
  | 'address'
  | 'city'
  | 'state'
  | 'country'
  | 'postalCode'
  | 'totalCapacity'
  | 'createdOn'
  | 'modifiedOn'
  | 'mapUrl';
export type VenueCreationAttributes = Optional<
  VenueAttributes,
  VenueOptionalAttributes
>;

export class Venue
  extends Model<VenueAttributes, VenueCreationAttributes>
  implements VenueAttributes
{
  id!: number;
  name!: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  totalCapacity?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  mapUrl?: string;

  // Venue hasMany Event via venueId
  events!: Event[];
  getEvents!: Sequelize.HasManyGetAssociationsMixin<Event>;
  setEvents!: Sequelize.HasManySetAssociationsMixin<Event, EventId>;
  addEvent!: Sequelize.HasManyAddAssociationMixin<Event, EventId>;
  addEvents!: Sequelize.HasManyAddAssociationsMixin<Event, EventId>;
  createEvent!: Sequelize.HasManyCreateAssociationMixin<Event>;
  removeEvent!: Sequelize.HasManyRemoveAssociationMixin<Event, EventId>;
  removeEvents!: Sequelize.HasManyRemoveAssociationsMixin<Event, EventId>;
  hasEvent!: Sequelize.HasManyHasAssociationMixin<Event, EventId>;
  hasEvents!: Sequelize.HasManyHasAssociationsMixin<Event, EventId>;
  countEvents!: Sequelize.HasManyCountAssociationsMixin;
  // Venue hasMany EventNearbyAttraction via venueId
  eventNearbyAttractions!: EventNearbyAttraction[];
  getEventNearbyAttractions!: Sequelize.HasManyGetAssociationsMixin<EventNearbyAttraction>;
  setEventNearbyAttractions!: Sequelize.HasManySetAssociationsMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  addEventNearbyAttraction!: Sequelize.HasManyAddAssociationMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  addEventNearbyAttractions!: Sequelize.HasManyAddAssociationsMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  createEventNearbyAttraction!: Sequelize.HasManyCreateAssociationMixin<EventNearbyAttraction>;
  removeEventNearbyAttraction!: Sequelize.HasManyRemoveAssociationMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  removeEventNearbyAttractions!: Sequelize.HasManyRemoveAssociationsMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  hasEventNearbyAttraction!: Sequelize.HasManyHasAssociationMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  hasEventNearbyAttractions!: Sequelize.HasManyHasAssociationsMixin<
    EventNearbyAttraction,
    EventNearbyAttractionId
  >;
  countEventNearbyAttractions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Venue {
    return Venue.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        state: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        postalCode: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'postal_code',
        },
        totalCapacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'total_capacity',
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
        mapUrl: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'map_url',
        },
      },
      {
        sequelize,
        tableName: 'venue',
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
