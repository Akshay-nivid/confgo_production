import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Coupon, CouponId } from './Coupon';

export interface CouponUsageAttributes {
  id: number;
  couponId: number;
  userId: number;
  eventId: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type CouponUsagePk = 'id';
export type CouponUsageId = CouponUsage[CouponUsagePk];
export type CouponUsageOptionalAttributes = 'id' | 'createdOn' | 'modifiedOn';
export type CouponUsageCreationAttributes = Optional<
  CouponUsageAttributes,
  CouponUsageOptionalAttributes
>;

export class CouponUsage
  extends Model<CouponUsageAttributes, CouponUsageCreationAttributes>
  implements CouponUsageAttributes
{
  id!: number;
  couponId!: number;
  userId!: number;
  eventId!: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // CouponUsage belongsTo Coupon via couponId
  coupon!: Coupon;
  getCoupon!: Sequelize.BelongsToGetAssociationMixin<Coupon>;
  setCoupon!: Sequelize.BelongsToSetAssociationMixin<Coupon, CouponId>;
  createCoupon!: Sequelize.BelongsToCreateAssociationMixin<Coupon>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CouponUsage {
    return CouponUsage.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        couponId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'coupon',
            key: 'id',
          },
          field: 'coupon_id',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'event_id',
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
        tableName: 'coupon_usage',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'coupon_id',
            using: 'BTREE',
            fields: [{ name: 'coupon_id' }],
          },
        ],
      }
    );
  }
}
