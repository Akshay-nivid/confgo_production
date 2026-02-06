import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type { EventAddonProperty, EventAddonPropertyId } from './EventAddonProperty';
import type { Sponsor, SponsorId } from './Sponsor';
import type { SponsorStatus, SponsorStatusId } from './SponsorStatus';
import type { SponsorType, SponsorTypeId } from './SponsorType';

export interface EventSponsorAttributes {
  id: number;
  sponsorId: number;
  sponsorTypeId?: number;
  eventId?: number;
  parentEventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  reservedSeats?: number;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type EventSponsorPk = "id";
export type EventSponsorId = EventSponsor[EventSponsorPk];
export type EventSponsorOptionalAttributes = "id" | "sponsorTypeId" | "eventId" | "parentEventId" | "eventAddonId" | "eventAddonPropertyId" | "reservedSeats" | "statusId" | "createdOn" | "modifiedBy" | "modifiedOn";
export type EventSponsorCreationAttributes = Optional<EventSponsorAttributes, EventSponsorOptionalAttributes>;

export class EventSponsor extends Model<EventSponsorAttributes, EventSponsorCreationAttributes> implements EventSponsorAttributes {
  id!: number;
  sponsorId!: number;
  sponsorTypeId?: number;
  eventId?: number;
  parentEventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  reservedSeats?: number;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // EventSponsor belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventSponsor belongsTo Event via parentEventId
  parentEvent!: Event;
  getParentEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParentEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParentEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventSponsor belongsTo EventAddon via eventAddonId
  eventAddon!: EventAddon;
  getEventAddon!: Sequelize.BelongsToGetAssociationMixin<EventAddon>;
  setEventAddon!: Sequelize.BelongsToSetAssociationMixin<EventAddon, EventAddonId>;
  createEventAddon!: Sequelize.BelongsToCreateAssociationMixin<EventAddon>;
  // EventSponsor belongsTo EventAddonProperty via eventAddonPropertyId
  eventAddonProperty!: EventAddonProperty;
  getEventAddonProperty!: Sequelize.BelongsToGetAssociationMixin<EventAddonProperty>;
  setEventAddonProperty!: Sequelize.BelongsToSetAssociationMixin<EventAddonProperty, EventAddonPropertyId>;
  createEventAddonProperty!: Sequelize.BelongsToCreateAssociationMixin<EventAddonProperty>;
  // EventSponsor belongsTo Sponsor via sponsorId
  sponsor!: Sponsor;
  getSponsor!: Sequelize.BelongsToGetAssociationMixin<Sponsor>;
  setSponsor!: Sequelize.BelongsToSetAssociationMixin<Sponsor, SponsorId>;
  createSponsor!: Sequelize.BelongsToCreateAssociationMixin<Sponsor>;
  // EventSponsor belongsTo SponsorStatus via statusId
  status!: SponsorStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<SponsorStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<SponsorStatus, SponsorStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<SponsorStatus>;
  // EventSponsor belongsTo SponsorType via sponsorTypeId
  sponsorType!: SponsorType;
  getSponsorType!: Sequelize.BelongsToGetAssociationMixin<SponsorType>;
  setSponsorType!: Sequelize.BelongsToSetAssociationMixin<SponsorType, SponsorTypeId>;
  createSponsorType!: Sequelize.BelongsToCreateAssociationMixin<SponsorType>;

  static initModel(sequelize: Sequelize.Sequelize): typeof EventSponsor {
    return EventSponsor.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sponsorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sponsor',
        key: 'id'
      },
      field: 'sponsor_id'
    },
    sponsorTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sponsor_type',
        key: 'id'
      },
      field: 'sponsor_type_id'
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
    parentEventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'parent_id'
      },
      field: 'parent_event_id'
    },
    eventAddonId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event_addon',
        key: 'id'
      },
      field: 'event_addon_id'
    },
    eventAddonPropertyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event_addon_property',
        key: 'id'
      },
      field: 'event_addon_property_id'
    },
    reservedSeats: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'reserved_seats'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'sponsor_status',
        key: 'id'
      },
      field: 'status_id'
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
      allowNull: true,
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
    tableName: 'event_sponsor',
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
        name: "event_sponsor_sponsor_FK_idx",
        using: "BTREE",
        fields: [
          { name: "sponsor_id" },
        ]
      },
      {
        name: "event_sponsor_sponsor_type_FK_idx",
        using: "BTREE",
        fields: [
          { name: "sponsor_type_id" },
        ]
      },
      {
        name: "event_sponsor_event_FK_idx",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "event_sponsor_parent_event_FK_idx",
        using: "BTREE",
        fields: [
          { name: "parent_event_id" },
        ]
      },
      {
        name: "event_sponsor_event_addon_FK_idx",
        using: "BTREE",
        fields: [
          { name: "event_addon_id" },
        ]
      },
      {
        name: "event_sponsor_event_addon_property_FK_idx",
        using: "BTREE",
        fields: [
          { name: "event_addon_property_id" },
        ]
      },
      {
        name: "event_sponsor_sponsor_status_FK_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
    ]
  });
  }
}
