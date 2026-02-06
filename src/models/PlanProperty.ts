import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { ExtraPricing, ExtraPricingId } from './ExtraPricing';
import type {
  PlanPropertyAssignment,
  PlanPropertyAssignmentId,
} from './PlanPropertyAssignment';
import type {
  PlanPropertyGroup,
  PlanPropertyGroupId,
} from './PlanPropertyGroup';
import type {
  PlanPropertyStatus,
  PlanPropertyStatusId,
} from './PlanPropertyStatus';
import type { UsageRecord, UsageRecordId } from './UsageRecord';

export interface PlanPropertyAttributes {
  id: number;
  name: string;
  code: string;
  value: string;
  description?: string;
  statusId?: number;
  assetId?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type PlanPropertyPk = 'id';
export type PlanPropertyId = PlanProperty[PlanPropertyPk];
export type PlanPropertyOptionalAttributes =
  | 'id'
  | 'description'
  | 'statusId'
  | 'assetId'
  | 'createdOn'
  | 'modifiedBy'
  | 'modifiedOn';
export type PlanPropertyCreationAttributes = Optional<
  PlanPropertyAttributes,
  PlanPropertyOptionalAttributes
>;

export class PlanProperty
  extends Model<PlanPropertyAttributes, PlanPropertyCreationAttributes>
  implements PlanPropertyAttributes
{
  id!: number;
  name!: string;
  code!: string;
  value!: string;
  description?: string;
  statusId?: number;
  assetId?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // PlanProperty belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // PlanProperty hasMany ExtraPricing via planPropertyId
  extraPricings!: ExtraPricing[];
  getExtraPricings!: Sequelize.HasManyGetAssociationsMixin<ExtraPricing>;
  setExtraPricings!: Sequelize.HasManySetAssociationsMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  addExtraPricing!: Sequelize.HasManyAddAssociationMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  addExtraPricings!: Sequelize.HasManyAddAssociationsMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  createExtraPricing!: Sequelize.HasManyCreateAssociationMixin<ExtraPricing>;
  removeExtraPricing!: Sequelize.HasManyRemoveAssociationMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  removeExtraPricings!: Sequelize.HasManyRemoveAssociationsMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  hasExtraPricing!: Sequelize.HasManyHasAssociationMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  hasExtraPricings!: Sequelize.HasManyHasAssociationsMixin<
    ExtraPricing,
    ExtraPricingId
  >;
  countExtraPricings!: Sequelize.HasManyCountAssociationsMixin;
  // PlanProperty hasMany PlanPropertyAssignment via planPropertyId
  planPropertyAssignments!: PlanPropertyAssignment[];
  getPlanPropertyAssignments!: Sequelize.HasManyGetAssociationsMixin<PlanPropertyAssignment>;
  setPlanPropertyAssignments!: Sequelize.HasManySetAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  addPlanPropertyAssignment!: Sequelize.HasManyAddAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  addPlanPropertyAssignments!: Sequelize.HasManyAddAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  createPlanPropertyAssignment!: Sequelize.HasManyCreateAssociationMixin<PlanPropertyAssignment>;
  removePlanPropertyAssignment!: Sequelize.HasManyRemoveAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  removePlanPropertyAssignments!: Sequelize.HasManyRemoveAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  hasPlanPropertyAssignment!: Sequelize.HasManyHasAssociationMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  hasPlanPropertyAssignments!: Sequelize.HasManyHasAssociationsMixin<
    PlanPropertyAssignment,
    PlanPropertyAssignmentId
  >;
  countPlanPropertyAssignments!: Sequelize.HasManyCountAssociationsMixin;
  // PlanProperty hasMany PlanPropertyGroup via planPropertyId
  planPropertyGroups!: PlanPropertyGroup[];
  getPlanPropertyGroups!: Sequelize.HasManyGetAssociationsMixin<PlanPropertyGroup>;
  setPlanPropertyGroups!: Sequelize.HasManySetAssociationsMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  addPlanPropertyGroup!: Sequelize.HasManyAddAssociationMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  addPlanPropertyGroups!: Sequelize.HasManyAddAssociationsMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  createPlanPropertyGroup!: Sequelize.HasManyCreateAssociationMixin<PlanPropertyGroup>;
  removePlanPropertyGroup!: Sequelize.HasManyRemoveAssociationMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  removePlanPropertyGroups!: Sequelize.HasManyRemoveAssociationsMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  hasPlanPropertyGroup!: Sequelize.HasManyHasAssociationMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  hasPlanPropertyGroups!: Sequelize.HasManyHasAssociationsMixin<
    PlanPropertyGroup,
    PlanPropertyGroupId
  >;
  countPlanPropertyGroups!: Sequelize.HasManyCountAssociationsMixin;
  // PlanProperty hasMany UsageRecord via planPropertyId
  usageRecords!: UsageRecord[];
  getUsageRecords!: Sequelize.HasManyGetAssociationsMixin<UsageRecord>;
  setUsageRecords!: Sequelize.HasManySetAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  addUsageRecord!: Sequelize.HasManyAddAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  addUsageRecords!: Sequelize.HasManyAddAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  createUsageRecord!: Sequelize.HasManyCreateAssociationMixin<UsageRecord>;
  removeUsageRecord!: Sequelize.HasManyRemoveAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  removeUsageRecords!: Sequelize.HasManyRemoveAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  hasUsageRecord!: Sequelize.HasManyHasAssociationMixin<
    UsageRecord,
    UsageRecordId
  >;
  hasUsageRecords!: Sequelize.HasManyHasAssociationsMixin<
    UsageRecord,
    UsageRecordId
  >;
  countUsageRecords!: Sequelize.HasManyCountAssociationsMixin;
  // PlanProperty belongsTo PlanPropertyStatus via statusId
  status!: PlanPropertyStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<PlanPropertyStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    PlanPropertyStatus,
    PlanPropertyStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<PlanPropertyStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof PlanProperty {
    return PlanProperty.init(
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
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: 'code',
        },
        value: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'plan_property_status',
            key: 'id',
          },
          field: 'status_id',
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
          allowNull: true,
          field: 'modified_by',
        },
        modifiedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'modified_on',
        },
      },
      {
        sequelize,
        tableName: 'plan_property',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'code',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'code' }],
          },
          {
            name: 'id',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'plan_property_asset_FK',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
          {
            name: 'plan_property_asset_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
        ],
      }
    );
  }
}
