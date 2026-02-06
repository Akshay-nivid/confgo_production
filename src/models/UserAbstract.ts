import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Event, EventId } from './Event';
import type { User, UserId } from './User';
import type {
  UserAbstractStatus,
  UserAbstractStatusId,
} from './UserAbstractStatus';

export interface UserAbstractAttributes {
  id: number;
  eventId: number;
  userId: number;
  assetId: string;
  reviewerId?: number;
  comment?: string;
  rating?: number;
  isReviewed?: number;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type UserAbstractPk = 'id';
export type UserAbstractId = UserAbstract[UserAbstractPk];
export type UserAbstractOptionalAttributes =
  | 'id'
  | 'reviewerId'
  | 'comment'
  | 'rating'
  | 'isReviewed'
  | 'statusId'
  | 'createdOn'
  | 'modifiedOn';
export type UserAbstractCreationAttributes = Optional<
  UserAbstractAttributes,
  UserAbstractOptionalAttributes
>;

export class UserAbstract
  extends Model<UserAbstractAttributes, UserAbstractCreationAttributes>
  implements UserAbstractAttributes
{
  id!: number;
  eventId!: number;
  userId!: number;
  assetId!: string;
  reviewerId?: number;
  comment?: string;
  rating?: number;
  isReviewed?: number;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // UserAbstract belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // UserAbstract belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // UserAbstract belongsTo User via reviewerId
  reviewer!: User;
  getReviewer!: Sequelize.BelongsToGetAssociationMixin<User>;
  setReviewer!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createReviewer!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // UserAbstract belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;
  // UserAbstract belongsTo UserAbstractStatus via statusId
  status!: UserAbstractStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<UserAbstractStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    UserAbstractStatus,
    UserAbstractStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<UserAbstractStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserAbstract {
    return UserAbstract.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
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
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        assetId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          references: {
            model: 'asset',
            key: 'id',
          },
          field: 'asset_id',
        },
        reviewerId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'reviewer_id',
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        isReviewed: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
          field: 'is_reviewed',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'user_abstract_status',
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
        tableName: 'user_abstract',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'idx_user_abstract_event_id',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'idx_user_abstract_user_id',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
          {
            name: 'user_abstract_asset_new_FK_idx',
            using: 'BTREE',
            fields: [{ name: 'asset_id' }],
          },
          {
            name: 'idx_user_abstract_reviewer_id',
            using: 'BTREE',
            fields: [{ name: 'reviewer_id' }],
          },
          {
            name: 'idx_user_abstract_status_id',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
