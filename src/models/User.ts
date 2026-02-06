import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Cart, CartId } from './Cart';
import type { CompanyPaypalConfiguration, CompanyPaypalConfigurationId } from './CompanyPaypalConfiguration';
import type { CompanyTax, CompanyTaxId } from './CompanyTax';
import type { EventFeedback, EventFeedbackId } from './EventFeedback';
import type { EventRegistrationRecord, EventRegistrationRecordId } from './EventRegistrationRecord';
import type { EventSpeaker, EventSpeakerId } from './EventSpeaker';
import type { Notification, NotificationId } from './Notification';
import type { Order, OrderId } from './Order';
import type { Participant, ParticipantId } from './Participant';
import type { Payment, PaymentId } from './Payment';
import type { Sponsor, SponsorId } from './Sponsor';
import type { Subscription, SubscriptionId } from './Subscription';
import type { SubscriptionPayment, SubscriptionPaymentId } from './SubscriptionPayment';
import type { UsageRecord, UsageRecordId } from './UsageRecord';
import type { UserAbstract, UserAbstractId } from './UserAbstract';
import type { UserAuth, UserAuthCreationAttributes, UserAuthId } from './UserAuth';
import type { UserCompany, UserCompanyId } from './UserCompany';
import type { UserCoupon, UserCouponId } from './UserCoupon';
import type { UserData, UserDataId } from './UserData';
import type { UserRole, UserRoleId } from './UserRole';
import type { UserStatus, UserStatusId } from './UserStatus';
import type { Volunteer, VolunteerId } from './Volunteer';
import type { VolunteerEvent, VolunteerEventId } from './VolunteerEvent';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  phoneVerified?: number;
  isSsoUser?: number;
  ssoMetadata?: string;
  designation?: string;
  deviceToken?: string;
  userDescription?: string;
  statusId?: number;
  acceptedTerms?: number;
  assetId?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id" | "phone" | "phoneVerified" | "isSsoUser" | "ssoMetadata" | "designation" | "statusId" | "acceptedTerms" | "assetId" | "createdOn" | "modifiedOn" | "deviceToken" | "userDescription";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: number;
  firstName!: string;
  lastName!: string;
  phone?: string;
  email!: string;
  phoneVerified?: number;
  isSsoUser?: number;
  ssoMetadata?: string;
  designation?: string;
  deviceToken?: string;
  userDescription?: string;
  statusId?: number;
  acceptedTerms?: number;
  assetId?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
  modifiedOn?: Date;

  // User belongsTo Asset via assetId
  assetAsset!: Asset;
  getAssetAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAssetAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAssetAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // User hasMany Asset via userId
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
  // User hasMany Cart via userId
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
  // User hasMany CompanyPaypalConfiguration via userId
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
  // User hasMany CompanyTax via companyId
  companyTaxes!: CompanyTax[];
  getCompanyTaxes!: Sequelize.HasManyGetAssociationsMixin<CompanyTax>;
  setCompanyTaxes!: Sequelize.HasManySetAssociationsMixin<CompanyTax, CompanyTaxId>;
  addCompanyTax!: Sequelize.HasManyAddAssociationMixin<CompanyTax, CompanyTaxId>;
  addCompanyTaxes!: Sequelize.HasManyAddAssociationsMixin<CompanyTax, CompanyTaxId>;
  createCompanyTax!: Sequelize.HasManyCreateAssociationMixin<CompanyTax>;
  removeCompanyTax!: Sequelize.HasManyRemoveAssociationMixin<CompanyTax, CompanyTaxId>;
  removeCompanyTaxes!: Sequelize.HasManyRemoveAssociationsMixin<CompanyTax, CompanyTaxId>;
  hasCompanyTax!: Sequelize.HasManyHasAssociationMixin<CompanyTax, CompanyTaxId>;
  hasCompanyTaxes!: Sequelize.HasManyHasAssociationsMixin<CompanyTax, CompanyTaxId>;
  countCompanyTaxes!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany EventFeedback via userId
  eventFeedbacks!: EventFeedback[];
  getEventFeedbacks!: Sequelize.HasManyGetAssociationsMixin<EventFeedback>;
  setEventFeedbacks!: Sequelize.HasManySetAssociationsMixin<EventFeedback, EventFeedbackId>;
  addEventFeedback!: Sequelize.HasManyAddAssociationMixin<EventFeedback, EventFeedbackId>;
  addEventFeedbacks!: Sequelize.HasManyAddAssociationsMixin<EventFeedback, EventFeedbackId>;
  createEventFeedback!: Sequelize.HasManyCreateAssociationMixin<EventFeedback>;
  removeEventFeedback!: Sequelize.HasManyRemoveAssociationMixin<EventFeedback, EventFeedbackId>;
  removeEventFeedbacks!: Sequelize.HasManyRemoveAssociationsMixin<EventFeedback, EventFeedbackId>;
  hasEventFeedback!: Sequelize.HasManyHasAssociationMixin<EventFeedback, EventFeedbackId>;
  hasEventFeedbacks!: Sequelize.HasManyHasAssociationsMixin<EventFeedback, EventFeedbackId>;
  countEventFeedbacks!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany EventRegistrationRecord via userId
  eventRegistrationRecords!: EventRegistrationRecord[];
  getEventRegistrationRecords!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationRecord>;
  setEventRegistrationRecords!: Sequelize.HasManySetAssociationsMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  addEventRegistrationRecord!: Sequelize.HasManyAddAssociationMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  addEventRegistrationRecords!: Sequelize.HasManyAddAssociationsMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  createEventRegistrationRecord!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationRecord>;
  removeEventRegistrationRecord!: Sequelize.HasManyRemoveAssociationMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  removeEventRegistrationRecords!: Sequelize.HasManyRemoveAssociationsMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  hasEventRegistrationRecord!: Sequelize.HasManyHasAssociationMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  hasEventRegistrationRecords!: Sequelize.HasManyHasAssociationsMixin<EventRegistrationRecord, EventRegistrationRecordId>;
  countEventRegistrationRecords!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany EventSpeaker via userId
  eventSpeakers!: EventSpeaker[];
  getEventSpeakers!: Sequelize.HasManyGetAssociationsMixin<EventSpeaker>;
  setEventSpeakers!: Sequelize.HasManySetAssociationsMixin<EventSpeaker, EventSpeakerId>;
  addEventSpeaker!: Sequelize.HasManyAddAssociationMixin<EventSpeaker, EventSpeakerId>;
  addEventSpeakers!: Sequelize.HasManyAddAssociationsMixin<EventSpeaker, EventSpeakerId>;
  createEventSpeaker!: Sequelize.HasManyCreateAssociationMixin<EventSpeaker>;
  removeEventSpeaker!: Sequelize.HasManyRemoveAssociationMixin<EventSpeaker, EventSpeakerId>;
  removeEventSpeakers!: Sequelize.HasManyRemoveAssociationsMixin<EventSpeaker, EventSpeakerId>;
  hasEventSpeaker!: Sequelize.HasManyHasAssociationMixin<EventSpeaker, EventSpeakerId>;
  hasEventSpeakers!: Sequelize.HasManyHasAssociationsMixin<EventSpeaker, EventSpeakerId>;
  countEventSpeakers!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Notification via userId
  notifications!: Notification[];
  getNotifications!: Sequelize.HasManyGetAssociationsMixin<Notification>;
  setNotifications!: Sequelize.HasManySetAssociationsMixin<Notification, NotificationId>;
  addNotification!: Sequelize.HasManyAddAssociationMixin<Notification, NotificationId>;
  addNotifications!: Sequelize.HasManyAddAssociationsMixin<Notification, NotificationId>;
  createNotification!: Sequelize.HasManyCreateAssociationMixin<Notification>;
  removeNotification!: Sequelize.HasManyRemoveAssociationMixin<Notification, NotificationId>;
  removeNotifications!: Sequelize.HasManyRemoveAssociationsMixin<Notification, NotificationId>;
  hasNotification!: Sequelize.HasManyHasAssociationMixin<Notification, NotificationId>;
  hasNotifications!: Sequelize.HasManyHasAssociationsMixin<Notification, NotificationId>;
  countNotifications!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Order via userId
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
  // User hasMany Participant via userId
  participants!: Participant[];
  getParticipants!: Sequelize.HasManyGetAssociationsMixin<Participant>;
  setParticipants!: Sequelize.HasManySetAssociationsMixin<Participant, ParticipantId>;
  addParticipant!: Sequelize.HasManyAddAssociationMixin<Participant, ParticipantId>;
  addParticipants!: Sequelize.HasManyAddAssociationsMixin<Participant, ParticipantId>;
  createParticipant!: Sequelize.HasManyCreateAssociationMixin<Participant>;
  removeParticipant!: Sequelize.HasManyRemoveAssociationMixin<Participant, ParticipantId>;
  removeParticipants!: Sequelize.HasManyRemoveAssociationsMixin<Participant, ParticipantId>;
  hasParticipant!: Sequelize.HasManyHasAssociationMixin<Participant, ParticipantId>;
  hasParticipants!: Sequelize.HasManyHasAssociationsMixin<Participant, ParticipantId>;
  countParticipants!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Payment via userId
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
  // User hasMany Sponsor via companyId
  sponsors!: Sponsor[];
  getSponsors!: Sequelize.HasManyGetAssociationsMixin<Sponsor>;
  setSponsors!: Sequelize.HasManySetAssociationsMixin<Sponsor, SponsorId>;
  addSponsor!: Sequelize.HasManyAddAssociationMixin<Sponsor, SponsorId>;
  addSponsors!: Sequelize.HasManyAddAssociationsMixin<Sponsor, SponsorId>;
  createSponsor!: Sequelize.HasManyCreateAssociationMixin<Sponsor>;
  removeSponsor!: Sequelize.HasManyRemoveAssociationMixin<Sponsor, SponsorId>;
  removeSponsors!: Sequelize.HasManyRemoveAssociationsMixin<Sponsor, SponsorId>;
  hasSponsor!: Sequelize.HasManyHasAssociationMixin<Sponsor, SponsorId>;
  hasSponsors!: Sequelize.HasManyHasAssociationsMixin<Sponsor, SponsorId>;
  countSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Subscription via userId
  subscriptions!: Subscription[];
  getSubscriptions!: Sequelize.HasManyGetAssociationsMixin<Subscription>;
  setSubscriptions!: Sequelize.HasManySetAssociationsMixin<Subscription, SubscriptionId>;
  addSubscription!: Sequelize.HasManyAddAssociationMixin<Subscription, SubscriptionId>;
  addSubscriptions!: Sequelize.HasManyAddAssociationsMixin<Subscription, SubscriptionId>;
  createSubscription!: Sequelize.HasManyCreateAssociationMixin<Subscription>;
  removeSubscription!: Sequelize.HasManyRemoveAssociationMixin<Subscription, SubscriptionId>;
  removeSubscriptions!: Sequelize.HasManyRemoveAssociationsMixin<Subscription, SubscriptionId>;
  hasSubscription!: Sequelize.HasManyHasAssociationMixin<Subscription, SubscriptionId>;
  hasSubscriptions!: Sequelize.HasManyHasAssociationsMixin<Subscription, SubscriptionId>;
  countSubscriptions!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany SubscriptionPayment via userId
  subscriptionPayments!: SubscriptionPayment[];
  getSubscriptionPayments!: Sequelize.HasManyGetAssociationsMixin<SubscriptionPayment>;
  setSubscriptionPayments!: Sequelize.HasManySetAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  addSubscriptionPayment!: Sequelize.HasManyAddAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  addSubscriptionPayments!: Sequelize.HasManyAddAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  createSubscriptionPayment!: Sequelize.HasManyCreateAssociationMixin<SubscriptionPayment>;
  removeSubscriptionPayment!: Sequelize.HasManyRemoveAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  removeSubscriptionPayments!: Sequelize.HasManyRemoveAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  hasSubscriptionPayment!: Sequelize.HasManyHasAssociationMixin<SubscriptionPayment, SubscriptionPaymentId>;
  hasSubscriptionPayments!: Sequelize.HasManyHasAssociationsMixin<SubscriptionPayment, SubscriptionPaymentId>;
  countSubscriptionPayments!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UsageRecord via userId
  usageRecords!: UsageRecord[];
  getUsageRecords!: Sequelize.HasManyGetAssociationsMixin<UsageRecord>;
  setUsageRecords!: Sequelize.HasManySetAssociationsMixin<UsageRecord, UsageRecordId>;
  addUsageRecord!: Sequelize.HasManyAddAssociationMixin<UsageRecord, UsageRecordId>;
  addUsageRecords!: Sequelize.HasManyAddAssociationsMixin<UsageRecord, UsageRecordId>;
  createUsageRecord!: Sequelize.HasManyCreateAssociationMixin<UsageRecord>;
  removeUsageRecord!: Sequelize.HasManyRemoveAssociationMixin<UsageRecord, UsageRecordId>;
  removeUsageRecords!: Sequelize.HasManyRemoveAssociationsMixin<UsageRecord, UsageRecordId>;
  hasUsageRecord!: Sequelize.HasManyHasAssociationMixin<UsageRecord, UsageRecordId>;
  hasUsageRecords!: Sequelize.HasManyHasAssociationsMixin<UsageRecord, UsageRecordId>;
  countUsageRecords!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UserAbstract via userId
  userAbstracts!: UserAbstract[];
  getUserAbstracts!: Sequelize.HasManyGetAssociationsMixin<UserAbstract>;
  setUserAbstracts!: Sequelize.HasManySetAssociationsMixin<UserAbstract, UserAbstractId>;
  addUserAbstract!: Sequelize.HasManyAddAssociationMixin<UserAbstract, UserAbstractId>;
  addUserAbstracts!: Sequelize.HasManyAddAssociationsMixin<UserAbstract, UserAbstractId>;
  createUserAbstract!: Sequelize.HasManyCreateAssociationMixin<UserAbstract>;
  removeUserAbstract!: Sequelize.HasManyRemoveAssociationMixin<UserAbstract, UserAbstractId>;
  removeUserAbstracts!: Sequelize.HasManyRemoveAssociationsMixin<UserAbstract, UserAbstractId>;
  hasUserAbstract!: Sequelize.HasManyHasAssociationMixin<UserAbstract, UserAbstractId>;
  hasUserAbstracts!: Sequelize.HasManyHasAssociationsMixin<UserAbstract, UserAbstractId>;
  countUserAbstracts!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UserAbstract via reviewerId
  reviewerUserAbstracts!: UserAbstract[];
  getReviewerUserAbstracts!: Sequelize.HasManyGetAssociationsMixin<UserAbstract>;
  setReviewerUserAbstracts!: Sequelize.HasManySetAssociationsMixin<UserAbstract, UserAbstractId>;
  addReviewerUserAbstract!: Sequelize.HasManyAddAssociationMixin<UserAbstract, UserAbstractId>;
  addReviewerUserAbstracts!: Sequelize.HasManyAddAssociationsMixin<UserAbstract, UserAbstractId>;
  createReviewerUserAbstract!: Sequelize.HasManyCreateAssociationMixin<UserAbstract>;
  removeReviewerUserAbstract!: Sequelize.HasManyRemoveAssociationMixin<UserAbstract, UserAbstractId>;
  removeReviewerUserAbstracts!: Sequelize.HasManyRemoveAssociationsMixin<UserAbstract, UserAbstractId>;
  hasReviewerUserAbstract!: Sequelize.HasManyHasAssociationMixin<UserAbstract, UserAbstractId>;
  hasReviewerUserAbstracts!: Sequelize.HasManyHasAssociationsMixin<UserAbstract, UserAbstractId>;
  countReviewerUserAbstracts!: Sequelize.HasManyCountAssociationsMixin;
  // User hasOne UserAuth via userId
  userAuth!: UserAuth;
  getUserAuth!: Sequelize.HasOneGetAssociationMixin<UserAuth>;
  setUserAuth!: Sequelize.HasOneSetAssociationMixin<UserAuth, UserAuthId>;
  createUserAuth!: Sequelize.HasOneCreateAssociationMixin<UserAuth>;
  // User hasMany UserCompany via userId
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
  // User hasMany UserCoupon via userId
  userCoupons!: UserCoupon[];
  getUserCoupons!: Sequelize.HasManyGetAssociationsMixin<UserCoupon>;
  setUserCoupons!: Sequelize.HasManySetAssociationsMixin<UserCoupon, UserCouponId>;
  addUserCoupon!: Sequelize.HasManyAddAssociationMixin<UserCoupon, UserCouponId>;
  addUserCoupons!: Sequelize.HasManyAddAssociationsMixin<UserCoupon, UserCouponId>;
  createUserCoupon!: Sequelize.HasManyCreateAssociationMixin<UserCoupon>;
  removeUserCoupon!: Sequelize.HasManyRemoveAssociationMixin<UserCoupon, UserCouponId>;
  removeUserCoupons!: Sequelize.HasManyRemoveAssociationsMixin<UserCoupon, UserCouponId>;
  hasUserCoupon!: Sequelize.HasManyHasAssociationMixin<UserCoupon, UserCouponId>;
  hasUserCoupons!: Sequelize.HasManyHasAssociationsMixin<UserCoupon, UserCouponId>;
  countUserCoupons!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UserData via userId
  userData!: UserData[];
  getUserData!: Sequelize.HasManyGetAssociationsMixin<UserData>;
  setUserData!: Sequelize.HasManySetAssociationsMixin<UserData, UserDataId>;
  addUserDatum!: Sequelize.HasManyAddAssociationMixin<UserData, UserDataId>;
  addUserData!: Sequelize.HasManyAddAssociationsMixin<UserData, UserDataId>;
  createUserDatum!: Sequelize.HasManyCreateAssociationMixin<UserData>;
  removeUserDatum!: Sequelize.HasManyRemoveAssociationMixin<UserData, UserDataId>;
  removeUserData!: Sequelize.HasManyRemoveAssociationsMixin<UserData, UserDataId>;
  hasUserDatum!: Sequelize.HasManyHasAssociationMixin<UserData, UserDataId>;
  hasUserData!: Sequelize.HasManyHasAssociationsMixin<UserData, UserDataId>;
  countUserData!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany UserRole via userId
  userRoles!: UserRole[];
  getUserRoles!: Sequelize.HasManyGetAssociationsMixin<UserRole>;
  setUserRoles!: Sequelize.HasManySetAssociationsMixin<UserRole, UserRoleId>;
  addUserRole!: Sequelize.HasManyAddAssociationMixin<UserRole, UserRoleId>;
  addUserRoles!: Sequelize.HasManyAddAssociationsMixin<UserRole, UserRoleId>;
  createUserRole!: Sequelize.HasManyCreateAssociationMixin<UserRole>;
  removeUserRole!: Sequelize.HasManyRemoveAssociationMixin<UserRole, UserRoleId>;
  removeUserRoles!: Sequelize.HasManyRemoveAssociationsMixin<UserRole, UserRoleId>;
  hasUserRole!: Sequelize.HasManyHasAssociationMixin<UserRole, UserRoleId>;
  hasUserRoles!: Sequelize.HasManyHasAssociationsMixin<UserRole, UserRoleId>;
  countUserRoles!: Sequelize.HasManyCountAssociationsMixin;
  // User hasMany Volunteer via userId
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
  // User hasMany VolunteerEvent via userId
  volunteerEvents!: VolunteerEvent[];
  getVolunteerEvents!: Sequelize.HasManyGetAssociationsMixin<VolunteerEvent>;
  setVolunteerEvents!: Sequelize.HasManySetAssociationsMixin<VolunteerEvent, VolunteerEventId>;
  addVolunteerEvent!: Sequelize.HasManyAddAssociationMixin<VolunteerEvent, VolunteerEventId>;
  addVolunteerEvents!: Sequelize.HasManyAddAssociationsMixin<VolunteerEvent, VolunteerEventId>;
  createVolunteerEvent!: Sequelize.HasManyCreateAssociationMixin<VolunteerEvent>;
  removeVolunteerEvent!: Sequelize.HasManyRemoveAssociationMixin<VolunteerEvent, VolunteerEventId>;
  removeVolunteerEvents!: Sequelize.HasManyRemoveAssociationsMixin<VolunteerEvent, VolunteerEventId>;
  hasVolunteerEvent!: Sequelize.HasManyHasAssociationMixin<VolunteerEvent, VolunteerEventId>;
  hasVolunteerEvents!: Sequelize.HasManyHasAssociationsMixin<VolunteerEvent, VolunteerEventId>;
  countVolunteerEvents!: Sequelize.HasManyCountAssociationsMixin;
  // User belongsTo UserStatus via statusId
  status!: UserStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<UserStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<UserStatus, UserStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<UserStatus>;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      field: 'phone_verified'
    },
    isSsoUser: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
      field: 'is_sso_user'
    },
    ssoMetadata: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'sso_metadata'
    },
    designation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deviceToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'device_token'
    },
    userDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_description'
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_status',
        key: 'id'
      },
      field: 'status_id'
    },
    acceptedTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'accepted_terms'
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
    tableName: 'user',
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
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "phone_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "phone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "phone" },
        ]
      },
      {
        name: "status_id",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "user_asset_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
    ]
  });
  }
}
