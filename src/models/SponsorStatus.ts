import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { EventSponsor, EventSponsorId } from './EventSponsor';
import type { Sponsor, SponsorId } from './Sponsor';

export interface SponsorStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type SponsorStatusPk = 'id';
export type SponsorStatusId = SponsorStatus[SponsorStatusPk];
export type SponsorStatusOptionalAttributes = 'id' | 'description';
export type SponsorStatusCreationAttributes = Optional<
  SponsorStatusAttributes,
  SponsorStatusOptionalAttributes
>;

export class SponsorStatus
  extends Model<SponsorStatusAttributes, SponsorStatusCreationAttributes>
  implements SponsorStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // SponsorStatus hasMany EventSponsor via statusId
  eventSponsors!: EventSponsor[];
  getEventSponsors!: Sequelize.HasManyGetAssociationsMixin<EventSponsor>;
  setEventSponsors!: Sequelize.HasManySetAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  addEventSponsor!: Sequelize.HasManyAddAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  addEventSponsors!: Sequelize.HasManyAddAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  createEventSponsor!: Sequelize.HasManyCreateAssociationMixin<EventSponsor>;
  removeEventSponsor!: Sequelize.HasManyRemoveAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  removeEventSponsors!: Sequelize.HasManyRemoveAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  hasEventSponsor!: Sequelize.HasManyHasAssociationMixin<
    EventSponsor,
    EventSponsorId
  >;
  hasEventSponsors!: Sequelize.HasManyHasAssociationsMixin<
    EventSponsor,
    EventSponsorId
  >;
  countEventSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // SponsorStatus hasMany Sponsor via statusId
  sponsors!: Sponsor[];
  getSponsors!: Sequelize.HasManyGetAssociationsMixin<Sponsor>;
  setSponsors!: Sequelize.HasManySetAssociationsMixin<Sponsor, SponsorId>;
  addSponsor!: Sequelize.HasManyAddAssociationMixin<Sponsor, SponsorId>;
  addSponsors!: Sequelize.HasManyAddAssociationsMixin<Sponsor, SponsorId>;
  createSponsor!: Sequelize.HasManyCreateAssociationMixin<Sponsor>;
  removeSponsor!: Sequelize.HasManyRemoveAssociationMixin<Sponsor, SponsorId>;
  removeSponsors!: Sequelize.HasManyRemoveAssociationsMixin<Sponsor, SponsorId>;
  hasSponsor!: Sequelize.HasManyHasAssociationMixin<Sponsor, SponsorId>;
  hasSponsors!: Sequelize.HasManyHasAssociationsMixin<Sponsor, SponsorId>;
  countSponsors!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof SponsorStatus {
    return SponsorStatus.init(
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
        tableName: 'sponsor_status',
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
