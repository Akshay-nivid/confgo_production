import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { EventSponsor, EventSponsorId } from './EventSponsor';
import type { User, UserId } from './User';

export interface SponsorAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logoAssetId?: string;
  bannerImgAssetId?: string;
  companyId?: number;
  statusId: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type SponsorPk = "id";
export type SponsorId = Sponsor[SponsorPk];
export type SponsorOptionalAttributes = "id" | "phone" | "website" | "logoAssetId" | "bannerImgAssetId" | "companyId" | "createdOn" | "modifiedBy" | "modifiedOn";
export type SponsorCreationAttributes = Optional<SponsorAttributes, SponsorOptionalAttributes>;

export class Sponsor extends Model<SponsorAttributes, SponsorCreationAttributes> implements SponsorAttributes {
  id!: number;
  name!: string;
  email!: string;
  phone?: string;
  website?: string;
  logoAssetId?: string;
  bannerImgAssetId?: string;
  companyId?: number;
  statusId!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // Sponsor belongsTo Asset via logoAssetId
  logoAsset!: Asset;
  getLogoAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setLogoAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createLogoAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Sponsor belongsTo Asset via bannerImgAssetId
  bannerImgAsset!: Asset;
  getBannerImgAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setBannerImgAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createBannerImgAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Sponsor hasMany EventSponsor via sponsorId
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
  // Sponsor belongsTo User via companyId
  company!: User;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<User>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Sponsor {
    return Sponsor.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logoAssetId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'asset',
        key: 'id'
      },
      field: 'logo_asset_id'
    },
    bannerImgAssetId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'asset',
        key: 'id'
      },
      field: 'banner_img_asset_id'
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'company_id'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'sponsor',
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
        name: "sponsor_logo_asset_FK_idx",
        using: "BTREE",
        fields: [
          { name: "logo_asset_id" },
        ]
      },
      {
        name: "sponsor_banner_img_asset_FK_idx",
        using: "BTREE",
        fields: [
          { name: "banner_img_asset_id" },
        ]
      },
      {
        name: "sponsor_asset_logo_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "logo_asset_id" },
        ]
      },
      {
        name: "sponsor_asset_banner_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "banner_img_asset_id" },
        ]
      },
    ]
  });
  }
}
