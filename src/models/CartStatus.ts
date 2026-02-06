import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Cart, CartId } from './Cart';

export interface CartStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type CartStatusPk = 'id';
export type CartStatusId = CartStatus[CartStatusPk];
export type CartStatusOptionalAttributes = 'id' | 'description';
export type CartStatusCreationAttributes = Optional<
  CartStatusAttributes,
  CartStatusOptionalAttributes
>;

export class CartStatus
  extends Model<CartStatusAttributes, CartStatusCreationAttributes>
  implements CartStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // CartStatus hasMany Cart via statusId
  carts!: Cart[];
  getCarts!: Sequelize.HasManyGetAssociationsMixin<Cart>;
  setCarts!: Sequelize.HasManySetAssociationsMixin<Cart, CartId>;
  addCart!: Sequelize.HasManyAddAssociationMixin<Cart, CartId>;
  addCarts!: Sequelize.HasManyAddAssociationsMixin<Cart, CartId>;
  createCart!: Sequelize.HasManyCreateAssociationMixin<Cart>;
  removeCart!: Sequelize.HasManyRemoveAssociationMixin<Cart, CartId>;
  removeCarts!: Sequelize.HasManyRemoveAssociationsMixin<Cart, CartId>;
  hasCart!: Sequelize.HasManyHasAssociationMixin<Cart, CartId>;
  hasCarts!: Sequelize.HasManyHasAssociationsMixin<Cart, CartId>;
  countCarts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CartStatus {
    return CartStatus.init(
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
        tableName: 'cart_status',
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
