import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Subscription, SubscriptionId } from './Subscription';

export interface SubscriptionStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type SubscriptionStatusPk = 'id';
export type SubscriptionStatusId = SubscriptionStatus[SubscriptionStatusPk];
export type SubscriptionStatusOptionalAttributes = 'id' | 'description';
export type SubscriptionStatusCreationAttributes = Optional<
  SubscriptionStatusAttributes,
  SubscriptionStatusOptionalAttributes
>;

export class SubscriptionStatus
  extends Model<
    SubscriptionStatusAttributes,
    SubscriptionStatusCreationAttributes
  >
  implements SubscriptionStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // SubscriptionStatus hasMany Subscription via statusId
  subscriptions!: Subscription[];
  getSubscriptions!: Sequelize.HasManyGetAssociationsMixin<Subscription>;
  setSubscriptions!: Sequelize.HasManySetAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  addSubscription!: Sequelize.HasManyAddAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  addSubscriptions!: Sequelize.HasManyAddAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  createSubscription!: Sequelize.HasManyCreateAssociationMixin<Subscription>;
  removeSubscription!: Sequelize.HasManyRemoveAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  removeSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  hasSubscription!: Sequelize.HasManyHasAssociationMixin<
    Subscription,
    SubscriptionId
  >;
  hasSubscriptions!: Sequelize.HasManyHasAssociationsMixin<
    Subscription,
    SubscriptionId
  >;
  countSubscriptions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof SubscriptionStatus {
    return SubscriptionStatus.init(
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
        tableName: 'subscription_status',
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
