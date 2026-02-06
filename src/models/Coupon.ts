import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Company, CompanyId } from './Company';
import type { CouponStatus, CouponStatusId } from './CouponStatus';
import type { CouponUsage, CouponUsageId } from './CouponUsage';
import type { UserCoupon, UserCouponId } from './UserCoupon';

export interface CouponAttributes {
  id: number;
  code: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  timesUsed: number;
  discountType: string;
  discountValue: number;
  maxUses: number;
  maxDiscountValue: number;
  minPurchaseValue: number;
  companyId: number;
  statusId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  name: string;
}

export type CouponPk = 'id';
export type CouponId = Coupon[CouponPk];
export type CouponOptionalAttributes =
  | 'id'
  | 'description'
  | 'startDate'
  | 'endDate'
  | 'statusId'
  | 'createdOn'
  | 'modifiedOn';
export type CouponCreationAttributes = Optional<
  CouponAttributes,
  CouponOptionalAttributes
>;

export class Coupon
  extends Model<CouponAttributes, CouponCreationAttributes>
  implements CouponAttributes
{
  id!: number;
  code!: string;
  description?: string;
  startDate!: Date;
  endDate?: Date;
  timesUsed!: number;
  discountType!: string;
  discountValue!: number;
  maxUses!: number;
  maxDiscountValue!: number;
  minPurchaseValue!: number;
  companyId!: number;
  statusId?: number;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;
  name!: string;

  // Coupon belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Coupon hasMany CouponUsage via couponId
  couponUsages!: CouponUsage[];
  getCouponUsages!: Sequelize.HasManyGetAssociationsMixin<CouponUsage>;
  setCouponUsages!: Sequelize.HasManySetAssociationsMixin<
    CouponUsage,
    CouponUsageId
  >;
  addCouponUsage!: Sequelize.HasManyAddAssociationMixin<
    CouponUsage,
    CouponUsageId
  >;
  addCouponUsages!: Sequelize.HasManyAddAssociationsMixin<
    CouponUsage,
    CouponUsageId
  >;
  createCouponUsage!: Sequelize.HasManyCreateAssociationMixin<CouponUsage>;
  removeCouponUsage!: Sequelize.HasManyRemoveAssociationMixin<
    CouponUsage,
    CouponUsageId
  >;
  removeCouponUsages!: Sequelize.HasManyRemoveAssociationsMixin<
    CouponUsage,
    CouponUsageId
  >;
  hasCouponUsage!: Sequelize.HasManyHasAssociationMixin<
    CouponUsage,
    CouponUsageId
  >;
  hasCouponUsages!: Sequelize.HasManyHasAssociationsMixin<
    CouponUsage,
    CouponUsageId
  >;
  countCouponUsages!: Sequelize.HasManyCountAssociationsMixin;
  // Coupon hasMany UserCoupon via couponId
  userCoupons!: UserCoupon[];
  getUserCoupons!: Sequelize.HasManyGetAssociationsMixin<UserCoupon>;
  setUserCoupons!: Sequelize.HasManySetAssociationsMixin<
    UserCoupon,
    UserCouponId
  >;
  addUserCoupon!: Sequelize.HasManyAddAssociationMixin<
    UserCoupon,
    UserCouponId
  >;
  addUserCoupons!: Sequelize.HasManyAddAssociationsMixin<
    UserCoupon,
    UserCouponId
  >;
  createUserCoupon!: Sequelize.HasManyCreateAssociationMixin<UserCoupon>;
  removeUserCoupon!: Sequelize.HasManyRemoveAssociationMixin<
    UserCoupon,
    UserCouponId
  >;
  removeUserCoupons!: Sequelize.HasManyRemoveAssociationsMixin<
    UserCoupon,
    UserCouponId
  >;
  hasUserCoupon!: Sequelize.HasManyHasAssociationMixin<
    UserCoupon,
    UserCouponId
  >;
  hasUserCoupons!: Sequelize.HasManyHasAssociationsMixin<
    UserCoupon,
    UserCouponId
  >;
  countUserCoupons!: Sequelize.HasManyCountAssociationsMixin;
  // Coupon belongsTo CouponStatus via statusId
  status!: CouponStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<CouponStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<
    CouponStatus,
    CouponStatusId
  >;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<CouponStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Coupon {
    return Coupon.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'start_date',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'end_date',
        },
        timesUsed: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'times_used',
        },
        discountType: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'discount_type',
        },
        discountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'discount_value',
        },
        maxUses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'max_uses',
        },
        maxDiscountValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'max_discount_value',
        },
        minPurchaseValue: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'min_purchase_value',
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'company',
            key: 'id',
          },
          field: 'company_id',
        },
        statusId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'coupon_status',
            key: 'id',
          },
          field: 'status_id',
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
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'coupon',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'company_id',
            using: 'BTREE',
            fields: [{ name: 'company_id' }],
          },
          {
            name: 'coupon_coupon_status_FK',
            using: 'BTREE',
            fields: [{ name: 'status_id' }],
          },
        ],
      }
    );
  }
}
