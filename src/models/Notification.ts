import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';
import type { User, UserId } from './User';

export interface NotificationAttributes {
  id: number;
  eventId?: number;
  userId?: number;
  templateId?: number;
  recipient?: string;
  metadata?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  sendStatus: number;
  sendCount?: number;
  type?: 'EMAIL' | 'PUSH';
  instantNotification?: number;
}

export type NotificationPk = "id";
export type NotificationId = Notification[NotificationPk];
export type NotificationOptionalAttributes = "id" | "eventId" | "userId" | "templateId" | "recipient" | "metadata" | "createdOn" | "modifiedOn" | "sendCount" | "type" | "instantNotification";
export type NotificationCreationAttributes = Optional<NotificationAttributes, NotificationOptionalAttributes>;

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  id!: number;
  eventId?: number;
  userId?: number;
  templateId?: number;
  recipient?: string;
  metadata?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  sendStatus!: number;
  sendCount?: number;
  type?: 'EMAIL' | 'PUSH';
  instantNotification?: number;

  // Notification belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Notification belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Notification {
    return Notification.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      },
      field: 'user_id'
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'template_id'
    },
    recipient: {
      type: DataTypes.STRING(225),
      allowNull: true
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true
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
    },
    sendStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'send_status'
    },
    sendCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'send_count'
    },
    type: {
      type: DataTypes.ENUM('EMAIL','PUSH'),
      allowNull: true,
      defaultValue: "EMAIL"
    },
    instantNotification: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      field: 'instant_notification'
    }
  }, {
    sequelize,
    tableName: 'notification',
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
        name: "event_id",
        using: "BTREE",
        fields: [
          { name: "event_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
