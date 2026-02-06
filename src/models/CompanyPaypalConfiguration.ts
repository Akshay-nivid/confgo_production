import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { CompanyPaypalConfigurationStatus, CompanyPaypalConfigurationStatusId } from './CompanyPaypalConfigurationStatus';
import type { Event, EventId } from './Event';
import type { User, UserId } from './User';

export interface CompanyPaypalConfigurationAttributes {
  id: number;
  companyId: number;
  userId: number;
  clientId: string;
  currency: string;
  eventId?: number;
  statusId: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export type CompanyPaypalConfigurationPk = "id";
export type CompanyPaypalConfigurationId = CompanyPaypalConfiguration[CompanyPaypalConfigurationPk];
export type CompanyPaypalConfigurationOptionalAttributes = "id" | "eventId" | "createdOn" | "modifiedBy" | "modifiedOn";
export type CompanyPaypalConfigurationCreationAttributes = Optional<CompanyPaypalConfigurationAttributes, CompanyPaypalConfigurationOptionalAttributes>;

export class CompanyPaypalConfiguration extends Model<CompanyPaypalConfigurationAttributes, CompanyPaypalConfigurationCreationAttributes> implements CompanyPaypalConfigurationAttributes {
  id!: number;
  companyId!: number;
  userId!: number;
  clientId!: string;
  currency!: string;
  eventId?: number;
  statusId!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;

  // CompanyPaypalConfiguration belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // CompanyPaypalConfiguration belongsTo CompanyPaypalConfigurationStatus via statusId
  status!: CompanyPaypalConfigurationStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<CompanyPaypalConfigurationStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<CompanyPaypalConfigurationStatus, CompanyPaypalConfigurationStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<CompanyPaypalConfigurationStatus>;
  // CompanyPaypalConfiguration belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // CompanyPaypalConfiguration belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompanyPaypalConfiguration {
    return CompanyPaypalConfiguration.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      },
      field: 'company_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    clientId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'client_id'
    },
    currency: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'event_id'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company_paypal_configuration_status',
        key: 'id'
      },
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
    tableName: 'company_paypal_configuration',
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
        name: "company_paypal_configuration_company_FK_idx",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "company_paypal_configuration_user_FK_idx",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "company_paypal_configuration_event_FK_idx",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "company_paypal_configuration_status_FK_idx",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
    ]
  });
  }
}
