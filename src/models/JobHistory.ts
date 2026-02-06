import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { JobHistoryStatus, JobHistoryStatusId } from './JobHistoryStatus';

export interface JobHistoryAttributes {
  id: number;
  job?: string;
  statusId?: number;
  startedOn: Date;
  completedOn?: Date;
  runType?: string;
  description?: string;
  uniqueJob?: string;
}

export type JobHistoryPk = 'id';
export type JobHistoryId = JobHistory[JobHistoryPk];
export type JobHistoryOptionalAttributes =
  | 'id'
  | 'job'
  | 'statusId'
  | 'completedOn'
  | 'runType'
  | 'description'
  | 'uniqueJob';
export type JobHistoryCreationAttributes = Optional<
  JobHistoryAttributes,
  JobHistoryOptionalAttributes
>;

export class JobHistory
  extends Model<JobHistoryAttributes, JobHistoryCreationAttributes>
  implements JobHistoryAttributes
{
  id!: number;
  job?: string;
  statusId?: number;
  startedOn!: Date;
  completedOn?: Date;
  runType?: string;
  description?: string;
  uniqueJob?: string;

  // JobHistory belongsTo JobHistoryStatus via statusId
  status!: JobHistoryStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<JobHistoryStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    JobHistoryStatus,
    JobHistoryStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<JobHistoryStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof JobHistory {
    return JobHistory.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        job: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'job_history_status',
            key: 'id',
          },
          field: 'status_id',
        },
        startedOn: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'started_on',
        },
        completedOn: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'completed_on',
        },
        runType: {
          type: DataTypes.STRING(45),
          allowNull: true,
          field: 'run_type',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        uniqueJob: {
          type: DataTypes.STRING(100),
          allowNull: true,
          unique: 'unique_job',
          field: 'unique_job',
        },
      },
      {
        sequelize,
        tableName: 'job_history',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_job',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'unique_job' }],
          },
          {
            name: 'job_history_job_history_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
