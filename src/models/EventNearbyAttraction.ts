import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Event, EventId } from './Event';
import type { Venue, VenueId } from './Venue';

export interface EventNearbyAttractionAttributes {
  id: number;
  eventId: number;
  venueId?: number;
  assetId?: string;
  name: string;
  distance?: string;
  category?: string;
  openingHour?: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type EventNearbyAttractionPk = 'id';
export type EventNearbyAttractionId =
  EventNearbyAttraction[EventNearbyAttractionPk];
export type EventNearbyAttractionOptionalAttributes =
  | 'id'
  | 'venueId'
  | 'assetId'
  | 'distance'
  | 'category'
  | 'openingHour'
  | 'description'
  | 'createdBy'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type EventNearbyAttractionCreationAttributes = Optional<
  EventNearbyAttractionAttributes,
  EventNearbyAttractionOptionalAttributes
>;

export class EventNearbyAttraction
  extends Model<
    EventNearbyAttractionAttributes,
    EventNearbyAttractionCreationAttributes
  >
  implements EventNearbyAttractionAttributes
{
  id!: number;
  eventId!: number;
  venueId?: number;
  assetId?: string;
  name!: string;
  distance?: string;
  category?: string;
  openingHour?: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // EventNearbyAttraction belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // EventNearbyAttraction belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventNearbyAttraction belongsTo Venue via venueId
  venue!: Venue;
  getVenue!: Sequelize.BelongsToGetAssociationMixin<Venue>;
  setVenue!: Sequelize.BelongsToSetAssociationMixin<Venue, VenueId>;
  createVenue!: Sequelize.BelongsToCreateAssociationMixin<Venue>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventNearbyAttraction {
    return EventNearbyAttraction.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        venueId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'venue',
            key: 'id',
          },
          field: 'venue_id',
        },
        assetId: {
          type: DataTypes.STRING(36),
          allowNull: true,
          references: {
            model: 'asset',
            key: 'id',
          },
          field: 'asset_id',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        distance: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        category: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        openingHour: {
          type: DataTypes.STRING(50),
          allowNull: true,
          field: 'opening_hour',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'created_by',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'created_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'modified_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'event_nearby_attraction',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_nearby_attraction_event_idFK_2_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'event_nearby_attraction_venue_idFK_3_idx',
            using: 'BTREE',
            fields: [{ name: 'venue_id' }],
          },
          {
            name: 'event_nearby_attraction_assetr_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
        ],
      }
    );
  }
}
