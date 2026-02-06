import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { EventSponsor, EventSponsorId } from './EventSponsor';

export interface SponsorTypeAttributes {
  id: number;
  name?: string;
  description?: string;
}

export type SponsorTypePk = "id";
export type SponsorTypeId = SponsorType[SponsorTypePk];
export type SponsorTypeOptionalAttributes = "id" | "name" | "description";
export type SponsorTypeCreationAttributes = Optional<SponsorTypeAttributes, SponsorTypeOptionalAttributes>;

export class SponsorType extends Model<SponsorTypeAttributes, SponsorTypeCreationAttributes> implements SponsorTypeAttributes {
  id!: number;
  name?: string;
  description?: string;

  // SponsorType hasMany EventSponsor via sponsorTypeId
  eventSponsors!: EventSponsor[];
  getEventSponsors!: Sequelize.HasManyGetAssociationsMixin<EventSponsor>;
  setEventSponsors!: Sequelize.HasManySetAssociationsMixin<EventSponsor, EventSponsorId>;
  addEventSponsor!: Sequelize.HasManyAddAssociationMixin<EventSponsor, EventSponsorId>;
  addEventSponsors!: Sequelize.HasManyAddAssociationsMixin<EventSponsor, EventSponsorId>;
  createEventSponsor!: Sequelize.HasManyCreateAssociationMixin<EventSponsor>;
  removeEventSponsor!: Sequelize.HasManyRemoveAssociationMixin<EventSponsor, EventSponsorId>;
  removeEventSponsors!: Sequelize.HasManyRemoveAssociationsMixin<EventSponsor, EventSponsorId>;
  hasEventSponsor!: Sequelize.HasManyHasAssociationMixin<EventSponsor, EventSponsorId>;
  hasEventSponsors!: Sequelize.HasManyHasAssociationsMixin<EventSponsor, EventSponsorId>;
  countEventSponsors!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof SponsorType {
    return SponsorType.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sponsor_type',
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
    ]
  });
  }
}
