import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Coupon, CouponId } from './Coupon';
import type { Event, EventId } from './Event';
import type { User, UserId } from './User';

export interface UserCouponAttributes {
  id: number;
  couponId: number;
  userId: number;
  eventId: number;
  status: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type UserCouponPk = 'id';
export type UserCouponId = UserCoupon[UserCouponPk];
export type UserCouponOptionalAttributes = 'id' | 'createdOn' | 'modifiedOn';
export type UserCouponCreationAttributes = Optional<
  UserCouponAttributes,
  UserCouponOptionalAttributes
>;

export class UserCoupon
  extends Model<UserCouponAttributes, UserCouponCreationAttributes>
  implements UserCouponAttributes
{
  id!: number;
  couponId!: number;
  userId!: number;
  eventId!: number;
  status!: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // UserCoupon belongsTo Coupon via couponId
  coupon!: Coupon;
  getCoupon!: Sequelize.BelongsToGetAssociationMixin<Coupon>;
  setCoupon!: Sequelize.BelongsToSetAssociationMixin<Coupon, CouponId>;
  createCoupon!: Sequelize.BelongsToCreateAssociationMixin<Coupon>;
  // UserCoupon belongsTo Event via eventId
  event!: Event;
  getEvent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setEvent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createEvent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // UserCoupon belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof UserCoupon {
    return UserCoupon.init(
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
          references: {
            model: 'user',
            key: 'id',
          },
          field: 'user_id',
        },
        eventId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'event',
            key: 'id',
          },
          field: 'event_id',
        },
        status: {
          type: DataTypes.STRING(20),
          allowNull: false,
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
        tableName: 'user_coupon',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'user_coupon_event_idx',
            using: 'BTREE',
            fields: [{ name: 'event_id' }],
          },
          {
            name: 'coupon_id',
            using: 'BTREE',
            fields: [{ name: 'coupon_id' }],
          },
          {
            name: 'user_id',
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    );
  }
}
