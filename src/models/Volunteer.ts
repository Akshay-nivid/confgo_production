import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { User, UserId } from './User';
import type { VolunteerEvent, VolunteerEventId } from './VolunteerEvent';
import type { VolunteerStatus, VolunteerStatusId } from './VolunteerStatus';

export interface VolunteerAttributes {
  id: number;
  companyId: number;
  userId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  statusId?: number;
}

export type VolunteerPk = 'id';
export type VolunteerId = Volunteer[VolunteerPk];
export type VolunteerOptionalAttributes =
  | 'id'
  | 'userId'
  | 'createdOn'
  | 'modifiedOn'
  | 'statusId';
export type VolunteerCreationAttributes = Optional<
  VolunteerAttributes,
  VolunteerOptionalAttributes
>;

export class Volunteer
  extends Model<VolunteerAttributes, VolunteerCreationAttributes>
  implements VolunteerAttributes
{
  id!: number;
  companyId!: number;
  userId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  statusId?: number;

  // Volunteer belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Volunteer belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // Volunteer hasMany VolunteerEvent via volunteerId
  volunteerEvents!: VolunteerEvent[];
  getVolunteerEvents!: Sequelize.HasManyGetAssociationsMixin<VolunteerEvent>;
  setVolunteerEvents!: Sequelize.HasManySetAssociationsMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  addVolunteerEvent!: Sequelize.HasManyAddAssociationMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  addVolunteerEvents!: Sequelize.HasManyAddAssociationsMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  createVolunteerEvent!: Sequelize.HasManyCreateAssociationMixin<VolunteerEvent>;
  removeVolunteerEvent!: Sequelize.HasManyRemoveAssociationMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  removeVolunteerEvents!: Sequelize.HasManyRemoveAssociationsMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  hasVolunteerEvent!: Sequelize.HasManyHasAssociationMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  hasVolunteerEvents!: Sequelize.HasManyHasAssociationsMixin<
    VolunteerEvent,
    VolunteerEventId
  >;
  countVolunteerEvents!: Sequelize.HasManyCountAssociationsMixin;
  // Volunteer belongsTo VolunteerStatus via statusId
  status!: VolunteerStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<VolunteerStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    VolunteerStatus,
    VolunteerStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<VolunteerStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Volunteer {
    return Volunteer.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
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
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'volunteer_status',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'volunteer',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'company_ibfk_1_idx',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'user_ibfk_2_idx',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'volunteer_ibfk_status',
            using: 'BTREE',
            fields: [{ name: 'statusId' }],
          },
        ],
      }
    );
  }
}
