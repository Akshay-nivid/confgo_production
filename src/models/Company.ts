import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Addon, AddonId } from './Addon';
import type { Asset, AssetId } from './Asset';
import type { Cart, CartId } from './Cart';
import type { CompanyPaypalConfiguration, CompanyPaypalConfigurationId } from './CompanyPaypalConfiguration';
import type { CompanyStatus, CompanyStatusId } from './CompanyStatus';
import type { Coupon, CouponId } from './Coupon';
import type { Event, EventId } from './Event';
import type { EventAddon, EventAddonId } from './EventAddon';
import type { EventRegistrationDetail, EventRegistrationDetailId } from './EventRegistrationDetail';
import type { Order, OrderId } from './Order';
import type { ParticipantGroup, ParticipantGroupId } from './ParticipantGroup';
import type { ParticipantRole, ParticipantRoleId } from './ParticipantRole';
import type { Payment, PaymentId } from './Payment';
import type { UserCompany, UserCompanyId } from './UserCompany';
import type { Volunteer, VolunteerId } from './Volunteer';

export interface CompanyAttributes {
  id: number;
  phone: string;
  email?: string;
  companyName: string;
  companyAddress: string;
  state?: string;
  statusId?: number;
  assetId?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type CompanyPk = "id";
export type CompanyId = Company[CompanyPk];
export type CompanyOptionalAttributes = "id" | "email" | "state" | "statusId" | "assetId" | "createdOn" | "modifiedOn";
export type CompanyCreationAttributes = Optional<CompanyAttributes, CompanyOptionalAttributes>;

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  id!: number;
  phone!: string;
  email?: string;
  companyName!: string;
  companyAddress!: string;
  state?: string;
  statusId?: number;
  assetId?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // Company belongsTo Asset via assetId
  assetAsset!: Asset;
  getAssetAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAssetAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAssetAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Company hasMany Addon via companyId
  addons!: Addon[];
  getAddons!: Sequelize.HasManyGetAssociationsMixin<Addon>;
  setAddons!: Sequelize.HasManySetAssociationsMixin<Addon, AddonId>;
  addAddon!: Sequelize.HasManyAddAssociationMixin<Addon, AddonId>;
  addAddons!: Sequelize.HasManyAddAssociationsMixin<Addon, AddonId>;
  createAddon!: Sequelize.HasManyCreateAssociationMixin<Addon>;
  removeAddon!: Sequelize.HasManyRemoveAssociationMixin<Addon, AddonId>;
  removeAddons!: Sequelize.HasManyRemoveAssociationsMixin<Addon, AddonId>;
  hasAddon!: Sequelize.HasManyHasAssociationMixin<Addon, AddonId>;
  hasAddons!: Sequelize.HasManyHasAssociationsMixin<Addon, AddonId>;
  countAddons!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Asset via companyId
  assets!: Asset[];
  getAssets!: Sequelize.HasManyGetAssociationsMixin<Asset>;
  setAssets!: Sequelize.HasManySetAssociationsMixin<Asset, AssetId>;
  addAsset!: Sequelize.HasManyAddAssociationMixin<Asset, AssetId>;
  addAssets!: Sequelize.HasManyAddAssociationsMixin<Asset, AssetId>;
  createAsset!: Sequelize.HasManyCreateAssociationMixin<Asset>;
  removeAsset!: Sequelize.HasManyRemoveAssociationMixin<Asset, AssetId>;
  removeAssets!: Sequelize.HasManyRemoveAssociationsMixin<Asset, AssetId>;
  hasAsset!: Sequelize.HasManyHasAssociationMixin<Asset, AssetId>;
  hasAssets!: Sequelize.HasManyHasAssociationsMixin<Asset, AssetId>;
  countAssets!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Cart via companyId
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
  // Company hasMany CompanyPaypalConfiguration via companyId
  companyPaypalConfigurations!: CompanyPaypalConfiguration[];
  getCompanyPaypalConfigurations!: Sequelize.HasManyGetAssociationsMixin<CompanyPaypalConfiguration>;
  setCompanyPaypalConfigurations!: Sequelize.HasManySetAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  addCompanyPaypalConfiguration!: Sequelize.HasManyAddAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  addCompanyPaypalConfigurations!: Sequelize.HasManyAddAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  createCompanyPaypalConfiguration!: Sequelize.HasManyCreateAssociationMixin<CompanyPaypalConfiguration>;
  removeCompanyPaypalConfiguration!: Sequelize.HasManyRemoveAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  removeCompanyPaypalConfigurations!: Sequelize.HasManyRemoveAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  hasCompanyPaypalConfiguration!: Sequelize.HasManyHasAssociationMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  hasCompanyPaypalConfigurations!: Sequelize.HasManyHasAssociationsMixin<CompanyPaypalConfiguration, CompanyPaypalConfigurationId>;
  countCompanyPaypalConfigurations!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Coupon via companyId
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
  // Company hasMany Event via companyId
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
  // Company hasMany EventAddon via companyId
  eventAddons!: EventAddon[];
  getEventAddons!: Sequelize.HasManyGetAssociationsMixin<EventAddon>;
  setEventAddons!: Sequelize.HasManySetAssociationsMixin<EventAddon, EventAddonId>;
  addEventAddon!: Sequelize.HasManyAddAssociationMixin<EventAddon, EventAddonId>;
  addEventAddons!: Sequelize.HasManyAddAssociationsMixin<EventAddon, EventAddonId>;
  createEventAddon!: Sequelize.HasManyCreateAssociationMixin<EventAddon>;
  removeEventAddon!: Sequelize.HasManyRemoveAssociationMixin<EventAddon, EventAddonId>;
  removeEventAddons!: Sequelize.HasManyRemoveAssociationsMixin<EventAddon, EventAddonId>;
  hasEventAddon!: Sequelize.HasManyHasAssociationMixin<EventAddon, EventAddonId>;
  hasEventAddons!: Sequelize.HasManyHasAssociationsMixin<EventAddon, EventAddonId>;
  countEventAddons!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany EventRegistrationDetail via companyId
  eventRegistrationDetails!: EventRegistrationDetail[];
  getEventRegistrationDetails!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationDetail>;
  setEventRegistrationDetails!: Sequelize.HasManySetAssociationsMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  addEventRegistrationDetail!: Sequelize.HasManyAddAssociationMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  addEventRegistrationDetails!: Sequelize.HasManyAddAssociationsMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  createEventRegistrationDetail!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationDetail>;
  removeEventRegistrationDetail!: Sequelize.HasManyRemoveAssociationMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  removeEventRegistrationDetails!: Sequelize.HasManyRemoveAssociationsMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  hasEventRegistrationDetail!: Sequelize.HasManyHasAssociationMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  hasEventRegistrationDetails!: Sequelize.HasManyHasAssociationsMixin<EventRegistrationDetail, EventRegistrationDetailId>;
  countEventRegistrationDetails!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Order via companyId
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
  // Company hasMany ParticipantGroup via companyId
  participantGroups!: ParticipantGroup[];
  getParticipantGroups!: Sequelize.HasManyGetAssociationsMixin<ParticipantGroup>;
  setParticipantGroups!: Sequelize.HasManySetAssociationsMixin<ParticipantGroup, ParticipantGroupId>;
  addParticipantGroup!: Sequelize.HasManyAddAssociationMixin<ParticipantGroup, ParticipantGroupId>;
  addParticipantGroups!: Sequelize.HasManyAddAssociationsMixin<ParticipantGroup, ParticipantGroupId>;
  createParticipantGroup!: Sequelize.HasManyCreateAssociationMixin<ParticipantGroup>;
  removeParticipantGroup!: Sequelize.HasManyRemoveAssociationMixin<ParticipantGroup, ParticipantGroupId>;
  removeParticipantGroups!: Sequelize.HasManyRemoveAssociationsMixin<ParticipantGroup, ParticipantGroupId>;
  hasParticipantGroup!: Sequelize.HasManyHasAssociationMixin<ParticipantGroup, ParticipantGroupId>;
  hasParticipantGroups!: Sequelize.HasManyHasAssociationsMixin<ParticipantGroup, ParticipantGroupId>;
  countParticipantGroups!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany ParticipantRole via companyId
  participantRoles!: ParticipantRole[];
  getParticipantRoles!: Sequelize.HasManyGetAssociationsMixin<ParticipantRole>;
  setParticipantRoles!: Sequelize.HasManySetAssociationsMixin<ParticipantRole, ParticipantRoleId>;
  addParticipantRole!: Sequelize.HasManyAddAssociationMixin<ParticipantRole, ParticipantRoleId>;
  addParticipantRoles!: Sequelize.HasManyAddAssociationsMixin<ParticipantRole, ParticipantRoleId>;
  createParticipantRole!: Sequelize.HasManyCreateAssociationMixin<ParticipantRole>;
  removeParticipantRole!: Sequelize.HasManyRemoveAssociationMixin<ParticipantRole, ParticipantRoleId>;
  removeParticipantRoles!: Sequelize.HasManyRemoveAssociationsMixin<ParticipantRole, ParticipantRoleId>;
  hasParticipantRole!: Sequelize.HasManyHasAssociationMixin<ParticipantRole, ParticipantRoleId>;
  hasParticipantRoles!: Sequelize.HasManyHasAssociationsMixin<ParticipantRole, ParticipantRoleId>;
  countParticipantRoles!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Payment via companyId
  payments!: Payment[];
  getPayments!: Sequelize.HasManyGetAssociationsMixin<Payment>;
  setPayments!: Sequelize.HasManySetAssociationsMixin<Payment, PaymentId>;
  addPayment!: Sequelize.HasManyAddAssociationMixin<Payment, PaymentId>;
  addPayments!: Sequelize.HasManyAddAssociationsMixin<Payment, PaymentId>;
  createPayment!: Sequelize.HasManyCreateAssociationMixin<Payment>;
  removePayment!: Sequelize.HasManyRemoveAssociationMixin<Payment, PaymentId>;
  removePayments!: Sequelize.HasManyRemoveAssociationsMixin<Payment, PaymentId>;
  hasPayment!: Sequelize.HasManyHasAssociationMixin<Payment, PaymentId>;
  hasPayments!: Sequelize.HasManyHasAssociationsMixin<Payment, PaymentId>;
  countPayments!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany UserCompany via companyId
  userCompanies!: UserCompany[];
  getUserCompanies!: Sequelize.HasManyGetAssociationsMixin<UserCompany>;
  setUserCompanies!: Sequelize.HasManySetAssociationsMixin<UserCompany, UserCompanyId>;
  addUserCompany!: Sequelize.HasManyAddAssociationMixin<UserCompany, UserCompanyId>;
  addUserCompanies!: Sequelize.HasManyAddAssociationsMixin<UserCompany, UserCompanyId>;
  createUserCompany!: Sequelize.HasManyCreateAssociationMixin<UserCompany>;
  removeUserCompany!: Sequelize.HasManyRemoveAssociationMixin<UserCompany, UserCompanyId>;
  removeUserCompanies!: Sequelize.HasManyRemoveAssociationsMixin<UserCompany, UserCompanyId>;
  hasUserCompany!: Sequelize.HasManyHasAssociationMixin<UserCompany, UserCompanyId>;
  hasUserCompanies!: Sequelize.HasManyHasAssociationsMixin<UserCompany, UserCompanyId>;
  countUserCompanies!: Sequelize.HasManyCountAssociationsMixin;
  // Company hasMany Volunteer via companyId
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
  // Company belongsTo CompanyStatus via statusId
  status!: CompanyStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<CompanyStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<CompanyStatus, CompanyStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<CompanyStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Company {
    return Company.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'company_name'
    },
    companyAddress: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'company_address'
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'company_status',
        key: 'id'
      },
      field: 'status_id'
    },
    assetId: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'asset',
        key: 'id'
      },
      field: 'asset_id'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by'
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_on'
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'modified_by'
    },
    modifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_on'
    }
  }, {
    sequelize,
    tableName: 'company',
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
      {
        name: "company_company_status_FK",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "company_asset_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
    ]
  });
  }
}
