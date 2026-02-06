import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Event, EventId } from './Event';

export interface EventImagesAttributes {
  id: number;
  eventId: number;
  assetId: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventImagesPk = "id";
export type EventImagesId = EventImages[EventImagesPk];
export type EventImagesOptionalAttributes = "id" | "createdOn" | "modifiedBy" | "modifiedOn";
export type EventImagesCreationAttributes = Optional<EventImagesAttributes, EventImagesOptionalAttributes>;

export class EventImages extends Model<EventImagesAttributes, EventImagesCreationAttributes> implements EventImagesAttributes {
  id!: number;
  eventId!: number;
  assetId!: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventImages belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // EventImages belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventImages {
    return EventImages.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    assetId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'asset',
        key: 'id'
      },
      field: 'asset_id'
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
      defaultValue: 0,
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    }
  }, {
    sequelize,
    tableName: 'event_images',
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
        name: "event_images_event_FK_idx",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "event_images_asset_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
    ]
  });
  }
}
