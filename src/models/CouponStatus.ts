import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Coupon, CouponId } from './Coupon';

export interface CouponStatusAttributes {
  id: number;
  statusName: string;
  description?: string;
}

export type CouponStatusPk = 'id';
export type CouponStatusId = CouponStatus[CouponStatusPk];
export type CouponStatusOptionalAttributes = 'id' | 'description';
export type CouponStatusCreationAttributes = Optional<
  CouponStatusAttributes,
  CouponStatusOptionalAttributes
>;

export class CouponStatus
  extends Model<CouponStatusAttributes, CouponStatusCreationAttributes>
  implements CouponStatusAttributes
{
  id!: number;
  statusName!: string;
  description?: string;

  // CouponStatus hasMany Coupon via statusId
  coupons!: Coupon[];
  getCoupons!: Sequelize.HasManyGetAssociationsMixin<Coupon>;
  setCoupons!: Sequelize.HasManySetAssociationsMixin<Coupon, CouponId>;
  addCoupon!: Sequelize.HasManyAddAssociationMixin<Coupon, CouponId>;
  addCoupons!: Sequelize.HasManyAddAssociationsMixin<Coupon, CouponId>;
  createCoupon!: Sequelize.HasManyCreateAssociationMixin<Coupon>;
  removeCoupon!: Sequelize.HasManyRemoveAssociationMixin<Coupon, CouponId>;
  removeCoupons!: Sequelize.HasManyRemoveAssociationsMixin<Coupon, CouponId>;
  hasCoupon!: Sequelize.HasManyHasAssociationMixin<Coupon, CouponId>;
  hasCoupons!: Sequelize.HasManyHasAssociationsMixin<Coupon, CouponId>;
  countCoupons!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof CouponStatus {
    return CouponStatus.init(
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
        tableName: 'coupon_status',
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
