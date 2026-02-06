import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { User } from "./User";
import type { Event } from "./Event";

export interface MeetingMetadataAttributes {
  id: number;
  userId: number;
  eventId: number;
  meetingUniqueId: string;
  moderator?: number;
  url?: string;
  status?: number;
  isAttended?: number;
}

export type MeetingMetadataPk = "id";
export type MeetingMetadataId = MeetingMetadata[MeetingMetadataPk];
export type MeetingMetadataOptionalAttributes = "id" | "moderator" | "meetingUniqueId" | "status" | "isAttended" | "url";
export type MeetingMetadataCreationAttributes = Optional<MeetingMetadataAttributes, MeetingMetadataOptionalAttributes>;

export class MeetingMetadata extends Model<MeetingMetadataAttributes, MeetingMetadataCreationAttributes> implements MeetingMetadataAttributes {
  id!: number;
  userId!: number;
  eventId!: number;
  meetingUniqueId!: string;
  moderator?: number;
  url?: string;
  status?: number;
  isAttended?: number;

  public user?: User;
  public event?: Event;

  static initModel(sequelize: Sequelize.Sequelize): typeof MeetingMetadata {
    return MeetingMetadata.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        meetingUniqueId: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        moderator: {
          type: DataTypes.TINYINT,
          allowNull: true,
          defaultValue: 0,
        },
        isAttended: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        url: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "meeting_metadata",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "fk_meeting_user",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "fk_meeting_event",
            using: "BTREE",
            fields: [{ name: "eventId" }],
          },
        ],
      }
    );
  }
}
