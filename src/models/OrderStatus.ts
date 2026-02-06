import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Order, OrderId } from './Order';

export interface OrderStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type OrderStatusPk = 'id';
export type OrderStatusId = OrderStatus[OrderStatusPk];
export type OrderStatusOptionalAttributes = 'id' | 'description';
export type OrderStatusCreationAttributes = Optional<
  OrderStatusAttributes,
  OrderStatusOptionalAttributes
>;

export class OrderStatus
  extends Model<OrderStatusAttributes, OrderStatusCreationAttributes>
  implements OrderStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // OrderStatus hasMany Order via statusId
  orders!: Order[];
  getOrders!: Sequelize.HasManyGetAssociationsMixin<Order>;
  setOrders!: Sequelize.HasManySetAssociationsMixin<Order, OrderId>;
  addOrder!: Sequelize.HasManyAddAssociationMixin<Order, OrderId>;
  addOrders!: Sequelize.HasManyAddAssociationsMixin<Order, OrderId>;
  createOrder!: Sequelize.HasManyCreateAssociationMixin<Order>;
  removeOrder!: Sequelize.HasManyRemoveAssociationMixin<Order, OrderId>;
  removeOrders!: Sequelize.HasManyRemoveAssociationsMixin<Order, OrderId>;
  hasOrder!: Sequelize.HasManyHasAssociationMixin<Order, OrderId>;
  hasOrders!: Sequelize.HasManyHasAssociationsMixin<Order, OrderId>;
  countOrders!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof OrderStatus {
    return OrderStatus.init(
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
        tableName: 'order_status',
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
