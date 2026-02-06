import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Event, EventId } from './Event';

export interface TemplateAttributes {
  id: number;
  name: string;
  description?: string;
  assetId?: string;
  enabled: number;
  isDefault: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export type TemplatePk = 'id';
export type TemplateId = Template[TemplatePk];
export type TemplateOptionalAttributes =
  | 'id'
  | 'description'
  | 'assetId'
  | 'enabled'
  | 'isDefault'
  | 'createdOn'
  | 'modifiedOn';
export type TemplateCreationAttributes = Optional<
  TemplateAttributes,
  TemplateOptionalAttributes
>;

export class Template
  extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes
{
  id!: number;
  name!: string;
  description?: string;
  assetId?: string;
  enabled!: number;
  isDefault!: number;
  createdBy!: number;
  createdOn!: Date;
  modifiedBy!: number;
  modifiedOn!: Date;

  // Template belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Template hasMany Event via templateId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Template {
    return Template.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        enabled: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 1,
        },
        isDefault: {
          type: DataTypes.TINYINT,
          allowNull: false,
          defaultValue: 0,
          field: 'is_default',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'created_by',
        },
        createdOn: {
          type: DataTypes.DATE,
          allowNull: false,
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
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'template',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'template_asset_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
        ],
      }
    );
  }
}
