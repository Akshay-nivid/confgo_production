import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export interface SequelizemetaAttributes {
  name: string;
}

export type SequelizemetaPk = 'name';
export type SequelizemetaId = Sequelizemeta[SequelizemetaPk];
export type SequelizemetaCreationAttributes = SequelizemetaAttributes;

export class Sequelizemeta
  extends Model<SequelizemetaAttributes, SequelizemetaCreationAttributes>
  implements SequelizemetaAttributes
{
  name!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof Sequelizemeta {
    return Sequelizemeta.init(
      {
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'sequelizemeta',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'name' }],
          },
          {
            name: 'name',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'name' }],
          },
        ],
      }
    );
  }
}
