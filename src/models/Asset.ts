import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Addon, AddonId } from './Addon';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type { EventAddonProperty, EventAddonPropertyId } from './EventAddonProperty';
import type { EventImages, EventImagesId } from './EventImages';
import type { EventNearbyAttraction, EventNearbyAttractionId } from './EventNearbyAttraction';
import type { Plan, PlanId } from './Plan';
import type { PlanProperty, PlanPropertyId } from './PlanProperty';
import type { SpeakerBio, SpeakerBioId } from './SpeakerBio';
import type { Sponsor, SponsorId } from './Sponsor';
import type { Template, TemplateId } from './Template';
import type { User, UserId } from './User';
import type { UserAbstract, UserAbstractId } from './UserAbstract';

export interface AssetAttributes {
  id: string;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
  companyId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  userId?: number;
}

export type AssetPk = "id";
export type AssetId = Asset[AssetPk];
export type AssetOptionalAttributes = "id" | "companyId" | "createdOn" | "modifiedOn" | "userId";
export type AssetCreationAttributes = Optional<AssetAttributes, AssetOptionalAttributes>;

export class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
  id!: string;
  name!: string;
  mimeType!: string;
  sourcePath!: string;
  size!: number;
  companyId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  userId?: number;

  // Asset hasMany Addon via assetId
  addons!: Addon[];
  getAddons!: Sequelize.HasManyGetAssociationsMixin<Addon>;
  setAddons!: Sequelize.HasManySetAssociationsMixin<Addon, AddonId>;
  addAddon!: Sequelize.HasManyAddAssociationMixin<Addon, AddonId>;
  addAddons!: Sequelize.HasManyAddAssociationsMixin<Addon, AddonId>;
  createAddon!: Sequelize.HasManyCreateAssociationMixin<Addon>;
  removeAddon!: Sequelize.HasManyRemoveAssociationMixin<Addon, AddonId>;
  removeAddons!: Sequelize.HasManyRemoveAssociationsMixin<Addon, AddonId>;
  hasAddon!: Sequelize.HasManyHasAssociationMixin<Addon, AddonId>;
  hasAddons!: Sequelize.HasManyHasAssociationsMixin<Addon, AddonId>;
  countAddons!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany Company via assetId
  assetCompanies!: Company[];
  getAssetCompanies!: Sequelize.HasManyGetAssociationsMixin<Company>;
  setAssetCompanies!: Sequelize.HasManySetAssociationsMixin<Company, CompanyId>;
  addAssetCompany!: Sequelize.HasManyAddAssociationMixin<Company, CompanyId>;
  addAssetCompanies!: Sequelize.HasManyAddAssociationsMixin<Company, CompanyId>;
  createAssetCompany!: Sequelize.HasManyCreateAssociationMixin<Company>;
  removeAssetCompany!: Sequelize.HasManyRemoveAssociationMixin<Company, CompanyId>;
  removeAssetCompanies!: Sequelize.HasManyRemoveAssociationsMixin<Company, CompanyId>;
  hasAssetCompany!: Sequelize.HasManyHasAssociationMixin<Company, CompanyId>;
  hasAssetCompanies!: Sequelize.HasManyHasAssociationsMixin<Company, CompanyId>;
  countAssetCompanies!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany Event via assetId
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
  // Asset hasMany EventAddonProperty via assetId
  eventAddonProperties!: EventAddonProperty[];
  getEventAddonProperties!: Sequelize.HasManyGetAssociationsMixin<EventAddonProperty>;
  setEventAddonProperties!: Sequelize.HasManySetAssociationsMixin<EventAddonProperty, EventAddonPropertyId>;
  addEventAddonProperty!: Sequelize.HasManyAddAssociationMixin<EventAddonProperty, EventAddonPropertyId>;
  addEventAddonProperties!: Sequelize.HasManyAddAssociationsMixin<EventAddonProperty, EventAddonPropertyId>;
  createEventAddonProperty!: Sequelize.HasManyCreateAssociationMixin<EventAddonProperty>;
  removeEventAddonProperty!: Sequelize.HasManyRemoveAssociationMixin<EventAddonProperty, EventAddonPropertyId>;
  removeEventAddonProperties!: Sequelize.HasManyRemoveAssociationsMixin<EventAddonProperty, EventAddonPropertyId>;
  hasEventAddonProperty!: Sequelize.HasManyHasAssociationMixin<EventAddonProperty, EventAddonPropertyId>;
  hasEventAddonProperties!: Sequelize.HasManyHasAssociationsMixin<EventAddonProperty, EventAddonPropertyId>;
  countEventAddonProperties!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany EventImages via assetId
  eventImages!: EventImages[];
  getEventImages!: Sequelize.HasManyGetAssociationsMixin<EventImages>;
  setEventImages!: Sequelize.HasManySetAssociationsMixin<EventImages, EventImagesId>;
  addEventImage!: Sequelize.HasManyAddAssociationMixin<EventImages, EventImagesId>;
  addEventImages!: Sequelize.HasManyAddAssociationsMixin<EventImages, EventImagesId>;
  createEventImage!: Sequelize.HasManyCreateAssociationMixin<EventImages>;
  removeEventImage!: Sequelize.HasManyRemoveAssociationMixin<EventImages, EventImagesId>;
  removeEventImages!: Sequelize.HasManyRemoveAssociationsMixin<EventImages, EventImagesId>;
  hasEventImage!: Sequelize.HasManyHasAssociationMixin<EventImages, EventImagesId>;
  hasEventImages!: Sequelize.HasManyHasAssociationsMixin<EventImages, EventImagesId>;
  countEventImages!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany EventNearbyAttraction via assetId
  eventNearbyAttractions!: EventNearbyAttraction[];
  getEventNearbyAttractions!: Sequelize.HasManyGetAssociationsMixin<EventNearbyAttraction>;
  setEventNearbyAttractions!: Sequelize.HasManySetAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  addEventNearbyAttraction!: Sequelize.HasManyAddAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  addEventNearbyAttractions!: Sequelize.HasManyAddAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  createEventNearbyAttraction!: Sequelize.HasManyCreateAssociationMixin<EventNearbyAttraction>;
  removeEventNearbyAttraction!: Sequelize.HasManyRemoveAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  removeEventNearbyAttractions!: Sequelize.HasManyRemoveAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  hasEventNearbyAttraction!: Sequelize.HasManyHasAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  hasEventNearbyAttractions!: Sequelize.HasManyHasAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  countEventNearbyAttractions!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany Plan via assetId
  plans!: Plan[];
  getPlans!: Sequelize.HasManyGetAssociationsMixin<Plan>;
  setPlans!: Sequelize.HasManySetAssociationsMixin<Plan, PlanId>;
  addPlan!: Sequelize.HasManyAddAssociationMixin<Plan, PlanId>;
  addPlans!: Sequelize.HasManyAddAssociationsMixin<Plan, PlanId>;
  createPlan!: Sequelize.HasManyCreateAssociationMixin<Plan>;
  removePlan!: Sequelize.HasManyRemoveAssociationMixin<Plan, PlanId>;
  removePlans!: Sequelize.HasManyRemoveAssociationsMixin<Plan, PlanId>;
  hasPlan!: Sequelize.HasManyHasAssociationMixin<Plan, PlanId>;
  hasPlans!: Sequelize.HasManyHasAssociationsMixin<Plan, PlanId>;
  countPlans!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany PlanProperty via assetId
  planProperties!: PlanProperty[];
  getPlanProperties!: Sequelize.HasManyGetAssociationsMixin<PlanProperty>;
  setPlanProperties!: Sequelize.HasManySetAssociationsMixin<PlanProperty, PlanPropertyId>;
  addPlanProperty!: Sequelize.HasManyAddAssociationMixin<PlanProperty, PlanPropertyId>;
  addPlanProperties!: Sequelize.HasManyAddAssociationsMixin<PlanProperty, PlanPropertyId>;
  createPlanProperty!: Sequelize.HasManyCreateAssociationMixin<PlanProperty>;
  removePlanProperty!: Sequelize.HasManyRemoveAssociationMixin<PlanProperty, PlanPropertyId>;
  removePlanProperties!: Sequelize.HasManyRemoveAssociationsMixin<PlanProperty, PlanPropertyId>;
  hasPlanProperty!: Sequelize.HasManyHasAssociationMixin<PlanProperty, PlanPropertyId>;
  hasPlanProperties!: Sequelize.HasManyHasAssociationsMixin<PlanProperty, PlanPropertyId>;
  countPlanProperties!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany SpeakerBio via fileId
  speakerBios!: SpeakerBio[];
  getSpeakerBios!: Sequelize.HasManyGetAssociationsMixin<SpeakerBio>;
  setSpeakerBios!: Sequelize.HasManySetAssociationsMixin<SpeakerBio, SpeakerBioId>;
  addSpeakerBio!: Sequelize.HasManyAddAssociationMixin<SpeakerBio, SpeakerBioId>;
  addSpeakerBios!: Sequelize.HasManyAddAssociationsMixin<SpeakerBio, SpeakerBioId>;
  createSpeakerBio!: Sequelize.HasManyCreateAssociationMixin<SpeakerBio>;
  removeSpeakerBio!: Sequelize.HasManyRemoveAssociationMixin<SpeakerBio, SpeakerBioId>;
  removeSpeakerBios!: Sequelize.HasManyRemoveAssociationsMixin<SpeakerBio, SpeakerBioId>;
  hasSpeakerBio!: Sequelize.HasManyHasAssociationMixin<SpeakerBio, SpeakerBioId>;
  hasSpeakerBios!: Sequelize.HasManyHasAssociationsMixin<SpeakerBio, SpeakerBioId>;
  countSpeakerBios!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany Sponsor via logoAssetId
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
  // Asset hasMany Sponsor via bannerImgAssetId
  bannerImgAssetSponsors!: Sponsor[];
  getBannerImgAssetSponsors!: Sequelize.HasManyGetAssociationsMixin<Sponsor>;
  setBannerImgAssetSponsors!: Sequelize.HasManySetAssociationsMixin<Sponsor, SponsorId>;
  addBannerImgAssetSponsor!: Sequelize.HasManyAddAssociationMixin<Sponsor, SponsorId>;
  addBannerImgAssetSponsors!: Sequelize.HasManyAddAssociationsMixin<Sponsor, SponsorId>;
  createBannerImgAssetSponsor!: Sequelize.HasManyCreateAssociationMixin<Sponsor>;
  removeBannerImgAssetSponsor!: Sequelize.HasManyRemoveAssociationMixin<Sponsor, SponsorId>;
  removeBannerImgAssetSponsors!: Sequelize.HasManyRemoveAssociationsMixin<Sponsor, SponsorId>;
  hasBannerImgAssetSponsor!: Sequelize.HasManyHasAssociationMixin<Sponsor, SponsorId>;
  hasBannerImgAssetSponsors!: Sequelize.HasManyHasAssociationsMixin<Sponsor, SponsorId>;
  countBannerImgAssetSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany Template via assetId
  templates!: Template[];
  getTemplates!: Sequelize.HasManyGetAssociationsMixin<Template>;
  setTemplates!: Sequelize.HasManySetAssociationsMixin<Template, TemplateId>;
  addTemplate!: Sequelize.HasManyAddAssociationMixin<Template, TemplateId>;
  addTemplates!: Sequelize.HasManyAddAssociationsMixin<Template, TemplateId>;
  createTemplate!: Sequelize.HasManyCreateAssociationMixin<Template>;
  removeTemplate!: Sequelize.HasManyRemoveAssociationMixin<Template, TemplateId>;
  removeTemplates!: Sequelize.HasManyRemoveAssociationsMixin<Template, TemplateId>;
  hasTemplate!: Sequelize.HasManyHasAssociationMixin<Template, TemplateId>;
  hasTemplates!: Sequelize.HasManyHasAssociationsMixin<Template, TemplateId>;
  countTemplates!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany User via assetId
  assetUsers!: User[];
  getAssetUsers!: Sequelize.HasManyGetAssociationsMixin<User>;
  setAssetUsers!: Sequelize.HasManySetAssociationsMixin<User, UserId>;
  addAssetUser!: Sequelize.HasManyAddAssociationMixin<User, UserId>;
  addAssetUsers!: Sequelize.HasManyAddAssociationsMixin<User, UserId>;
  createAssetUser!: Sequelize.HasManyCreateAssociationMixin<User>;
  removeAssetUser!: Sequelize.HasManyRemoveAssociationMixin<User, UserId>;
  removeAssetUsers!: Sequelize.HasManyRemoveAssociationsMixin<User, UserId>;
  hasAssetUser!: Sequelize.HasManyHasAssociationMixin<User, UserId>;
  hasAssetUsers!: Sequelize.HasManyHasAssociationsMixin<User, UserId>;
  countAssetUsers!: Sequelize.HasManyCountAssociationsMixin;
  // Asset hasMany UserAbstract via assetId
  userAbstracts!: UserAbstract[];
  getUserAbstracts!: Sequelize.HasManyGetAssociationsMixin<UserAbstract>;
  setUserAbstracts!: Sequelize.HasManySetAssociationsMixin<UserAbstract, UserAbstractId>;
  addUserAbstract!: Sequelize.HasManyAddAssociationMixin<UserAbstract, UserAbstractId>;
  addUserAbstracts!: Sequelize.HasManyAddAssociationsMixin<UserAbstract, UserAbstractId>;
  createUserAbstract!: Sequelize.HasManyCreateAssociationMixin<UserAbstract>;
  removeUserAbstract!: Sequelize.HasManyRemoveAssociationMixin<UserAbstract, UserAbstractId>;
  removeUserAbstracts!: Sequelize.HasManyRemoveAssociationsMixin<UserAbstract, UserAbstractId>;
  hasUserAbstract!: Sequelize.HasManyHasAssociationMixin<UserAbstract, UserAbstractId>;
  hasUserAbstracts!: Sequelize.HasManyHasAssociationsMixin<UserAbstract, UserAbstractId>;
  countUserAbstracts!: Sequelize.HasManyCountAssociationsMixin;
  // Asset belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Asset belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Asset {
    return Asset.init({
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'mime_type'
    },
    sourcePath: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'source_path'
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      },
      field: 'company_id'
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
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    }
  }, {
    sequelize,
    tableName: 'asset',
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
        name: "fk_company_id",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "asset_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
