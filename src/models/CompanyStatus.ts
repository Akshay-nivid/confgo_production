import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';

export interface CompanyStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type CompanyStatusPk = 'id';
export type CompanyStatusId = CompanyStatus[CompanyStatusPk];
export type CompanyStatusOptionalAttributes = 'id' | 'description';
export type CompanyStatusCreationAttributes = Optional<
  CompanyStatusAttributes,
  CompanyStatusOptionalAttributes
>;

export class CompanyStatus
  extends Model<CompanyStatusAttributes, CompanyStatusCreationAttributes>
  implements CompanyStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // CompanyStatus hasMany Company via statusId
  companies!: Company[];
  getCompanies!: Sequelize.HasManyGetAssociationsMixin<Company>;
  setCompanies!: Sequelize.HasManySetAssociationsMixin<Company, CompanyId>;
  addCompany!: Sequelize.HasManyAddAssociationMixin<Company, CompanyId>;
  addCompanies!: Sequelize.HasManyAddAssociationsMixin<Company, CompanyId>;
  createCompany!: Sequelize.HasManyCreateAssociationMixin<Company>;
  removeCompany!: Sequelize.HasManyRemoveAssociationMixin<Company, CompanyId>;
  removeCompanies!: Sequelize.HasManyRemoveAssociationsMixin<
    Company,
    CompanyId
  >;
  hasCompany!: Sequelize.HasManyHasAssociationMixin<Company, CompanyId>;
  hasCompanies!: Sequelize.HasManyHasAssociationsMixin<Company, CompanyId>;
  countCompanies!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompanyStatus {
    return CompanyStatus.init(
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
        tableName: 'company_status',
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
