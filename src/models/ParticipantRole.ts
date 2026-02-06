import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';

export interface ParticipantRoleAttributes {
  id: number;
  roleName: string;
  companyId: number;
  owner: string;
  description?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type ParticipantRolePk = 'id';
export type ParticipantRoleId = ParticipantRole[ParticipantRolePk];
export type ParticipantRoleOptionalAttributes =
  | 'id'
  | 'description'
  | 'createdOn'
  | 'modifiedOn';
export type ParticipantRoleCreationAttributes = Optional<
  ParticipantRoleAttributes,
  ParticipantRoleOptionalAttributes
>;

export class ParticipantRole
  extends Model<ParticipantRoleAttributes, ParticipantRoleCreationAttributes>
  implements ParticipantRoleAttributes
{
  id!: number;
  roleName!: string;
  companyId!: number;
  owner!: string;
  description?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // ParticipantRole belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ParticipantRole {
    return ParticipantRole.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        roleName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'role_name',
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'company',
            key: 'id',
          },
          field: 'company_id',
        },
        owner: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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
          allowNull: false,
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
        tableName: 'participant_role',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'participant_role_company_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
        ],
      }
    );
  }
}
