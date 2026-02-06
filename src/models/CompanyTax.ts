import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './User';

export interface CompanyTaxAttributes {
  id: number;
  companyId?: number;
  taxName: string;
  description?: string;
  taxPercentage: string;
  taxInclusive: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type CompanyTaxPk = "id";
export type CompanyTaxId = CompanyTax[CompanyTaxPk];
export type CompanyTaxOptionalAttributes = "id" | "companyId" | "description" | "taxInclusive" | "createdOn" | "modifiedOn";
export type CompanyTaxCreationAttributes = Optional<CompanyTaxAttributes, CompanyTaxOptionalAttributes>;

export class CompanyTax extends Model<CompanyTaxAttributes, CompanyTaxCreationAttributes> implements CompanyTaxAttributes {
  id!: number;
  companyId?: number;
  taxName!: string;
  description?: string;
  taxPercentage!: string;
  taxInclusive!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // CompanyTax belongsTo User via companyId
  company!: User;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<User>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompanyTax {
    return CompanyTax.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    taxName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tax_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    taxPercentage: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tax_percentage'
    },
    taxInclusive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'tax_inclusive'
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
    }
  }, {
    sequelize,
    tableName: 'company_tax',
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
        name: "company_id",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
    ]
  });
  }
}
