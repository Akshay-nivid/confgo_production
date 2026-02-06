import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Event, EventId } from './Event';

export interface SpecialtyAttributes {
  id: number;
  name: string;
  description?: string;
}

export type SpecialtyPk = "id";
export type SpecialtyId = Specialty[SpecialtyPk];
export type SpecialtyOptionalAttributes = "id" | "description";
export type SpecialtyCreationAttributes = Optional<SpecialtyAttributes, SpecialtyOptionalAttributes>;

export class Specialty extends Model<SpecialtyAttributes, SpecialtyCreationAttributes> implements SpecialtyAttributes {
  id!: number;
  name!: string;
  description?: string;

  // Specialty hasMany Event via specialtyId
  events!: Event[];
  getEvents!: Sequelize.HasManyGetAssociationsMixin<Event>;
  setEvents!: Sequelize.HasManySetAssociationsMixin<Event, EventId>;
  addEvent!: Sequelize.HasManyAddAssociationMixin<Event, EventId>;
  addEvents!: Sequelize.HasManyAddAssociationsMixin<Event, EventId>;
  createEvent!: Sequelize.HasManyCreateAssociationMixin<Event>;
  removeEvent!: Sequelize.HasManyRemoveAssociationMixin<Event, EventId>;
  removeEvents!: Sequelize.HasManyRemoveAssociationsMixin<Event, EventId>;
  hasEvent!: Sequelize.HasManyHasAssociationMixin<Event, EventId>;
  hasEvents!: Sequelize.HasManyHasAssociationsMixin<Event, EventId>;
  countEvents!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Specialty {
    return Specialty.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'specialty',
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
