import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Volunteer, VolunteerId } from './Volunteer';

export interface VolunteerStatusAttributes {
  id: number;
  statusName?: string;
  description?: string;
}

export type VolunteerStatusPk = "id";
export type VolunteerStatusId = VolunteerStatus[VolunteerStatusPk];
export type VolunteerStatusOptionalAttributes = "id" | "statusName" | "description";
export type VolunteerStatusCreationAttributes = Optional<VolunteerStatusAttributes, VolunteerStatusOptionalAttributes>;

export class VolunteerStatus extends Model<VolunteerStatusAttributes, VolunteerStatusCreationAttributes> implements VolunteerStatusAttributes {
  id!: number;
  statusName?: string;
  description?: string;

  // VolunteerStatus hasMany Volunteer via statusId
  volunteers!: Volunteer[];
  getVolunteers!: Sequelize.HasManyGetAssociationsMixin<Volunteer>;
  setVolunteers!: Sequelize.HasManySetAssociationsMixin<Volunteer, VolunteerId>;
  addVolunteer!: Sequelize.HasManyAddAssociationMixin<Volunteer, VolunteerId>;
  addVolunteers!: Sequelize.HasManyAddAssociationsMixin<Volunteer, VolunteerId>;
  createVolunteer!: Sequelize.HasManyCreateAssociationMixin<Volunteer>;
  removeVolunteer!: Sequelize.HasManyRemoveAssociationMixin<Volunteer, VolunteerId>;
  removeVolunteers!: Sequelize.HasManyRemoveAssociationsMixin<Volunteer, VolunteerId>;
  hasVolunteer!: Sequelize.HasManyHasAssociationMixin<Volunteer, VolunteerId>;
  hasVolunteers!: Sequelize.HasManyHasAssociationsMixin<Volunteer, VolunteerId>;
  countVolunteers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof VolunteerStatus {
    return VolunteerStatus.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    statusName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'status_name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'volunteer_status',
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
    ]
  });
  }
}
