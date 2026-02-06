import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { Participant, ParticipantId } from './Participant';

export interface ParticipantGroupAttributes {
  id: number;
  name: string;
  participantId: number;
  companyId: number;
  tag?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type ParticipantGroupPk = 'id';
export type ParticipantGroupId = ParticipantGroup[ParticipantGroupPk];
export type ParticipantGroupOptionalAttributes =
  | 'id'
  | 'tag'
  | 'createdOn'
  | 'modifiedOn';
export type ParticipantGroupCreationAttributes = Optional<
  ParticipantGroupAttributes,
  ParticipantGroupOptionalAttributes
>;

export class ParticipantGroup
  extends Model<ParticipantGroupAttributes, ParticipantGroupCreationAttributes>
  implements ParticipantGroupAttributes
{
  id!: number;
  name!: string;
  participantId!: number;
  companyId!: number;
  tag?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // ParticipantGroup belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // ParticipantGroup belongsTo Participant via participantId
  participant!: Participant;
  getParticipant!: Sequelize.BelongsToGetAssociationMixin<Participant>;
  setParticipant!: Sequelize.BelongsToSetAssociationMixin<
    Participant,
    ParticipantId
  >;
  createParticipant!: Sequelize.BelongsToCreateAssociationMixin<Participant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ParticipantGroup {
    return ParticipantGroup.init(
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
        participantId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'participant',
            key: 'id',
          },
          field: 'participant_id',
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
        tag: {
          type: DataTypes.STRING(50),
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
        tableName: 'participant_group',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'participant_id',
            using: 'BTREE',
            fields: [{ name: 'participant_id' }],
          },
          {
            name: 'company_id',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
        ],
      }
    );
  }
}
