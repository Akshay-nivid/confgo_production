import type { Sequelize } from "sequelize";
import { Action as _Action } from "./Action";
import { MeetingMetadata as _MeetingMetadata } from "./meetingMetaData";
import type { ActionAttributes, ActionCreationAttributes } from "./Action";
import { Addon as _Addon } from "./Addon";
import type { AddonAttributes, AddonCreationAttributes } from "./Addon";
import { Asset as _Asset } from "./Asset";
import type { AssetAttributes, AssetCreationAttributes } from "./Asset";
import { Attendee as _Attendee } from "./Attendee";
import type { AttendeeAttributes, AttendeeCreationAttributes } from "./Attendee";
import { Cart as _Cart } from "./Cart";
import type { CartAttributes, CartCreationAttributes } from "./Cart";
import { CartItem as _CartItem } from "./CartItem";
import type { CartItemAttributes, CartItemCreationAttributes } from "./CartItem";
import { CartStatus as _CartStatus } from "./CartStatus";
import type { CartStatusAttributes, CartStatusCreationAttributes } from "./CartStatus";
import { Color as _Color } from "./Color";
import type { ColorAttributes, ColorCreationAttributes } from "./Color";
import { Company as _Company } from "./Company";
import type { CompanyAttributes, CompanyCreationAttributes } from "./Company";
import { CompanyPaypalConfiguration as _CompanyPaypalConfiguration } from "./CompanyPaypalConfiguration";
import type { CompanyPaypalConfigurationAttributes, CompanyPaypalConfigurationCreationAttributes } from "./CompanyPaypalConfiguration";
import { CompanyPaypalConfigurationStatus as _CompanyPaypalConfigurationStatus } from "./CompanyPaypalConfigurationStatus";
import type { CompanyPaypalConfigurationStatusAttributes, CompanyPaypalConfigurationStatusCreationAttributes } from "./CompanyPaypalConfigurationStatus";
import { CompanyStatus as _CompanyStatus } from "./CompanyStatus";
import type { CompanyStatusAttributes, CompanyStatusCreationAttributes } from "./CompanyStatus";
import { CompanyTax as _CompanyTax } from "./CompanyTax";
import type { CompanyTaxAttributes, CompanyTaxCreationAttributes } from "./CompanyTax";
import { Coupon as _Coupon } from "./Coupon";
import type { CouponAttributes, CouponCreationAttributes } from "./Coupon";
import { CouponStatus as _CouponStatus } from "./CouponStatus";
import type { CouponStatusAttributes, CouponStatusCreationAttributes } from "./CouponStatus";
import { CouponUsage as _CouponUsage } from "./CouponUsage";
import type { CouponUsageAttributes, CouponUsageCreationAttributes } from "./CouponUsage";
import { EmailConfig as _EmailConfig } from "./EmailConfig";
import type { EmailConfigAttributes, EmailConfigCreationAttributes } from "./EmailConfig";
import { Event as _Event } from "./Event";
import type { EventAttributes, EventCreationAttributes } from "./Event";
import { EventAddon as _EventAddon } from "./EventAddon";
import type { EventAddonAttributes, EventAddonCreationAttributes } from "./EventAddon";
import { EventAddonProperty as _EventAddonProperty } from "./EventAddonProperty";
import type { EventAddonPropertyAttributes, EventAddonPropertyCreationAttributes } from "./EventAddonProperty";
import { EventAddonStatus as _EventAddonStatus } from "./EventAddonStatus";
import type { EventAddonStatusAttributes, EventAddonStatusCreationAttributes } from "./EventAddonStatus";
import { EventContact as _EventContact } from "./EventContact";
import type { EventContactAttributes, EventContactCreationAttributes } from "./EventContact";
import { EventFeedback as _EventFeedback } from "./EventFeedback";
import type { EventFeedbackAttributes, EventFeedbackCreationAttributes } from "./EventFeedback";
import { EventGroup as _EventGroup } from "./EventGroup";
import type { EventGroupAttributes, EventGroupCreationAttributes } from "./EventGroup";
import { EventImages as _EventImages } from "./EventImages";
import type { EventImagesAttributes, EventImagesCreationAttributes } from "./EventImages";
import { EventNearbyAttraction as _EventNearbyAttraction } from "./EventNearbyAttraction";
import type { EventNearbyAttractionAttributes, EventNearbyAttractionCreationAttributes } from "./EventNearbyAttraction";
import { EventParticipant as _EventParticipant } from "./EventParticipant";
import type { EventParticipantAttributes, EventParticipantCreationAttributes } from "./EventParticipant";
import { EventParticipantEntry as _EventParticipantEntry } from "./EventParticipantEntry";
import type { EventParticipantEntryAttributes, EventParticipantEntryCreationAttributes } from "./EventParticipantEntry";
import { EventPriceTier as _EventPriceTier } from "./EventPriceTier";
import type { EventPriceTierAttributes, EventPriceTierCreationAttributes } from "./EventPriceTier";
import { EventProgramScheduleStatus as _EventProgramScheduleStatus } from "./EventProgramScheduleStatus";
import type { EventProgramScheduleStatusAttributes, EventProgramScheduleStatusCreationAttributes } from "./EventProgramScheduleStatus";
import { EventRegistration as _EventRegistration } from "./EventRegistration";
import type { EventRegistrationAttributes, EventRegistrationCreationAttributes } from "./EventRegistration";
import { EventRegistrationDetail as _EventRegistrationDetail } from "./EventRegistrationDetail";
import type { EventRegistrationDetailAttributes, EventRegistrationDetailCreationAttributes } from "./EventRegistrationDetail";
import { EventRegistrationDetailStatus as _EventRegistrationDetailStatus } from "./EventRegistrationDetailStatus";
import type { EventRegistrationDetailStatusAttributes, EventRegistrationDetailStatusCreationAttributes } from "./EventRegistrationDetailStatus";
import { EventRegistrationForm as _EventRegistrationForm } from "./EventRegistrationForm";
import type { EventRegistrationFormAttributes, EventRegistrationFormCreationAttributes } from "./EventRegistrationForm";
import { EventRegistrationRecord as _EventRegistrationRecord } from "./EventRegistrationRecord";
import type { EventRegistrationRecordAttributes, EventRegistrationRecordCreationAttributes } from "./EventRegistrationRecord";
import { EventRegistrationStatus as _EventRegistrationStatus } from "./EventRegistrationStatus";
import type { EventRegistrationStatusAttributes, EventRegistrationStatusCreationAttributes } from "./EventRegistrationStatus";
import { EventSpeaker as _EventSpeaker } from "./EventSpeaker";
import type { EventSpeakerAttributes, EventSpeakerCreationAttributes } from "./EventSpeaker";
import { EventSponsor as _EventSponsor } from "./EventSponsor";
import type { EventSponsorAttributes, EventSponsorCreationAttributes } from "./EventSponsor";
import { EventStatus as _EventStatus } from "./EventStatus";
import type { EventStatusAttributes, EventStatusCreationAttributes } from "./EventStatus";
import { ExtraPricing as _ExtraPricing } from "./ExtraPricing";
import type { ExtraPricingAttributes, ExtraPricingCreationAttributes } from "./ExtraPricing";
import { ExtraPricingStatus as _ExtraPricingStatus } from "./ExtraPricingStatus";
import type { ExtraPricingStatusAttributes, ExtraPricingStatusCreationAttributes } from "./ExtraPricingStatus";
import { JobHistory as _JobHistory } from "./JobHistory";
import type { JobHistoryAttributes, JobHistoryCreationAttributes } from "./JobHistory";
import { JobHistoryStatus as _JobHistoryStatus } from "./JobHistoryStatus";
import type { JobHistoryStatusAttributes, JobHistoryStatusCreationAttributes } from "./JobHistoryStatus";
import { Log as _Log } from "./Log";
import type { LogAttributes, LogCreationAttributes } from "./Log";
import { Notification as _Notification } from "./Notification";
import type { NotificationAttributes, NotificationCreationAttributes } from "./Notification";
import { NotificationSetting as _NotificationSetting } from "./NotificationSetting";
import type { NotificationSettingAttributes, NotificationSettingCreationAttributes } from "./NotificationSetting";
import { Order as _Order } from "./Order";
import type { OrderAttributes, OrderCreationAttributes } from "./Order";
import { OrderItem as _OrderItem } from "./OrderItem";
import type { OrderItemAttributes, OrderItemCreationAttributes } from "./OrderItem";
import { OrderStatus as _OrderStatus } from "./OrderStatus";
import type { OrderStatusAttributes, OrderStatusCreationAttributes } from "./OrderStatus";
import { Participant as _Participant } from "./Participant";
import type { ParticipantAttributes, ParticipantCreationAttributes } from "./Participant";
import { ParticipantGroup as _ParticipantGroup } from "./ParticipantGroup";
import type { ParticipantGroupAttributes, ParticipantGroupCreationAttributes } from "./ParticipantGroup";
import { ParticipantRole as _ParticipantRole } from "./ParticipantRole";
import type { ParticipantRoleAttributes, ParticipantRoleCreationAttributes } from "./ParticipantRole";
import { ParticipantType as _ParticipantType } from "./ParticipantType";
import type { ParticipantTypeAttributes, ParticipantTypeCreationAttributes } from "./ParticipantType";
import { Payment as _Payment } from "./Payment";
import type { PaymentAttributes, PaymentCreationAttributes } from "./Payment";
import { PaymentMethod as _PaymentMethod } from "./PaymentMethod";
import type { PaymentMethodAttributes, PaymentMethodCreationAttributes } from "./PaymentMethod";
import { Plan as _Plan } from "./Plan";
import type { PlanAttributes, PlanCreationAttributes } from "./Plan";
import { PlanProperty as _PlanProperty } from "./PlanProperty";
import type { PlanPropertyAttributes, PlanPropertyCreationAttributes } from "./PlanProperty";
import { PlanPropertyAssignment as _PlanPropertyAssignment } from "./PlanPropertyAssignment";
import type { PlanPropertyAssignmentAttributes, PlanPropertyAssignmentCreationAttributes } from "./PlanPropertyAssignment";
import { PlanPropertyAssignmentStatus as _PlanPropertyAssignmentStatus } from "./PlanPropertyAssignmentStatus";
import type { PlanPropertyAssignmentStatusAttributes, PlanPropertyAssignmentStatusCreationAttributes } from "./PlanPropertyAssignmentStatus";
import { PlanPropertyGroup as _PlanPropertyGroup } from "./PlanPropertyGroup";
import type { PlanPropertyGroupAttributes, PlanPropertyGroupCreationAttributes } from "./PlanPropertyGroup";
import { PlanPropertyStatus as _PlanPropertyStatus } from "./PlanPropertyStatus";
import type { PlanPropertyStatusAttributes, PlanPropertyStatusCreationAttributes } from "./PlanPropertyStatus";
import { PlanStatus as _PlanStatus } from "./PlanStatus";
import type { PlanStatusAttributes, PlanStatusCreationAttributes } from "./PlanStatus";
import { Resource as _Resource } from "./Resource";
import type { ResourceAttributes, ResourceCreationAttributes } from "./Resource";
import { Role as _Role } from "./Role";
import type { RoleAttributes, RoleCreationAttributes } from "./Role";
import { RoleDataPermission as _RoleDataPermission } from "./RoleDataPermission";
import type { RoleDataPermissionAttributes, RoleDataPermissionCreationAttributes } from "./RoleDataPermission";
import { RolePermission as _RolePermission } from "./RolePermission";
import type { RolePermissionAttributes, RolePermissionCreationAttributes } from "./RolePermission";
import { Sequelizemeta as _Sequelizemeta } from "./Sequelizemeta";
import type { SequelizemetaAttributes, SequelizemetaCreationAttributes } from "./Sequelizemeta";
import { SmsConfig as _SmsConfig } from "./SmsConfig";
import type { SmsConfigAttributes, SmsConfigCreationAttributes } from "./SmsConfig";
import { SmsConfigStatus as _SmsConfigStatus } from "./SmsConfigStatus";
import type { SmsConfigStatusAttributes, SmsConfigStatusCreationAttributes } from "./SmsConfigStatus";
import { SpeakerBio as _SpeakerBio } from "./SpeakerBio";
import type { SpeakerBioAttributes, SpeakerBioCreationAttributes } from "./SpeakerBio";
import { Specialty as _Specialty } from "./Specialty";
import type { SpecialtyAttributes, SpecialtyCreationAttributes } from "./Specialty";
import { Sponsor as _Sponsor } from "./Sponsor";
import type { SponsorAttributes, SponsorCreationAttributes } from "./Sponsor";
import { SponsorStatus as _SponsorStatus } from "./SponsorStatus";
import type { SponsorStatusAttributes, SponsorStatusCreationAttributes } from "./SponsorStatus";
import { SponsorType as _SponsorType } from "./SponsorType";
import type { SponsorTypeAttributes, SponsorTypeCreationAttributes } from "./SponsorType";
import { Subscription as _Subscription } from "./Subscription";
import type { SubscriptionAttributes, SubscriptionCreationAttributes } from "./Subscription";
import { SubscriptionExtraPricing as _SubscriptionExtraPricing } from "./SubscriptionExtraPricing";
import type { SubscriptionExtraPricingAttributes, SubscriptionExtraPricingCreationAttributes } from "./SubscriptionExtraPricing";
import { SubscriptionPayment as _SubscriptionPayment } from "./SubscriptionPayment";
import type { SubscriptionPaymentAttributes, SubscriptionPaymentCreationAttributes } from "./SubscriptionPayment";
import { SubscriptionStatus as _SubscriptionStatus } from "./SubscriptionStatus";
import type { SubscriptionStatusAttributes, SubscriptionStatusCreationAttributes } from "./SubscriptionStatus";
import { SystemLevelPayment as _SystemLevelPayment } from "./SystemLevelPayment";
import type { SystemLevelPaymentAttributes, SystemLevelPaymentCreationAttributes } from "./SystemLevelPayment";
import { Template as _Template } from "./Template";
import type { TemplateAttributes, TemplateCreationAttributes } from "./Template";
import { Token as _Token } from "./Token";
import type { TokenAttributes, TokenCreationAttributes } from "./Token";
import { TokenStatus as _TokenStatus } from "./TokenStatus";
import type { TokenStatusAttributes, TokenStatusCreationAttributes } from "./TokenStatus";
import { UsageRecord as _UsageRecord } from "./UsageRecord";
import type { UsageRecordAttributes, UsageRecordCreationAttributes } from "./UsageRecord";
import { User as _User } from "./User";
import type { UserAttributes, UserCreationAttributes } from "./User";
import { UserAbstract as _UserAbstract } from "./UserAbstract";
import type { UserAbstractAttributes, UserAbstractCreationAttributes } from "./UserAbstract";
import { UserAbstractStatus as _UserAbstractStatus } from "./UserAbstractStatus";
import type { UserAbstractStatusAttributes, UserAbstractStatusCreationAttributes } from "./UserAbstractStatus";
import { UserAuth as _UserAuth } from "./UserAuth";
import type { UserAuthAttributes, UserAuthCreationAttributes } from "./UserAuth";
import { UserCompany as _UserCompany } from "./UserCompany";
import type { UserCompanyAttributes, UserCompanyCreationAttributes } from "./UserCompany";
import { UserCoupon as _UserCoupon } from "./UserCoupon";
import type { UserCouponAttributes, UserCouponCreationAttributes } from "./UserCoupon";
import { UserData as _UserData } from "./UserData";
import type { UserDataAttributes, UserDataCreationAttributes } from "./UserData";
import { UserRole as _UserRole } from "./UserRole";
import type { UserRoleAttributes, UserRoleCreationAttributes } from "./UserRole";
import { UserStatus as _UserStatus } from "./UserStatus";
import type { UserStatusAttributes, UserStatusCreationAttributes } from "./UserStatus";
import { Venue as _Venue } from "./Venue";
import type { VenueAttributes, VenueCreationAttributes } from "./Venue";
import { Volunteer as _Volunteer } from "./Volunteer";
import type { VolunteerAttributes, VolunteerCreationAttributes } from "./Volunteer";
import { VolunteerEvent as _VolunteerEvent } from "./VolunteerEvent";
import type { VolunteerEventAttributes, VolunteerEventCreationAttributes } from "./VolunteerEvent";
import { VolunteerStatus as _VolunteerStatus } from "./VolunteerStatus";
import type { VolunteerStatusAttributes, VolunteerStatusCreationAttributes } from "./VolunteerStatus";

