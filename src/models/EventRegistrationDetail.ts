import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { Event, EventId } from './Event';
import type {
  EventRegistrationDetailStatus,
  EventRegistrationDetailStatusId,
} from './EventRegistrationDetailStatus';

export interface EventRegistrationDetailAttributes {
  id: number;
  companyId: number;
  eventId: number;
  email?: string;
  phone: string;
  gender: string;
  participantType: string;
  metadata?: string;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type EventRegistrationDetailPk = 'id';
export type EventRegistrationDetailId =
  EventRegistrationDetail[EventRegistrationDetailPk];
export type EventRegistrationDetailOptionalAttributes =
  | 'id'
  | 'email'
  | 'metadata'
  | 'statusId'
  | 'createdOn'
  | 'modifiedOn';
export type EventRegistrationDetailCreationAttributes = Optional<
  EventRegistrationDetailAttributes,
  EventRegistrationDetailOptionalAttributes
>;

export class EventRegistrationDetail
  extends Model<
    EventRegistrationDetailAttributes,
    EventRegistrationDetailCreationAttributes
  >
  implements EventRegistrationDetailAttributes
{
  id!: number;
  companyId!: number;
  eventId!: number;
  email?: string;
  phone!: string;
  gender!: string;
  participantType!: string;
  metadata?: string;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // EventRegistrationDetail belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // EventRegistrationDetail belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // EventRegistrationDetail belongsTo EventRegistrationDetailStatus via statusId
  status!: EventRegistrationDetailStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<EventRegistrationDetailStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    EventRegistrationDetailStatus,
    EventRegistrationDetailStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<EventRegistrationDetailStatus>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof EventRegistrationDetail {
    return EventRegistrationDetail.init(
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
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'event_id',
        },
        email: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        gender: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        participantType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'participant_type',
        },
        metadata: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'event_registration_detail_status',
            key: 'id',
          },
          field: 'status_id',
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
        tableName: 'event_registration_detail',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'event_registration_detail_event_registration_detail_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
          {
            name: 'company_id',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'event_id',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
        ],
      }
    );
  }
}
