import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { ExtraPricing, ExtraPricingId } from './ExtraPricing';

export interface ExtraPricingStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type ExtraPricingStatusPk = 'id';
export type ExtraPricingStatusId = ExtraPricingStatus[ExtraPricingStatusPk];
export type ExtraPricingStatusOptionalAttributes = 'id' | 'description';
export type ExtraPricingStatusCreationAttributes = Optional<
  ExtraPricingStatusAttributes,
  ExtraPricingStatusOptionalAttributes
>;

export class ExtraPricingStatus
  extends Model<
    ExtraPricingStatusAttributes,
    ExtraPricingStatusCreationAttributes
  >
  implements ExtraPricingStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // ExtraPricingStatus hasMany ExtraPricing via statusId
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

  static initModel(sequelize: Sequelize.Sequelize): typeof ExtraPricingStatus {
    return ExtraPricingStatus.init(
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
        tableName: 'extra_pricing_status',
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