export {
  _Action as Action,
  _MeetingMetadata as MeetingMetadata,
  _Addon as Addon,
  _Asset as Asset,
  _Attendee as Attendee,
  _Cart as Cart,
  _CartItem as CartItem,
  _CartStatus as CartStatus,
  _Color as Color,
  _Company as Company,
  _CompanyPaypalConfiguration as CompanyPaypalConfiguration,
  _CompanyPaypalConfigurationStatus as CompanyPaypalConfigurationStatus,
  _CompanyStatus as CompanyStatus,
  _CompanyTax as CompanyTax,
  _Coupon as Coupon,
  _CouponStatus as CouponStatus,
  _CouponUsage as CouponUsage,
  _EmailConfig as EmailConfig,
  _Event as Event,
  _EventAddon as EventAddon,
  _EventAddonProperty as EventAddonProperty,
  _EventAddonStatus as EventAddonStatus,
  _EventContact as EventContact,
  _EventFeedback as EventFeedback,
  _EventGroup as EventGroup,
  _EventImages as EventImages,
  _EventNearbyAttraction as EventNearbyAttraction,
  _EventParticipant as EventParticipant,
  _EventParticipantEntry as EventParticipantEntry,
  _EventPriceTier as EventPriceTier,
  _EventProgramScheduleStatus as EventProgramScheduleStatus,
  _EventRegistration as EventRegistration,
  _EventRegistrationDetail as EventRegistrationDetail,
  _EventRegistrationDetailStatus as EventRegistrationDetailStatus,
  _EventRegistrationForm as EventRegistrationForm,
  _EventRegistrationRecord as EventRegistrationRecord,
  _EventRegistrationStatus as EventRegistrationStatus,
  _EventSpeaker as EventSpeaker,
  _EventSponsor as EventSponsor,
  _EventStatus as EventStatus,
  _ExtraPricing as ExtraPricing,
  _ExtraPricingStatus as ExtraPricingStatus,
  _JobHistory as JobHistory,
  _JobHistoryStatus as JobHistoryStatus,
  _Log as Log,
  _Notification as Notification,
  _NotificationSetting as NotificationSetting,
  _Order as Order,
  _OrderItem as OrderItem,
  _OrderStatus as OrderStatus,
  _Participant as Participant,
  _ParticipantGroup as ParticipantGroup,
  _ParticipantRole as ParticipantRole,
  _ParticipantType as ParticipantType,
  _Payment as Payment,
  _PaymentMethod as PaymentMethod,
  _Plan as Plan,
  _PlanProperty as PlanProperty,
  _PlanPropertyAssignment as PlanPropertyAssignment,
  _PlanPropertyAssignmentStatus as PlanPropertyAssignmentStatus,
  _PlanPropertyGroup as PlanPropertyGroup,
  _PlanPropertyStatus as PlanPropertyStatus,
  _PlanStatus as PlanStatus,
  _Resource as Resource,
  _Role as Role,
  _RoleDataPermission as RoleDataPermission,
  _RolePermission as RolePermission,
  _Sequelizemeta as Sequelizemeta,
  _SmsConfig as SmsConfig,
  _SmsConfigStatus as SmsConfigStatus,
  _SpeakerBio as SpeakerBio,
  _Specialty as Specialty,
  _Sponsor as Sponsor,
  _SponsorStatus as SponsorStatus,
  _SponsorType as SponsorType,
  _Subscription as Subscription,
  _SubscriptionExtraPricing as SubscriptionExtraPricing,
  _SubscriptionPayment as SubscriptionPayment,
  _SubscriptionStatus as SubscriptionStatus,
  _SystemLevelPayment as SystemLevelPayment,
  _Template as Template,
  _Token as Token,
  _TokenStatus as TokenStatus,
  _UsageRecord as UsageRecord,
  _User as User,
  _UserAbstract as UserAbstract,
  _UserAbstractStatus as UserAbstractStatus,
  _UserAuth as UserAuth,
  _UserCompany as UserCompany,
  _UserCoupon as UserCoupon,
  _UserData as UserData,
  _UserRole as UserRole,
  _UserStatus as UserStatus,
  _Venue as Venue,
  _Volunteer as Volunteer,
  _VolunteerEvent as VolunteerEvent,
  _VolunteerStatus as VolunteerStatus,
};

