import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Company, CompanyId } from './Company';
import type { EventAddon, EventAddonId } from './EventAddon';

export interface AddonAttributes {
  id: number;
  name: string;
  description?: string;
  companyId?: number;
  owner: string;
  enabled?: number;
  assetId?: string;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;
}

export type AddonPk = 'id';
export type AddonId = Addon[AddonPk];
export type AddonOptionalAttributes =
  | 'id'
  | 'description'
  | 'companyId'
  | 'owner'
  | 'enabled'
  | 'assetId'
  | 'createdOn'
  | 'createdBy'
  | 'modifiedOn'
  | 'modifiedBy';
export type AddonCreationAttributes = Optional<
  AddonAttributes,
  AddonOptionalAttributes
>;

export class Addon
  extends Model<AddonAttributes, AddonCreationAttributes>
  implements AddonAttributes
{
  id!: number;
  name!: string;
  description?: string;
  companyId?: number;
  owner!: string;
  enabled?: number;
  assetId?: string;
  createdOn?: Date;
  createdBy?: number;
  modifiedOn?: Date;
  modifiedBy?: number;

  // Addon hasMany EventAddon via addonId
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
  // Addon belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Addon belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Addon {
    return Addon.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'company',
            key: 'id',
          },
          field: 'company_id',
        },
        owner: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'ADMIN',
        },
        enabled: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
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
        createdOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_on',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'created_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'modified_on',
        },
        modifiedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'modified_by',
        },
      },
      {
        sequelize,
        tableName: 'addon',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'addon_asset_idFK_1_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
          {
            name: 'addon_company_idFK_2_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
        ],
      }
    );
  }
}
