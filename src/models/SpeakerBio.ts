import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { EventSpeaker, EventSpeakerId } from './EventSpeaker';

export interface SpeakerBioAttributes {
  id: number;
  eventSpeakerId: number;
  description?: string;
  isModerator: number;
  designation?: string;
  fileId?: string;
  startTime?: Date;
  endTime?: Date;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type SpeakerBioPk = "id";
export type SpeakerBioId = SpeakerBio[SpeakerBioPk];
export type SpeakerBioOptionalAttributes = "id" | "description" | "isModerator" | "designation" | "fileId" | "startTime" | "endTime" | "createdOn" | "modifiedOn";
export type SpeakerBioCreationAttributes = Optional<SpeakerBioAttributes, SpeakerBioOptionalAttributes>;

export class SpeakerBio extends Model<SpeakerBioAttributes, SpeakerBioCreationAttributes> implements SpeakerBioAttributes {
  id!: number;
  eventSpeakerId!: number;
  description?: string;
  isModerator!: number;
  designation?: string;
  fileId?: string;
  startTime?: Date;
  endTime?: Date;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // SpeakerBio belongsTo Asset via fileId
  file!: Asset;
  getFile!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setFile!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createFile!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // SpeakerBio belongsTo EventSpeaker via eventSpeakerId
  eventSpeaker!: EventSpeaker;
  getEventSpeaker!: Sequelize.BelongsToGetAssociationMixin<EventSpeaker>;
  setEventSpeaker!: Sequelize.BelongsToSetAssociationMixin<EventSpeaker, EventSpeakerId>;
  createEventSpeaker!: Sequelize.BelongsToCreateAssociationMixin<EventSpeaker>;

  static initModel(sequelize: Sequelize.Sequelize): typeof SpeakerBio {
    return SpeakerBio.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    eventSpeakerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_speaker',
        key: 'id'
      },
      field: 'event_speaker_id'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isModerator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      field: 'is_moderator'
    },
    designation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fileId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'asset',
        key: 'id'
      },
      field: 'file_id'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_time'
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
    }
  }, {
    sequelize,
    tableName: 'speaker_bio',
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
        name: "event_speaker_id",
        using: "BTREE",
        fields: [
          { name: "event_speaker_id" },
        ]
      },
      {
        name: "speaker_bio_asset_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "file_id" },
        ]
      },
    ]
  });
  }
}