export type {
  ActionAttributes,
  ActionCreationAttributes,
  AddonAttributes,
  AddonCreationAttributes,
  AssetAttributes,
  AssetCreationAttributes,
  AttendeeAttributes,
  AttendeeCreationAttributes,
  CartAttributes,
  CartCreationAttributes,
  CartItemAttributes,
  CartItemCreationAttributes,
  CartStatusAttributes,
  CartStatusCreationAttributes,
  ColorAttributes,
  ColorCreationAttributes,
  CompanyAttributes,
  CompanyCreationAttributes,
  CompanyPaypalConfigurationAttributes,
  CompanyPaypalConfigurationCreationAttributes,
  CompanyPaypalConfigurationStatusAttributes,
  CompanyPaypalConfigurationStatusCreationAttributes,
  CompanyStatusAttributes,
  CompanyStatusCreationAttributes,
  CompanyTaxAttributes,
  CompanyTaxCreationAttributes,
  CouponAttributes,
  CouponCreationAttributes,
  CouponStatusAttributes,
  CouponStatusCreationAttributes,
  CouponUsageAttributes,
  CouponUsageCreationAttributes,
  EmailConfigAttributes,
  EmailConfigCreationAttributes,
  EventAttributes,
  EventCreationAttributes,
  EventAddonAttributes,
  EventAddonCreationAttributes,
  EventAddonPropertyAttributes,
  EventAddonPropertyCreationAttributes,
  EventAddonStatusAttributes,
  EventAddonStatusCreationAttributes,
  EventContactAttributes,
  EventContactCreationAttributes,
  EventFeedbackAttributes,
  EventFeedbackCreationAttributes,
  EventGroupAttributes,
  EventGroupCreationAttributes,
  EventImagesAttributes,
  EventImagesCreationAttributes,
  EventNearbyAttractionAttributes,
  EventNearbyAttractionCreationAttributes,
  EventParticipantAttributes,
  EventParticipantCreationAttributes,
  EventParticipantEntryAttributes,
  EventParticipantEntryCreationAttributes,
  EventPriceTierAttributes,
  EventPriceTierCreationAttributes,
  EventProgramScheduleStatusAttributes,
  EventProgramScheduleStatusCreationAttributes,
  EventRegistrationAttributes,
  EventRegistrationCreationAttributes,
  EventRegistrationDetailAttributes,
  EventRegistrationDetailCreationAttributes,
  EventRegistrationDetailStatusAttributes,
  EventRegistrationDetailStatusCreationAttributes,
  EventRegistrationFormAttributes,
  EventRegistrationFormCreationAttributes,
  EventRegistrationRecordAttributes,
  EventRegistrationRecordCreationAttributes,
  EventRegistrationStatusAttributes,
  EventRegistrationStatusCreationAttributes,
  EventSpeakerAttributes,
  EventSpeakerCreationAttributes,
  EventSponsorAttributes,
  EventSponsorCreationAttributes,
  EventStatusAttributes,
  EventStatusCreationAttributes,
  ExtraPricingAttributes,
  ExtraPricingCreationAttributes,
  ExtraPricingStatusAttributes,
  ExtraPricingStatusCreationAttributes,
  JobHistoryAttributes,
  JobHistoryCreationAttributes,
  JobHistoryStatusAttributes,
  JobHistoryStatusCreationAttributes,
  LogAttributes,
  LogCreationAttributes,
  NotificationAttributes,
  NotificationCreationAttributes,
  NotificationSettingAttributes,
  NotificationSettingCreationAttributes,
  OrderAttributes,
  OrderCreationAttributes,
  OrderItemAttributes,
  OrderItemCreationAttributes,
  OrderStatusAttributes,
  OrderStatusCreationAttributes,
  ParticipantAttributes,
  ParticipantCreationAttributes,
  ParticipantGroupAttributes,
  ParticipantGroupCreationAttributes,
  ParticipantRoleAttributes,
  ParticipantRoleCreationAttributes,
  ParticipantTypeAttributes,
  ParticipantTypeCreationAttributes,
  PaymentAttributes,
  PaymentCreationAttributes,
  PaymentMethodAttributes,
  PaymentMethodCreationAttributes,
  PlanAttributes,
  PlanCreationAttributes,
  PlanPropertyAttributes,
  PlanPropertyCreationAttributes,
  PlanPropertyAssignmentAttributes,
  PlanPropertyAssignmentCreationAttributes,
  PlanPropertyAssignmentStatusAttributes,
  PlanPropertyAssignmentStatusCreationAttributes,
  PlanPropertyGroupAttributes,
  PlanPropertyGroupCreationAttributes,
  PlanPropertyStatusAttributes,
  PlanPropertyStatusCreationAttributes,
  PlanStatusAttributes,
  PlanStatusCreationAttributes,
  ResourceAttributes,
  ResourceCreationAttributes,
  RoleAttributes,
  RoleCreationAttributes,
  RoleDataPermissionAttributes,
  RoleDataPermissionCreationAttributes,
  RolePermissionAttributes,
  RolePermissionCreationAttributes,
  SequelizemetaAttributes,
  SequelizemetaCreationAttributes,
  SmsConfigAttributes,
  SmsConfigCreationAttributes,
  SmsConfigStatusAttributes,
  SmsConfigStatusCreationAttributes,
  SpeakerBioAttributes,
  SpeakerBioCreationAttributes,
  SpecialtyAttributes,
  SpecialtyCreationAttributes,
  SponsorAttributes,
  SponsorCreationAttributes,
  SponsorStatusAttributes,
  SponsorStatusCreationAttributes,
  SponsorTypeAttributes,
  SponsorTypeCreationAttributes,
  SubscriptionAttributes,
  SubscriptionCreationAttributes,
  SubscriptionExtraPricingAttributes,
  SubscriptionExtraPricingCreationAttributes,
  SubscriptionPaymentAttributes,
  SubscriptionPaymentCreationAttributes,
  SubscriptionStatusAttributes,
  SubscriptionStatusCreationAttributes,
  SystemLevelPaymentAttributes,
  SystemLevelPaymentCreationAttributes,
  TemplateAttributes,
  TemplateCreationAttributes,
  TokenAttributes,
  TokenCreationAttributes,
  TokenStatusAttributes,
  TokenStatusCreationAttributes,
  UsageRecordAttributes,
  UsageRecordCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
  UserAbstractAttributes,
  UserAbstractCreationAttributes,
  UserAbstractStatusAttributes,
  UserAbstractStatusCreationAttributes,
  UserAuthAttributes,
  UserAuthCreationAttributes,
  UserCompanyAttributes,
  UserCompanyCreationAttributes,
  UserCouponAttributes,
  UserCouponCreationAttributes,
  UserDataAttributes,
  UserDataCreationAttributes,
  UserRoleAttributes,
  UserRoleCreationAttributes,
  UserStatusAttributes,
  UserStatusCreationAttributes,
  VenueAttributes,
  VenueCreationAttributes,
  VolunteerAttributes,
  VolunteerCreationAttributes,
  VolunteerEventAttributes,
  VolunteerEventCreationAttributes,
  VolunteerStatusAttributes,
  VolunteerStatusCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Action = _Action.initModel(sequelize);
  const MeetingMetadata = _MeetingMetadata.initModel(sequelize);
  const Addon = _Addon.initModel(sequelize);
  const Asset = _Asset.initModel(sequelize);
  const Attendee = _Attendee.initModel(sequelize);
  const Cart = _Cart.initModel(sequelize);
  const CartItem = _CartItem.initModel(sequelize);
  const CartStatus = _CartStatus.initModel(sequelize);
  const Color = _Color.initModel(sequelize);
  const Company = _Company.initModel(sequelize);
  const CompanyPaypalConfiguration = _CompanyPaypalConfiguration.initModel(sequelize);
  const CompanyPaypalConfigurationStatus = _CompanyPaypalConfigurationStatus.initModel(sequelize);
  const CompanyStatus = _CompanyStatus.initModel(sequelize);
  const CompanyTax = _CompanyTax.initModel(sequelize);
  const Coupon = _Coupon.initModel(sequelize);
  const CouponStatus = _CouponStatus.initModel(sequelize);
  const CouponUsage = _CouponUsage.initModel(sequelize);
  const EmailConfig = _EmailConfig.initModel(sequelize);
  const Event = _Event.initModel(sequelize);
  const EventAddon = _EventAddon.initModel(sequelize);
  const EventAddonProperty = _EventAddonProperty.initModel(sequelize);
  const EventAddonStatus = _EventAddonStatus.initModel(sequelize);
  const EventContact = _EventContact.initModel(sequelize);
  const EventFeedback = _EventFeedback.initModel(sequelize);
  const EventGroup = _EventGroup.initModel(sequelize);
  const EventImages = _EventImages.initModel(sequelize);
  const EventNearbyAttraction = _EventNearbyAttraction.initModel(sequelize);
  const EventParticipant = _EventParticipant.initModel(sequelize);
  const EventParticipantEntry = _EventParticipantEntry.initModel(sequelize);
  const EventPriceTier = _EventPriceTier.initModel(sequelize);
  const EventProgramScheduleStatus = _EventProgramScheduleStatus.initModel(sequelize);
  const EventRegistration = _EventRegistration.initModel(sequelize);
  const EventRegistrationDetail = _EventRegistrationDetail.initModel(sequelize);
  const EventRegistrationDetailStatus = _EventRegistrationDetailStatus.initModel(sequelize);
  const EventRegistrationForm = _EventRegistrationForm.initModel(sequelize);
  const EventRegistrationRecord = _EventRegistrationRecord.initModel(sequelize);
  const EventRegistrationStatus = _EventRegistrationStatus.initModel(sequelize);
  const EventSpeaker = _EventSpeaker.initModel(sequelize);
  const EventSponsor = _EventSponsor.initModel(sequelize);
  const EventStatus = _EventStatus.initModel(sequelize);
  const ExtraPricing = _ExtraPricing.initModel(sequelize);
  const ExtraPricingStatus = _ExtraPricingStatus.initModel(sequelize);
  const JobHistory = _JobHistory.initModel(sequelize);
  const JobHistoryStatus = _JobHistoryStatus.initModel(sequelize);
  const Log = _Log.initModel(sequelize);
  const Notification = _Notification.initModel(sequelize);
  const NotificationSetting = _NotificationSetting.initModel(sequelize);
  const Order = _Order.initModel(sequelize);
  const OrderItem = _OrderItem.initModel(sequelize);
  const OrderStatus = _OrderStatus.initModel(sequelize);
  const Participant = _Participant.initModel(sequelize);
  const ParticipantGroup = _ParticipantGroup.initModel(sequelize);
  const ParticipantRole = _ParticipantRole.initModel(sequelize);
  const ParticipantType = _ParticipantType.initModel(sequelize);
  const Payment = _Payment.initModel(sequelize);
  const PaymentMethod = _PaymentMethod.initModel(sequelize);
  const Plan = _Plan.initModel(sequelize);
  const PlanProperty = _PlanProperty.initModel(sequelize);
  const PlanPropertyAssignment = _PlanPropertyAssignment.initModel(sequelize);
  const PlanPropertyAssignmentStatus = _PlanPropertyAssignmentStatus.initModel(sequelize);
  const PlanPropertyGroup = _PlanPropertyGroup.initModel(sequelize);
  const PlanPropertyStatus = _PlanPropertyStatus.initModel(sequelize);
  const PlanStatus = _PlanStatus.initModel(sequelize);
  const Resource = _Resource.initModel(sequelize);
  const Role = _Role.initModel(sequelize);
  const RoleDataPermission = _RoleDataPermission.initModel(sequelize);
  const RolePermission = _RolePermission.initModel(sequelize);
  const Sequelizemeta = _Sequelizemeta.initModel(sequelize);
  const SmsConfig = _SmsConfig.initModel(sequelize);
  const SmsConfigStatus = _SmsConfigStatus.initModel(sequelize);
  const SpeakerBio = _SpeakerBio.initModel(sequelize);
  const Specialty = _Specialty.initModel(sequelize);
  const Sponsor = _Sponsor.initModel(sequelize);
  const SponsorStatus = _SponsorStatus.initModel(sequelize);
  const SponsorType = _SponsorType.initModel(sequelize);
  const Subscription = _Subscription.initModel(sequelize);
  const SubscriptionExtraPricing = _SubscriptionExtraPricing.initModel(sequelize);
  const SubscriptionPayment = _SubscriptionPayment.initModel(sequelize);
  const SubscriptionStatus = _SubscriptionStatus.initModel(sequelize);
  const SystemLevelPayment = _SystemLevelPayment.initModel(sequelize);
  const Template = _Template.initModel(sequelize);
  const Token = _Token.initModel(sequelize);
  const TokenStatus = _TokenStatus.initModel(sequelize);
  const UsageRecord = _UsageRecord.initModel(sequelize);
  const User = _User.initModel(sequelize);
  const UserAbstract = _UserAbstract.initModel(sequelize);
  const UserAbstractStatus = _UserAbstractStatus.initModel(sequelize);
  const UserAuth = _UserAuth.initModel(sequelize);
  const UserCompany = _UserCompany.initModel(sequelize);
  const UserCoupon = _UserCoupon.initModel(sequelize);
  const UserData = _UserData.initModel(sequelize);
  const UserRole = _UserRole.initModel(sequelize);
  const UserStatus = _UserStatus.initModel(sequelize);
  const Venue = _Venue.initModel(sequelize);
  const Volunteer = _Volunteer.initModel(sequelize);
  const VolunteerEvent = _VolunteerEvent.initModel(sequelize);
  const VolunteerStatus = _VolunteerStatus.initModel(sequelize);

   MeetingMetadata.belongsTo(User, {foreignKey: "userId",as: "user",});
   MeetingMetadata.belongsTo(Event, {foreignKey: "eventId",as: "event",});
  RoleDataPermission.belongsTo(Action, { as: "action", foreignKey: "actionId"});
  Action.hasMany(RoleDataPermission, { as: "roleDataPermissions", foreignKey: "actionId"});
  RolePermission.belongsTo(Action, { as: "action", foreignKey: "actionId"});
  Action.hasMany(RolePermission, { as: "rolePermissions", foreignKey: "actionId"});
  EventAddon.belongsTo(Addon, { as: "addon", foreignKey: "addonId"});
  Addon.hasMany(EventAddon, { as: "eventAddons", foreignKey: "addonId"});
  Addon.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(Addon, { as: "addons", foreignKey: "assetId"});
  Company.belongsTo(Asset, { as: "assetAsset", foreignKey: "assetId"});
  Asset.hasMany(Company, { as: "assetCompanies", foreignKey: "assetId"});
  Event.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(Event, { as: "events", foreignKey: "assetId"});
  EventAddonProperty.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(EventAddonProperty, { as: "eventAddonProperties", foreignKey: "assetId"});
  EventImages.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(EventImages, { as: "eventImages", foreignKey: "assetId"});
  EventNearbyAttraction.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(EventNearbyAttraction, { as: "eventNearbyAttractions", foreignKey: "assetId"});
  Plan.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(Plan, { as: "plans", foreignKey: "assetId"});
  PlanProperty.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(PlanProperty, { as: "planProperties", foreignKey: "assetId"});
  SpeakerBio.belongsTo(Asset, { as: "file", foreignKey: "fileId"});
  Asset.hasMany(SpeakerBio, { as: "speakerBios", foreignKey: "fileId"});
  Sponsor.belongsTo(Asset, { as: "bannerImgAsset", foreignKey: "bannerImgAssetId"});
  Asset.hasMany(Sponsor, { as: "sponsors", foreignKey: "bannerImgAssetId"});
  Sponsor.belongsTo(Asset, { as: "logoAsset", foreignKey: "logoAssetId"});
  Asset.hasMany(Sponsor, { as: "logoAssetSponsors", foreignKey: "logoAssetId"});
  Template.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(Template, { as: "templates", foreignKey: "assetId"});
  User.belongsTo(Asset, { as: "assetAsset", foreignKey: "assetId"});
  Asset.hasMany(User, { as: "assetUsers", foreignKey: "assetId"});
  UserAbstract.belongsTo(Asset, { as: "asset", foreignKey: "assetId"});
  Asset.hasMany(UserAbstract, { as: "userAbstracts", foreignKey: "assetId"});
  CartItem.belongsTo(Cart, { as: "cart", foreignKey: "cartId"});
  Cart.hasMany(CartItem, { as: "cartItems", foreignKey: "cartId"});
  Cart.belongsTo(CartStatus, { as: "status", foreignKey: "statusId"});
  CartStatus.hasMany(Cart, { as: "carts", foreignKey: "statusId"});
  Event.belongsTo(Color, { as: "color", foreignKey: "colorId"});
  Color.hasMany(Event, { as: "events", foreignKey: "colorId"});
  Addon.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Addon, { as: "addons", foreignKey: "companyId"});
  Asset.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Asset, { as: "assets", foreignKey: "companyId"});
  Cart.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Cart, { as: "carts", foreignKey: "companyId"});
  CompanyPaypalConfiguration.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(CompanyPaypalConfiguration, { as: "companyPaypalConfigurations", foreignKey: "companyId"});
  Coupon.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Coupon, { as: "coupons", foreignKey: "companyId"});
  Event.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Event, { as: "events", foreignKey: "companyId"});
  EventAddon.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(EventAddon, { as: "eventAddons", foreignKey: "companyId"});
  EventRegistrationDetail.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(EventRegistrationDetail, { as: "eventRegistrationDetails", foreignKey: "companyId"});
  Order.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Order, { as: "orders", foreignKey: "companyId"});
  ParticipantGroup.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(ParticipantGroup, { as: "participantGroups", foreignKey: "companyId"});
  ParticipantRole.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(ParticipantRole, { as: "participantRoles", foreignKey: "companyId"});
  Payment.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Payment, { as: "payments", foreignKey: "companyId"});
  UserCompany.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(UserCompany, { as: "userCompanies", foreignKey: "companyId"});
  Volunteer.belongsTo(Company, { as: "company", foreignKey: "companyId"});
  Company.hasMany(Volunteer, { as: "volunteers", foreignKey: "companyId"});
  CompanyPaypalConfiguration.belongsTo(CompanyPaypalConfigurationStatus, { as: "status", foreignKey: "statusId"});
  CompanyPaypalConfigurationStatus.hasMany(CompanyPaypalConfiguration, { as: "companyPaypalConfigurations", foreignKey: "statusId"});
  Company.belongsTo(CompanyStatus, { as: "status", foreignKey: "statusId"});
  CompanyStatus.hasMany(Company, { as: "companies", foreignKey: "statusId"});
  CouponUsage.belongsTo(Coupon, { as: "coupon", foreignKey: "couponId"});
  Coupon.hasMany(CouponUsage, { as: "couponUsages", foreignKey: "couponId"});
  UserCoupon.belongsTo(Coupon, { as: "coupon", foreignKey: "couponId"});
  Coupon.hasMany(UserCoupon, { as: "userCoupons", foreignKey: "couponId"});
  Coupon.belongsTo(CouponStatus, { as: "status", foreignKey: "statusId"});
  CouponStatus.hasMany(Coupon, { as: "coupons", foreignKey: "statusId"});
  Attendee.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(Attendee, { as: "attendees", foreignKey: "parentEventId"});
  Attendee.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(Attendee, { as: "eventAttendees", foreignKey: "eventId"});
  Cart.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(Cart, { as: "carts", foreignKey: "parentEventId"});
  CartItem.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(CartItem, { as: "cartItems", foreignKey: "eventId"});
  CompanyPaypalConfiguration.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(CompanyPaypalConfiguration, { as: "companyPaypalConfigurations", foreignKey: "eventId"});
  Event.belongsTo(Event, { as: "parent", foreignKey: "parentId"});
  Event.hasMany(Event, { as: "events", foreignKey: "parentId"});
  EventAddon.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventAddon, { as: "eventAddons", foreignKey: "eventId"});
  EventContact.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventContact, { as: "eventContacts", foreignKey: "eventId"});
  EventFeedback.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventFeedback, { as: "eventFeedbacks", foreignKey: "eventId"});
  EventGroup.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventGroup, { as: "eventGroups", foreignKey: "eventId"});
  EventImages.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventImages, { as: "eventImages", foreignKey: "eventId"});
  EventNearbyAttraction.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventNearbyAttraction, { as: "eventNearbyAttractions", foreignKey: "eventId"});
  EventParticipant.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventParticipant, { as: "eventParticipants", foreignKey: "eventId"});
  EventParticipantEntry.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventParticipantEntry, { as: "eventParticipantEntries", foreignKey: "eventId"});
  EventParticipantEntry.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(EventParticipantEntry, { as: "parentEventEventParticipantEntries", foreignKey: "parentEventId"});
  EventPriceTier.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventPriceTier, { as: "eventPriceTiers", foreignKey: "eventId"});
  EventRegistration.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventRegistration, { as: "eventRegistrations", foreignKey: "eventId"});
  EventRegistrationDetail.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventRegistrationDetail, { as: "eventRegistrationDetails", foreignKey: "eventId"});
  EventRegistrationForm.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventRegistrationForm, { as: "eventRegistrationForms", foreignKey: "eventId"});
  EventRegistrationRecord.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventRegistrationRecord, { as: "eventRegistrationRecords", foreignKey: "eventId"});
  EventSpeaker.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventSpeaker, { as: "eventSpeakers", foreignKey: "eventId"});
  EventSpeaker.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(EventSpeaker, { as: "parentEventEventSpeakers", foreignKey: "parentEventId"});
  EventSponsor.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "eventId"});
  EventSponsor.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(EventSponsor, { as: "parentEventEventSponsors", foreignKey: "parentEventId"});
  Notification.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(Notification, { as: "notifications", foreignKey: "eventId"});
  Order.belongsTo(Event, { as: "parentEvent", foreignKey: "parentEventId"});
  Event.hasMany(Order, { as: "orders", foreignKey: "parentEventId"});
  OrderItem.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(OrderItem, { as: "orderItems", foreignKey: "eventId"});
  Participant.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(Participant, { as: "participants", foreignKey: "eventId"});
  ParticipantType.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(ParticipantType, { as: "participantTypes", foreignKey: "eventId"});
  Payment.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(Payment, { as: "payments", foreignKey: "eventId"});
  UserAbstract.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(UserAbstract, { as: "userAbstracts", foreignKey: "eventId"});
  UserCoupon.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(UserCoupon, { as: "userCoupons", foreignKey: "eventId"});
  VolunteerEvent.belongsTo(Event, { as: "event", foreignKey: "eventId"});
  Event.hasMany(VolunteerEvent, { as: "volunteerEvents", foreignKey: "eventId"});
  Attendee.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(Attendee, { as: "attendees", foreignKey: "eventAddonId"});
  CartItem.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(CartItem, { as: "cartItems", foreignKey: "eventAddonId"});
  EventAddonProperty.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(EventAddonProperty, { as: "eventAddonProperties", foreignKey: "eventAddonId"});
  EventParticipant.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(EventParticipant, { as: "eventParticipants", foreignKey: "eventAddonId"});
  EventSponsor.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "eventAddonId"});
  OrderItem.belongsTo(EventAddon, { as: "eventAddon", foreignKey: "eventAddonId"});
  EventAddon.hasMany(OrderItem, { as: "orderItems", foreignKey: "eventAddonId"});
  Attendee.belongsTo(EventAddonProperty, { as: "eventAddonProperty", foreignKey: "eventAddonPropertyId"});
  EventAddonProperty.hasMany(Attendee, { as: "attendees", foreignKey: "eventAddonPropertyId"});
  CartItem.belongsTo(EventAddonProperty, { as: "eventAddonProperty", foreignKey: "eventAddonPropertyId"});
  EventAddonProperty.hasMany(CartItem, { as: "cartItems", foreignKey: "eventAddonPropertyId"});
  EventParticipant.belongsTo(EventAddonProperty, { as: "eventAddonProperty", foreignKey: "eventAddonPropertyId"});
  EventAddonProperty.hasMany(EventParticipant, { as: "eventParticipants", foreignKey: "eventAddonPropertyId"});
  EventSponsor.belongsTo(EventAddonProperty, { as: "eventAddonProperty", foreignKey: "eventAddonPropertyId"});
  EventAddonProperty.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "eventAddonPropertyId"});
  OrderItem.belongsTo(EventAddonProperty, { as: "eventAddonProperty", foreignKey: "eventAddonPropertyId"});
  EventAddonProperty.hasMany(OrderItem, { as: "orderItems", foreignKey: "eventAddonPropertyId"});
  EventAddon.belongsTo(EventAddonStatus, { as: "status", foreignKey: "statusId"});
  EventAddonStatus.hasMany(EventAddon, { as: "eventAddons", foreignKey: "statusId"});
  EventSpeaker.belongsTo(EventProgramScheduleStatus, { as: "status", foreignKey: "statusId"});
  EventProgramScheduleStatus.hasMany(EventSpeaker, { as: "eventSpeakers", foreignKey: "statusId"});
  EventRegistrationDetail.belongsTo(EventRegistrationDetailStatus, { as: "status", foreignKey: "statusId"});
  EventRegistrationDetailStatus.hasMany(EventRegistrationDetail, { as: "eventRegistrationDetails", foreignKey: "statusId"});
  EventRegistrationRecord.belongsTo(EventRegistrationForm, { as: "eventRegistrationForm", foreignKey: "eventRegistrationFormId"});
  EventRegistrationForm.hasMany(EventRegistrationRecord, { as: "eventRegistrationRecords", foreignKey: "eventRegistrationFormId"});
  EventRegistration.belongsTo(EventRegistrationStatus, { as: "status", foreignKey: "statusId"});
  EventRegistrationStatus.hasMany(EventRegistration, { as: "eventRegistrations", foreignKey: "statusId"});
  SpeakerBio.belongsTo(EventSpeaker, { as: "eventSpeaker", foreignKey: "eventSpeakerId"});
  EventSpeaker.hasMany(SpeakerBio, { as: "speakerBios", foreignKey: "eventSpeakerId"});
  Event.belongsTo(EventStatus, { as: "status", foreignKey: "statusId"});
  EventStatus.hasMany(Event, { as: "events", foreignKey: "statusId"});
  SubscriptionExtraPricing.belongsTo(ExtraPricing, { as: "extraPricing", foreignKey: "extraPricingId"});
  ExtraPricing.hasMany(SubscriptionExtraPricing, { as: "subscriptionExtraPricings", foreignKey: "extraPricingId"});
  ExtraPricing.belongsTo(ExtraPricingStatus, { as: "status", foreignKey: "statusId"});
  ExtraPricingStatus.hasMany(ExtraPricing, { as: "extraPricings", foreignKey: "statusId"});
  JobHistory.belongsTo(JobHistoryStatus, { as: "status", foreignKey: "statusId"});
  JobHistoryStatus.hasMany(JobHistory, { as: "jobHistories", foreignKey: "statusId"});
  OrderItem.belongsTo(Order, { as: "order", foreignKey: "orderId"});
  Order.hasMany(OrderItem, { as: "orderItems", foreignKey: "orderId"});
  Payment.belongsTo(Order, { as: "order", foreignKey: "orderId"});
  Order.hasMany(Payment, { as: "payments", foreignKey: "orderId"});
  SubscriptionPayment.belongsTo(Order, { as: "order", foreignKey: "orderId"});
  Order.hasMany(SubscriptionPayment, { as: "subscriptionPayments", foreignKey: "orderId"});
  Order.belongsTo(OrderStatus, { as: "status", foreignKey: "statusId"});
  OrderStatus.hasMany(Order, { as: "orders", foreignKey: "statusId"});
  Attendee.belongsTo(Participant, { as: "participant", foreignKey: "participantId"});
  Participant.hasMany(Attendee, { as: "attendees", foreignKey: "participantId"});
  EventParticipant.belongsTo(Participant, { as: "participant", foreignKey: "participantId"});
  Participant.hasMany(EventParticipant, { as: "eventParticipants", foreignKey: "participantId"});
  EventRegistrationRecord.belongsTo(Participant, { as: "participant", foreignKey: "participantId"});
  Participant.hasMany(EventRegistrationRecord, { as: "eventRegistrationRecords", foreignKey: "participantId"});
  ParticipantGroup.belongsTo(Participant, { as: "participant", foreignKey: "participantId"});
  Participant.hasMany(ParticipantGroup, { as: "participantGroups", foreignKey: "participantId"});
  Cart.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(Cart, { as: "carts", foreignKey: "participantTypeId"});
  EventParticipantEntry.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(EventParticipantEntry, { as: "eventParticipantEntries", foreignKey: "participantTypeId"});
  EventPriceTier.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(EventPriceTier, { as: "eventPriceTiers", foreignKey: "participantTypeId"});
  EventRegistrationForm.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(EventRegistrationForm, { as: "eventRegistrationForms", foreignKey: "participantTypeId"});
  Order.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(Order, { as: "orders", foreignKey: "participantTypeId"});
  Participant.belongsTo(ParticipantType, { as: "participantType", foreignKey: "participantTypeId"});
  ParticipantType.hasMany(Participant, { as: "participants", foreignKey: "participantTypeId"});
  Subscription.belongsTo(Payment, { as: "payment", foreignKey: "paymentId"});
  Payment.hasMany(Subscription, { as: "subscriptions", foreignKey: "paymentId"});
  Payment.belongsTo(PaymentMethod, { as: "paymentMethod", foreignKey: "paymentMethodId"});
  PaymentMethod.hasMany(Payment, { as: "payments", foreignKey: "paymentMethodId"});
  SubscriptionPayment.belongsTo(PaymentMethod, { as: "paymentMethod", foreignKey: "paymentMethodId"});
  PaymentMethod.hasMany(SubscriptionPayment, { as: "subscriptionPayments", foreignKey: "paymentMethodId"});
  PlanPropertyAssignment.belongsTo(Plan, { as: "plan", foreignKey: "planId"});
  Plan.hasMany(PlanPropertyAssignment, { as: "planPropertyAssignments", foreignKey: "planId"});
  Subscription.belongsTo(Plan, { as: "plan", foreignKey: "planId"});
  Plan.hasMany(Subscription, { as: "subscriptions", foreignKey: "planId"});
  ExtraPricing.belongsTo(PlanProperty, { as: "planProperty", foreignKey: "planPropertyId"});
  PlanProperty.hasMany(ExtraPricing, { as: "extraPricings", foreignKey: "planPropertyId"});
  PlanPropertyAssignment.belongsTo(PlanProperty, { as: "planProperty", foreignKey: "planPropertyId"});
  PlanProperty.hasMany(PlanPropertyAssignment, { as: "planPropertyAssignments", foreignKey: "planPropertyId"});
  PlanPropertyGroup.belongsTo(PlanProperty, { as: "planProperty", foreignKey: "planPropertyId"});
  PlanProperty.hasMany(PlanPropertyGroup, { as: "planPropertyGroups", foreignKey: "planPropertyId"});
  UsageRecord.belongsTo(PlanProperty, { as: "planProperty", foreignKey: "planPropertyId"});
  PlanProperty.hasMany(UsageRecord, { as: "usageRecords", foreignKey: "planPropertyId"});
  PlanPropertyAssignment.belongsTo(PlanPropertyAssignmentStatus, { as: "status", foreignKey: "statusId"});
  PlanPropertyAssignmentStatus.hasMany(PlanPropertyAssignment, { as: "planPropertyAssignments", foreignKey: "statusId"});
  PlanProperty.belongsTo(PlanPropertyStatus, { as: "status", foreignKey: "statusId"});
  PlanPropertyStatus.hasMany(PlanProperty, { as: "planProperties", foreignKey: "statusId"});
  Plan.belongsTo(PlanStatus, { as: "status", foreignKey: "statusId"});
  PlanStatus.hasMany(Plan, { as: "plans", foreignKey: "statusId"});
  RolePermission.belongsTo(Resource, { as: "resource", foreignKey: "resourceId"});
  Resource.hasMany(RolePermission, { as: "rolePermissions", foreignKey: "resourceId"});
  RoleDataPermission.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(RoleDataPermission, { as: "roleDataPermissions", foreignKey: "roleId"});
  RolePermission.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(RolePermission, { as: "rolePermissions", foreignKey: "roleId"});
  UserRole.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(UserRole, { as: "userRoles", foreignKey: "roleId"});
  SmsConfig.belongsTo(SmsConfigStatus, { as: "status", foreignKey: "statusId"});
  SmsConfigStatus.hasMany(SmsConfig, { as: "smsConfigs", foreignKey: "statusId"});
  Event.belongsTo(Specialty, { as: "specialty", foreignKey: "specialtyId"});
  Specialty.hasMany(Event, { as: "events", foreignKey: "specialtyId"});
  EventSponsor.belongsTo(Sponsor, { as: "sponsor", foreignKey: "sponsorId"});
  Sponsor.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "sponsorId"});
  EventSponsor.belongsTo(SponsorStatus, { as: "status", foreignKey: "statusId"});
  SponsorStatus.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "statusId"});
  Sponsor.belongsTo(SponsorStatus, { as: "status", foreignKey: "statusId"});
  SponsorStatus.hasMany(Sponsor, { as: "sponsors", foreignKey: "statusId"});
  EventSponsor.belongsTo(SponsorType, { as: "sponsorType", foreignKey: "sponsorTypeId"});
  SponsorType.hasMany(EventSponsor, { as: "eventSponsors", foreignKey: "sponsorTypeId"});
  SubscriptionExtraPricing.belongsTo(Subscription, { as: "subscription", foreignKey: "subscriptionId"});
  Subscription.hasMany(SubscriptionExtraPricing, { as: "subscriptionExtraPricings", foreignKey: "subscriptionId"});
  SubscriptionPayment.belongsTo(Subscription, { as: "subscription", foreignKey: "subscriptionId"});
  Subscription.hasMany(SubscriptionPayment, { as: "subscriptionPayments", foreignKey: "subscriptionId"});
  UsageRecord.belongsTo(Subscription, { as: "subscription", foreignKey: "subscriptionId"});
  Subscription.hasMany(UsageRecord, { as: "usageRecords", foreignKey: "subscriptionId"});
  Subscription.belongsTo(SubscriptionStatus, { as: "status", foreignKey: "statusId"});
  SubscriptionStatus.hasMany(Subscription, { as: "subscriptions", foreignKey: "statusId"});
  Event.belongsTo(Template, { as: "template", foreignKey: "templateId"});
  Template.hasMany(Event, { as: "events", foreignKey: "templateId"});
  Token.belongsTo(TokenStatus, { as: "status", foreignKey: "statusId"});
  TokenStatus.hasMany(Token, { as: "tokens", foreignKey: "statusId"});
  Asset.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Asset, { as: "assets", foreignKey: "userId"});
  Cart.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Cart, { as: "carts", foreignKey: "userId"});
  CompanyPaypalConfiguration.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(CompanyPaypalConfiguration, { as: "companyPaypalConfigurations", foreignKey: "userId"});
  CompanyTax.belongsTo(User, { as: "company", foreignKey: "companyId"});
  User.hasMany(CompanyTax, { as: "companyTaxes", foreignKey: "companyId"});
  EventFeedback.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(EventFeedback, { as: "eventFeedbacks", foreignKey: "userId"});
  EventRegistrationRecord.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(EventRegistrationRecord, { as: "eventRegistrationRecords", foreignKey: "userId"});
  EventSpeaker.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(EventSpeaker, { as: "eventSpeakers", foreignKey: "userId"});
  Notification.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Notification, { as: "notifications", foreignKey: "userId"});
  Order.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Order, { as: "orders", foreignKey: "userId"});
  Participant.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Participant, { as: "participants", foreignKey: "userId"});
  Payment.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Payment, { as: "payments", foreignKey: "userId"});
  Sponsor.belongsTo(User, { as: "company", foreignKey: "companyId"});
  User.hasMany(Sponsor, { as: "sponsors", foreignKey: "companyId"});
  Subscription.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Subscription, { as: "subscriptions", foreignKey: "userId"});
  SubscriptionPayment.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(SubscriptionPayment, { as: "subscriptionPayments", foreignKey: "userId"});
  UsageRecord.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UsageRecord, { as: "usageRecords", foreignKey: "userId"});
  UserAbstract.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserAbstract, { as: "userAbstracts", foreignKey: "userId"});
  UserAbstract.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId"});
  User.hasMany(UserAbstract, { as: "reviewerUserAbstracts", foreignKey: "reviewerId"});
  UserAuth.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasOne(UserAuth, { as: "userAuth", foreignKey: "userId"});
  UserCompany.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserCompany, { as: "userCompanies", foreignKey: "userId"});
  UserCoupon.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserCoupon, { as: "userCoupons", foreignKey: "userId"});
  UserData.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserData, { as: "userData", foreignKey: "userId"});
  UserRole.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(UserRole, { as: "userRoles", foreignKey: "userId"});
  Volunteer.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Volunteer, { as: "volunteers", foreignKey: "userId"});
  VolunteerEvent.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(VolunteerEvent, { as: "volunteerEvents", foreignKey: "userId"});
  UserAbstract.belongsTo(UserAbstractStatus, { as: "status", foreignKey: "statusId"});
  UserAbstractStatus.hasMany(UserAbstract, { as: "userAbstracts", foreignKey: "statusId"});
  User.belongsTo(UserStatus, { as: "status", foreignKey: "statusId"});
  UserStatus.hasMany(User, { as: "users", foreignKey: "statusId"});
  Event.belongsTo(Venue, { as: "venue", foreignKey: "venueId"});
  Venue.hasMany(Event, { as: "events", foreignKey: "venueId"});
  EventNearbyAttraction.belongsTo(Venue, { as: "venue", foreignKey: "venueId"});
  Venue.hasMany(EventNearbyAttraction, { as: "eventNearbyAttractions", foreignKey: "venueId"});
  Volunteer.belongsTo(VolunteerStatus, { as: "status", foreignKey: "statusId"});
  VolunteerStatus.hasMany(Volunteer, { as: "volunteers", foreignKey: "statusId"});
  VolunteerEvent.belongsTo(VolunteerStatus, { as: "status", foreignKey: "statusId"});
  VolunteerStatus.hasMany(VolunteerEvent, { as: "volunteerEvents", foreignKey: "statusId"});

  return {
    MeetingMetadata: MeetingMetadata,
    Action: Action,
    Addon: Addon,
    Asset: Asset,
    Attendee: Attendee,
    Cart: Cart,
    CartItem: CartItem,
    CartStatus: CartStatus,
    Color: Color,
    Company: Company,
    CompanyPaypalConfiguration: CompanyPaypalConfiguration,
    CompanyPaypalConfigurationStatus: CompanyPaypalConfigurationStatus,
    CompanyStatus: CompanyStatus,
    CompanyTax: CompanyTax,
    Coupon: Coupon,
    CouponStatus: CouponStatus,
    CouponUsage: CouponUsage,
    EmailConfig: EmailConfig,
    Event: Event,
    EventAddon: EventAddon,
    EventAddonProperty: EventAddonProperty,
    EventAddonStatus: EventAddonStatus,
    EventContact: EventContact,
    EventFeedback: EventFeedback,
    EventGroup: EventGroup,
    EventImages: EventImages,
    EventNearbyAttraction: EventNearbyAttraction,
    EventParticipant: EventParticipant,
    EventParticipantEntry: EventParticipantEntry,
    EventPriceTier: EventPriceTier,
    EventProgramScheduleStatus: EventProgramScheduleStatus,
    EventRegistration: EventRegistration,
    EventRegistrationDetail: EventRegistrationDetail,
    EventRegistrationDetailStatus: EventRegistrationDetailStatus,
    EventRegistrationForm: EventRegistrationForm,
    EventRegistrationRecord: EventRegistrationRecord,
    EventRegistrationStatus: EventRegistrationStatus,
    EventSpeaker: EventSpeaker,
    EventSponsor: EventSponsor,
    EventStatus: EventStatus,
    ExtraPricing: ExtraPricing,
    ExtraPricingStatus: ExtraPricingStatus,
    JobHistory: JobHistory,
    JobHistoryStatus: JobHistoryStatus,
    Log: Log,
    Notification: Notification,
    NotificationSetting: NotificationSetting,
    Order: Order,
    OrderItem: OrderItem,
    OrderStatus: OrderStatus,
    Participant: Participant,
    ParticipantGroup: ParticipantGroup,
    ParticipantRole: ParticipantRole,
    ParticipantType: ParticipantType,
    Payment: Payment,
    PaymentMethod: PaymentMethod,
    Plan: Plan,
    PlanProperty: PlanProperty,
    PlanPropertyAssignment: PlanPropertyAssignment,
    PlanPropertyAssignmentStatus: PlanPropertyAssignmentStatus,
    PlanPropertyGroup: PlanPropertyGroup,
    PlanPropertyStatus: PlanPropertyStatus,
    PlanStatus: PlanStatus,
    Resource: Resource,
    Role: Role,
    RoleDataPermission: RoleDataPermission,
    RolePermission: RolePermission,
    Sequelizemeta: Sequelizemeta,
    SmsConfig: SmsConfig,
    SmsConfigStatus: SmsConfigStatus,
    SpeakerBio: SpeakerBio,
    Specialty: Specialty,
    Sponsor: Sponsor,
    SponsorStatus: SponsorStatus,
    SponsorType: SponsorType,
    Subscription: Subscription,
    SubscriptionExtraPricing: SubscriptionExtraPricing,
    SubscriptionPayment: SubscriptionPayment,
    SubscriptionStatus: SubscriptionStatus,
    SystemLevelPayment: SystemLevelPayment,
    Template: Template,
    Token: Token,
    TokenStatus: TokenStatus,
    UsageRecord: UsageRecord,
    User: User,
    UserAbstract: UserAbstract,
    UserAbstractStatus: UserAbstractStatus,
    UserAuth: UserAuth,
    UserCompany: UserCompany,
    UserCoupon: UserCoupon,
    UserData: UserData,
    UserRole: UserRole,
    UserStatus: UserStatus,
    Venue: Venue,
    Volunteer: Volunteer,
    VolunteerEvent: VolunteerEvent,
    VolunteerStatus: VolunteerStatus,
  };
}

