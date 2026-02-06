import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { CompanyPaypalConfiguration, CompanyPaypalConfigurationId } from './CompanyPaypalConfiguration';

export interface CompanyPaypalConfigurationStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type CompanyPaypalConfigurationStatusPk = "id";
export type CompanyPaypalConfigurationStatusId = CompanyPaypalConfigurationStatus[CompanyPaypalConfigurationStatusPk];
export type CompanyPaypalConfigurationStatusOptionalAttributes = "id" | "description";
export type CompanyPaypalConfigurationStatusCreationAttributes = Optional<CompanyPaypalConfigurationStatusAttributes, CompanyPaypalConfigurationStatusOptionalAttributes>;

export class CompanyPaypalConfigurationStatus extends Model<CompanyPaypalConfigurationStatusAttributes, CompanyPaypalConfigurationStatusCreationAttributes> implements CompanyPaypalConfigurationStatusAttributes {
  id!: number;
  statusName!: string;
  description?: string;

  // CompanyPaypalConfigurationStatus hasMany CompanyPaypalConfiguration via statusId
  companyPaypalConfigurations!: CompanyPaypalConfiguration[];
  getCompanyPaypalConfigurations!: Sequelize.HasManyGetAssociationsMixin<CompanyPaypalConfiguration>;
  setCompanyPaypalConfigurations!: Sequelize.HasManySetAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  addCompanyPaypalConfiguration!: Sequelize.HasManyAddAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  addCompanyPaypalConfigurations!: Sequelize.HasManyAddAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  createCompanyPaypalConfiguration!: Sequelize.HasManyCreateAssociationMixin<CompanyPaypalConfiguration>;
  removeCompanyPaypalConfiguration!: Sequelize.HasManyRemoveAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  removeCompanyPaypalConfigurations!: Sequelize.HasManyRemoveAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  hasCompanyPaypalConfiguration!: Sequelize.HasManyHasAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  hasCompanyPaypalConfigurations!: Sequelize.HasManyHasAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  countCompanyPaypalConfigurations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompanyPaypalConfigurationStatus {
    return CompanyPaypalConfigurationStatus.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'company_paypal_configuration_status',
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
