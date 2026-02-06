import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { JobHistory, JobHistoryId } from './JobHistory';

export interface JobHistoryStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type JobHistoryStatusPk = 'id';
export type JobHistoryStatusId = JobHistoryStatus[JobHistoryStatusPk];
export type JobHistoryStatusOptionalAttributes = 'id' | 'description';
export type JobHistoryStatusCreationAttributes = Optional<
  JobHistoryStatusAttributes,
  JobHistoryStatusOptionalAttributes
>;

export class JobHistoryStatus
  extends Model<JobHistoryStatusAttributes, JobHistoryStatusCreationAttributes>
  implements JobHistoryStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // JobHistoryStatus hasMany JobHistory via statusId
  jobHistories!: JobHistory[];
  getJobHistories!: Sequelize.HasManyGetAssociationsMixin<JobHistory>;
  setJobHistories!: Sequelize.HasManySetAssociationsMixin<
    JobHistory,
    JobHistoryId
  >;
  addJobHistory!: Sequelize.HasManyAddAssociationMixin<
    JobHistory,
    JobHistoryId
  >;
  addJobHistories!: Sequelize.HasManyAddAssociationsMixin<
    JobHistory,
    JobHistoryId
  >;
  createJobHistory!: Sequelize.HasManyCreateAssociationMixin<JobHistory>;
  removeJobHistory!: Sequelize.HasManyRemoveAssociationMixin<
    JobHistory,
    JobHistoryId
  >;
  removeJobHistories!: Sequelize.HasManyRemoveAssociationsMixin<
    JobHistory,
    JobHistoryId
  >;
  hasJobHistory!: Sequelize.HasManyHasAssociationMixin<
    JobHistory,
    JobHistoryId
  >;
  hasJobHistories!: Sequelize.HasManyHasAssociationsMixin<
    JobHistory,
    JobHistoryId
  >;
  countJobHistories!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof JobHistoryStatus {
    return JobHistoryStatus.init(
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
        tableName: 'job_history_status',
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
