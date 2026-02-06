import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Asset, AssetId } from './Asset';
import type { Attendee, AttendeeId } from './Attendee';
import type { Cart, CartId } from './Cart';
import type { CartItem, CartItemId } from './CartItem';
import type { Color, ColorId } from './Color';
import type { Company, CompanyId } from './Company';
import type { CompanyPaypalConfiguration, CompanyPaypalConfigurationId } from './CompanyPaypalConfiguration';
import type { EventAddon, EventAddonId } from './EventAddon';
import type { EventContact, EventContactId } from './EventContact';
import type { EventFeedback, EventFeedbackId } from './EventFeedback';
import type { EventGroup, EventGroupId } from './EventGroup';
import type { EventImages, EventImagesId } from './EventImages';
import type { EventNearbyAttraction, EventNearbyAttractionId } from './EventNearbyAttraction';
import type { EventParticipant, EventParticipantId } from './EventParticipant';
import type { EventParticipantEntry, EventParticipantEntryId } from './EventParticipantEntry';
import type { EventPriceTier, EventPriceTierId } from './EventPriceTier';
import type { EventRegistration, EventRegistrationId } from './EventRegistration';
import type { EventRegistrationDetail, EventRegistrationDetailId } from './EventRegistrationDetail';
import type { EventRegistrationForm, EventRegistrationFormId } from './EventRegistrationForm';
import type { EventRegistrationRecord, EventRegistrationRecordId } from './EventRegistrationRecord';
import type { EventSpeaker, EventSpeakerId } from './EventSpeaker';
import type { EventSponsor, EventSponsorId } from './EventSponsor';
import type { EventStatus, EventStatusId } from './EventStatus';
import type { Notification, NotificationId } from './Notification';
import type { Order, OrderId } from './Order';
import type { OrderItem, OrderItemId } from './OrderItem';
import type { Participant, ParticipantId } from './Participant';
import type { ParticipantType, ParticipantTypeId } from './ParticipantType';
import type { Payment, PaymentId } from './Payment';
import type { Specialty, SpecialtyId } from './Specialty';
import type { Template, TemplateId } from './Template';
import type { UserAbstract, UserAbstractId } from './UserAbstract';
import type { UserCoupon, UserCouponId } from './UserCoupon';
import type { Venue, VenueId } from './Venue';
import type { VolunteerEvent, VolunteerEventId } from './VolunteerEvent';

export interface EventAttributes {
  id: number;
  parentId?: number;
  name: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  venueId?: number;
  eventClass?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  interval?: string;
  companyId: number;
  title?: string;
  amount: number;
  hall?: string;
  discount?: number;
  statusId?: number;
  registrationDeadline?: Date;
  slugName?: string;
  published: number;
  url?: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: string;
  templateId?: number;
  colorId?: number;
  assetId?: string;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
  eventStartTime?: string;
  eventEndTime?: string;
meetingId?: string;
}

export type EventPk = "id";
export type EventId = Event[EventPk];
export type EventOptionalAttributes = "id" | "parentId" | "description" | "startTime" | "endTime" | "venueId" | "eventClass" | "interval" | "eventStartTime" | "eventEndTime" | "title" | "hall" | "discount" | "statusId" | "templateId" | "colorId" | "assetId" | "registrationDeadline" | "slugName" | "published" | "url" | "specialtyId" | "isAbstract" | "abstractDate" | "createdOn" | "modifiedOn";
export type EventCreationAttributes = Optional<EventAttributes, EventOptionalAttributes>;

export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  id!: number;
  parentId?: number;
  name!: string;
  description?: string;
  startTime!: Date;
  endTime?: Date;
  venueId?: number;
  eventClass?: 'ONLINE' | 'OFFLINE' | 'HYBRID';
  interval?: string;
  companyId!: number;
  title?: string;
  amount!: number;
  hall?: string;
  discount?: number;
  statusId?: number;
  registrationDeadline?: Date;
  slugName?: string;
  published!: number;
  url?: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: string;
  templateId?: number;
  colorId?: number;
  assetId?: string;
  createdBy!: number;
  createdOn?: Date;
  modifiedBy!: number;
meetingId?: string;
  modifiedOn?: Date;
  eventStartTime?: string;
  eventEndTime?: string;

  // Event belongsTo Asset via assetId
  asset!: Asset;
  getAsset!: Sequelize.BelongsToGetAssociationMixin<Asset>;
  setAsset!: Sequelize.BelongsToSetAssociationMixin<Asset, AssetId>;
  createAsset!: Sequelize.BelongsToCreateAssociationMixin<Asset>;
  // Event belongsTo Color via colorId
  color!: Color;
  getColor!: Sequelize.BelongsToGetAssociationMixin<Color>;
  setColor!: Sequelize.BelongsToSetAssociationMixin<Color, ColorId>;
  createColor!: Sequelize.BelongsToCreateAssociationMixin<Color>;
  // Event belongsTo Company via companyId
  company!: Company;
  getCompany!: Sequelize.BelongsToGetAssociationMixin<Company>;
  setCompany!: Sequelize.BelongsToSetAssociationMixin<Company, CompanyId>;
  createCompany!: Sequelize.BelongsToCreateAssociationMixin<Company>;
  // Event hasMany Attendee via parentEventId
  attendees!: Attendee[];
  getAttendees!: Sequelize.HasManyGetAssociationsMixin<Attendee>;
  setAttendees!: Sequelize.HasManySetAssociationsMixin<Attendee, AttendeeId>;
  addAttendee!: Sequelize.HasManyAddAssociationMixin<Attendee, AttendeeId>;
  addAttendees!: Sequelize.HasManyAddAssociationsMixin<Attendee, AttendeeId>;
  createAttendee!: Sequelize.HasManyCreateAssociationMixin<Attendee>;
  removeAttendee!: Sequelize.HasManyRemoveAssociationMixin<Attendee, AttendeeId>;
  removeAttendees!: Sequelize.HasManyRemoveAssociationsMixin<Attendee, AttendeeId>;
  hasAttendee!: Sequelize.HasManyHasAssociationMixin<Attendee, AttendeeId>;
  hasAttendees!: Sequelize.HasManyHasAssociationsMixin<Attendee, AttendeeId>;
  countAttendees!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany Attendee via eventId
  eventAttendees!: Attendee[];
  getEventAttendees!: Sequelize.HasManyGetAssociationsMixin<Attendee>;
  setEventAttendees!: Sequelize.HasManySetAssociationsMixin<Attendee, AttendeeId>;
  addEventAttendee!: Sequelize.HasManyAddAssociationMixin<Attendee, AttendeeId>;
  addEventAttendees!: Sequelize.HasManyAddAssociationsMixin<Attendee, AttendeeId>;
  createEventAttendee!: Sequelize.HasManyCreateAssociationMixin<Attendee>;
  removeEventAttendee!: Sequelize.HasManyRemoveAssociationMixin<Attendee, AttendeeId>;
  removeEventAttendees!: Sequelize.HasManyRemoveAssociationsMixin<Attendee, AttendeeId>;
  hasEventAttendee!: Sequelize.HasManyHasAssociationMixin<Attendee, AttendeeId>;
  hasEventAttendees!: Sequelize.HasManyHasAssociationsMixin<Attendee, AttendeeId>;
  countEventAttendees!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany Cart via parentEventId
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
  // Event hasMany CartItem via eventId
  cartItems!: CartItem[];
  getCartItems!: Sequelize.HasManyGetAssociationsMixin<CartItem>;
  setCartItems!: Sequelize.HasManySetAssociationsMixin<CartItem, CartItemId>;
  addCartItem!: Sequelize.HasManyAddAssociationMixin<CartItem, CartItemId>;
  addCartItems!: Sequelize.HasManyAddAssociationsMixin<CartItem, CartItemId>;
  createCartItem!: Sequelize.HasManyCreateAssociationMixin<CartItem>;
  removeCartItem!: Sequelize.HasManyRemoveAssociationMixin<CartItem, CartItemId>;
  removeCartItems!: Sequelize.HasManyRemoveAssociationsMixin<CartItem, CartItemId>;
  hasCartItem!: Sequelize.HasManyHasAssociationMixin<CartItem, CartItemId>;
  hasCartItems!: Sequelize.HasManyHasAssociationsMixin<CartItem, CartItemId>;
  countCartItems!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany CompanyPaypalConfiguration via eventId
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
  // Event belongsTo Event via parentId
  parent!: Event;
  getParent!: Sequelize.BelongsToGetAssociationMixin<Event>;
  setParent!: Sequelize.BelongsToSetAssociationMixin<Event, EventId>;
  createParent!: Sequelize.BelongsToCreateAssociationMixin<Event>;
  // Event hasMany EventAddon via eventId
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
  // Event hasMany EventContact via eventId
  eventContacts!: EventContact[];
  getEventContacts!: Sequelize.HasManyGetAssociationsMixin<EventContact>;
  setEventContacts!: Sequelize.HasManySetAssociationsMixin<EventContact, EventContactId>;
  addEventContact!: Sequelize.HasManyAddAssociationMixin<EventContact, EventContactId>;
  addEventContacts!: Sequelize.HasManyAddAssociationsMixin<EventContact, EventContactId>;
  createEventContact!: Sequelize.HasManyCreateAssociationMixin<EventContact>;
  removeEventContact!: Sequelize.HasManyRemoveAssociationMixin<EventContact, EventContactId>;
  removeEventContacts!: Sequelize.HasManyRemoveAssociationsMixin<EventContact, EventContactId>;
  hasEventContact!: Sequelize.HasManyHasAssociationMixin<EventContact, EventContactId>;
  hasEventContacts!: Sequelize.HasManyHasAssociationsMixin<EventContact, EventContactId>;
  countEventContacts!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventFeedback via eventId
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
  // Event hasMany EventGroup via eventId
  eventGroups!: EventGroup[];
  getEventGroups!: Sequelize.HasManyGetAssociationsMixin<EventGroup>;
  setEventGroups!: Sequelize.HasManySetAssociationsMixin<EventGroup, EventGroupId>;
  addEventGroup!: Sequelize.HasManyAddAssociationMixin<EventGroup, EventGroupId>;
  addEventGroups!: Sequelize.HasManyAddAssociationsMixin<EventGroup, EventGroupId>;
  createEventGroup!: Sequelize.HasManyCreateAssociationMixin<EventGroup>;
  removeEventGroup!: Sequelize.HasManyRemoveAssociationMixin<EventGroup, EventGroupId>;
  removeEventGroups!: Sequelize.HasManyRemoveAssociationsMixin<EventGroup, EventGroupId>;
  hasEventGroup!: Sequelize.HasManyHasAssociationMixin<EventGroup, EventGroupId>;
  hasEventGroups!: Sequelize.HasManyHasAssociationsMixin<EventGroup, EventGroupId>;
  countEventGroups!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventImages via eventId
  eventImages!: EventImages[];
  getEventImages!: Sequelize.HasManyGetAssociationsMixin<EventImages>;
  setEventImages!: Sequelize.HasManySetAssociationsMixin<EventImages, EventImagesId>;
  addEventImage!: Sequelize.HasManyAddAssociationMixin<EventImages, EventImagesId>;
  addEventImages!: Sequelize.HasManyAddAssociationsMixin<EventImages, EventImagesId>;
  createEventImage!: Sequelize.HasManyCreateAssociationMixin<EventImages>;
  removeEventImage!: Sequelize.HasManyRemoveAssociationMixin<EventImages, EventImagesId>;
  removeEventImages!: Sequelize.HasManyRemoveAssociationsMixin<EventImages, EventImagesId>;
  hasEventImage!: Sequelize.HasManyHasAssociationMixin<EventImages, EventImagesId>;
  hasEventImages!: Sequelize.HasManyHasAssociationsMixin<EventImages, EventImagesId>;
  countEventImages!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventNearbyAttraction via eventId
  eventNearbyAttractions!: EventNearbyAttraction[];
  getEventNearbyAttractions!: Sequelize.HasManyGetAssociationsMixin<EventNearbyAttraction>;
  setEventNearbyAttractions!: Sequelize.HasManySetAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  addEventNearbyAttraction!: Sequelize.HasManyAddAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  addEventNearbyAttractions!: Sequelize.HasManyAddAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  createEventNearbyAttraction!: Sequelize.HasManyCreateAssociationMixin<EventNearbyAttraction>;
  removeEventNearbyAttraction!: Sequelize.HasManyRemoveAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  removeEventNearbyAttractions!: Sequelize.HasManyRemoveAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  hasEventNearbyAttraction!: Sequelize.HasManyHasAssociationMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  hasEventNearbyAttractions!: Sequelize.HasManyHasAssociationsMixin<EventNearbyAttraction, EventNearbyAttractionId>;
  countEventNearbyAttractions!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventParticipant via eventId
  eventParticipants!: EventParticipant[];
  getEventParticipants!: Sequelize.HasManyGetAssociationsMixin<EventParticipant>;
  setEventParticipants!: Sequelize.HasManySetAssociationsMixin<EventParticipant, EventParticipantId>;
  addEventParticipant!: Sequelize.HasManyAddAssociationMixin<EventParticipant, EventParticipantId>;
  addEventParticipants!: Sequelize.HasManyAddAssociationsMixin<EventParticipant, EventParticipantId>;
  createEventParticipant!: Sequelize.HasManyCreateAssociationMixin<EventParticipant>;
  removeEventParticipant!: Sequelize.HasManyRemoveAssociationMixin<EventParticipant, EventParticipantId>;
  removeEventParticipants!: Sequelize.HasManyRemoveAssociationsMixin<EventParticipant, EventParticipantId>;
  hasEventParticipant!: Sequelize.HasManyHasAssociationMixin<EventParticipant, EventParticipantId>;
  hasEventParticipants!: Sequelize.HasManyHasAssociationsMixin<EventParticipant, EventParticipantId>;
  countEventParticipants!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventParticipantEntry via eventId
  eventParticipantEntries!: EventParticipantEntry[];
  getEventParticipantEntries!: Sequelize.HasManyGetAssociationsMixin<EventParticipantEntry>;
  setEventParticipantEntries!: Sequelize.HasManySetAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  addEventParticipantEntry!: Sequelize.HasManyAddAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  addEventParticipantEntries!: Sequelize.HasManyAddAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  createEventParticipantEntry!: Sequelize.HasManyCreateAssociationMixin<EventParticipantEntry>;
  removeEventParticipantEntry!: Sequelize.HasManyRemoveAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  removeEventParticipantEntries!: Sequelize.HasManyRemoveAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  hasEventParticipantEntry!: Sequelize.HasManyHasAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  hasEventParticipantEntries!: Sequelize.HasManyHasAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  countEventParticipantEntries!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventParticipantEntry via parentEventId
  parentEventEventParticipantEntries!: EventParticipantEntry[];
  getParentEventEventParticipantEntries!: Sequelize.HasManyGetAssociationsMixin<EventParticipantEntry>;
  setParentEventEventParticipantEntries!: Sequelize.HasManySetAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  addParentEventEventParticipantEntry!: Sequelize.HasManyAddAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  addParentEventEventParticipantEntries!: Sequelize.HasManyAddAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  createParentEventEventParticipantEntry!: Sequelize.HasManyCreateAssociationMixin<EventParticipantEntry>;
  removeParentEventEventParticipantEntry!: Sequelize.HasManyRemoveAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  removeParentEventEventParticipantEntries!: Sequelize.HasManyRemoveAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  hasParentEventEventParticipantEntry!: Sequelize.HasManyHasAssociationMixin<EventParticipantEntry, EventParticipantEntryId>;
  hasParentEventEventParticipantEntries!: Sequelize.HasManyHasAssociationsMixin<EventParticipantEntry, EventParticipantEntryId>;
  countParentEventEventParticipantEntries!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventPriceTier via eventId
  eventPriceTiers!: EventPriceTier[];
  getEventPriceTiers!: Sequelize.HasManyGetAssociationsMixin<EventPriceTier>;
  setEventPriceTiers!: Sequelize.HasManySetAssociationsMixin<EventPriceTier, EventPriceTierId>;
  addEventPriceTier!: Sequelize.HasManyAddAssociationMixin<EventPriceTier, EventPriceTierId>;
  addEventPriceTiers!: Sequelize.HasManyAddAssociationsMixin<EventPriceTier, EventPriceTierId>;
  createEventPriceTier!: Sequelize.HasManyCreateAssociationMixin<EventPriceTier>;
  removeEventPriceTier!: Sequelize.HasManyRemoveAssociationMixin<EventPriceTier, EventPriceTierId>;
  removeEventPriceTiers!: Sequelize.HasManyRemoveAssociationsMixin<EventPriceTier, EventPriceTierId>;
  hasEventPriceTier!: Sequelize.HasManyHasAssociationMixin<EventPriceTier, EventPriceTierId>;
  hasEventPriceTiers!: Sequelize.HasManyHasAssociationsMixin<EventPriceTier, EventPriceTierId>;
  countEventPriceTiers!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventRegistration via eventId
  eventRegistrations!: EventRegistration[];
  getEventRegistrations!: Sequelize.HasManyGetAssociationsMixin<EventRegistration>;
  setEventRegistrations!: Sequelize.HasManySetAssociationsMixin<EventRegistration, EventRegistrationId>;
  addEventRegistration!: Sequelize.HasManyAddAssociationMixin<EventRegistration, EventRegistrationId>;
  addEventRegistrations!: Sequelize.HasManyAddAssociationsMixin<EventRegistration, EventRegistrationId>;
  createEventRegistration!: Sequelize.HasManyCreateAssociationMixin<EventRegistration>;
  removeEventRegistration!: Sequelize.HasManyRemoveAssociationMixin<EventRegistration, EventRegistrationId>;
  removeEventRegistrations!: Sequelize.HasManyRemoveAssociationsMixin<EventRegistration, EventRegistrationId>;
  hasEventRegistration!: Sequelize.HasManyHasAssociationMixin<EventRegistration, EventRegistrationId>;
  hasEventRegistrations!: Sequelize.HasManyHasAssociationsMixin<EventRegistration, EventRegistrationId>;
  countEventRegistrations!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventRegistrationDetail via eventId
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
  // Event hasMany EventRegistrationForm via eventId
  eventRegistrationForms!: EventRegistrationForm[];
  getEventRegistrationForms!: Sequelize.HasManyGetAssociationsMixin<EventRegistrationForm>;
  setEventRegistrationForms!: Sequelize.HasManySetAssociationsMixin<EventRegistrationForm, EventRegistrationFormId>;
  addEventRegistrationForm!: Sequelize.HasManyAddAssociationMixin<EventRegistrationForm, EventRegistrationFormId>;
  addEventRegistrationForms!: Sequelize.HasManyAddAssociationsMixin<EventRegistrationForm, EventRegistrationFormId>;
  createEventRegistrationForm!: Sequelize.HasManyCreateAssociationMixin<EventRegistrationForm>;
  removeEventRegistrationForm!: Sequelize.HasManyRemoveAssociationMixin<EventRegistrationForm, EventRegistrationFormId>;
  removeEventRegistrationForms!: Sequelize.HasManyRemoveAssociationsMixin<EventRegistrationForm, EventRegistrationFormId>;
  hasEventRegistrationForm!: Sequelize.HasManyHasAssociationMixin<EventRegistrationForm, EventRegistrationFormId>;
  hasEventRegistrationForms!: Sequelize.HasManyHasAssociationsMixin<EventRegistrationForm, EventRegistrationFormId>;
  countEventRegistrationForms!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventRegistrationRecord via eventId
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
  // Event hasMany EventSpeaker via eventId
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
  // Event hasMany EventSpeaker via parentEventId
  parentEventEventSpeakers!: EventSpeaker[];
  getParentEventEventSpeakers!: Sequelize.HasManyGetAssociationsMixin<EventSpeaker>;
  setParentEventEventSpeakers!: Sequelize.HasManySetAssociationsMixin<EventSpeaker, EventSpeakerId>;
  addParentEventEventSpeaker!: Sequelize.HasManyAddAssociationMixin<EventSpeaker, EventSpeakerId>;
  addParentEventEventSpeakers!: Sequelize.HasManyAddAssociationsMixin<EventSpeaker, EventSpeakerId>;
  createParentEventEventSpeaker!: Sequelize.HasManyCreateAssociationMixin<EventSpeaker>;
  removeParentEventEventSpeaker!: Sequelize.HasManyRemoveAssociationMixin<EventSpeaker, EventSpeakerId>;
  removeParentEventEventSpeakers!: Sequelize.HasManyRemoveAssociationsMixin<EventSpeaker, EventSpeakerId>;
  hasParentEventEventSpeaker!: Sequelize.HasManyHasAssociationMixin<EventSpeaker, EventSpeakerId>;
  hasParentEventEventSpeakers!: Sequelize.HasManyHasAssociationsMixin<EventSpeaker, EventSpeakerId>;
  countParentEventEventSpeakers!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventSponsor via eventId
  eventSponsors!: EventSponsor[];
  getEventSponsors!: Sequelize.HasManyGetAssociationsMixin<EventSponsor>;
  setEventSponsors!: Sequelize.HasManySetAssociationsMixin<EventSponsor, EventSponsorId>;
  addEventSponsor!: Sequelize.HasManyAddAssociationMixin<EventSponsor, EventSponsorId>;
  addEventSponsors!: Sequelize.HasManyAddAssociationsMixin<EventSponsor, EventSponsorId>;
  createEventSponsor!: Sequelize.HasManyCreateAssociationMixin<EventSponsor>;
  removeEventSponsor!: Sequelize.HasManyRemoveAssociationMixin<EventSponsor, EventSponsorId>;
  removeEventSponsors!: Sequelize.HasManyRemoveAssociationsMixin<EventSponsor, EventSponsorId>;
  hasEventSponsor!: Sequelize.HasManyHasAssociationMixin<EventSponsor, EventSponsorId>;
  hasEventSponsors!: Sequelize.HasManyHasAssociationsMixin<EventSponsor, EventSponsorId>;
  countEventSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany EventSponsor via parentEventId
  parentEventEventSponsors!: EventSponsor[];
  getParentEventEventSponsors!: Sequelize.HasManyGetAssociationsMixin<EventSponsor>;
  setParentEventEventSponsors!: Sequelize.HasManySetAssociationsMixin<EventSponsor, EventSponsorId>;
  addParentEventEventSponsor!: Sequelize.HasManyAddAssociationMixin<EventSponsor, EventSponsorId>;
  addParentEventEventSponsors!: Sequelize.HasManyAddAssociationsMixin<EventSponsor, EventSponsorId>;
  createParentEventEventSponsor!: Sequelize.HasManyCreateAssociationMixin<EventSponsor>;
  removeParentEventEventSponsor!: Sequelize.HasManyRemoveAssociationMixin<EventSponsor, EventSponsorId>;
  removeParentEventEventSponsors!: Sequelize.HasManyRemoveAssociationsMixin<EventSponsor, EventSponsorId>;
  hasParentEventEventSponsor!: Sequelize.HasManyHasAssociationMixin<EventSponsor, EventSponsorId>;
  hasParentEventEventSponsors!: Sequelize.HasManyHasAssociationsMixin<EventSponsor, EventSponsorId>;
  countParentEventEventSponsors!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany Notification via eventId
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
  // Event hasMany Order via parentEventId
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
  // Event hasMany OrderItem via eventId
  orderItems!: OrderItem[];
  getOrderItems!: Sequelize.HasManyGetAssociationsMixin<OrderItem>;
  setOrderItems!: Sequelize.HasManySetAssociationsMixin<OrderItem, OrderItemId>;
  addOrderItem!: Sequelize.HasManyAddAssociationMixin<OrderItem, OrderItemId>;
  addOrderItems!: Sequelize.HasManyAddAssociationsMixin<OrderItem, OrderItemId>;
  createOrderItem!: Sequelize.HasManyCreateAssociationMixin<OrderItem>;
  removeOrderItem!: Sequelize.HasManyRemoveAssociationMixin<OrderItem, OrderItemId>;
  removeOrderItems!: Sequelize.HasManyRemoveAssociationsMixin<OrderItem, OrderItemId>;
  hasOrderItem!: Sequelize.HasManyHasAssociationMixin<OrderItem, OrderItemId>;
  hasOrderItems!: Sequelize.HasManyHasAssociationsMixin<OrderItem, OrderItemId>;
  countOrderItems!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany Participant via eventId
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
  // Event hasMany ParticipantType via eventId
  participantTypes!: ParticipantType[];
  getParticipantTypes!: Sequelize.HasManyGetAssociationsMixin<ParticipantType>;
  setParticipantTypes!: Sequelize.HasManySetAssociationsMixin<ParticipantType, ParticipantTypeId>;
  addParticipantType!: Sequelize.HasManyAddAssociationMixin<ParticipantType, ParticipantTypeId>;
  addParticipantTypes!: Sequelize.HasManyAddAssociationsMixin<ParticipantType, ParticipantTypeId>;
  createParticipantType!: Sequelize.HasManyCreateAssociationMixin<ParticipantType>;
  removeParticipantType!: Sequelize.HasManyRemoveAssociationMixin<ParticipantType, ParticipantTypeId>;
  removeParticipantTypes!: Sequelize.HasManyRemoveAssociationsMixin<ParticipantType, ParticipantTypeId>;
  hasParticipantType!: Sequelize.HasManyHasAssociationMixin<ParticipantType, ParticipantTypeId>;
  hasParticipantTypes!: Sequelize.HasManyHasAssociationsMixin<ParticipantType, ParticipantTypeId>;
  countParticipantTypes!: Sequelize.HasManyCountAssociationsMixin;
  // Event hasMany Payment via eventId
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
  // Event hasMany UserAbstract via eventId
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
  // Event hasMany UserCoupon via eventId
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
  // Event hasMany VolunteerEvent via eventId
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
  // Event belongsTo EventStatus via statusId
  status!: EventStatus;
  getStatus!: Sequelize.BelongsToGetAssociationMixin<EventStatus>;
  setStatus!: Sequelize.BelongsToSetAssociationMixin<EventStatus, EventStatusId>;
  createStatus!: Sequelize.BelongsToCreateAssociationMixin<EventStatus>;
  // Event belongsTo Specialty via specialtyId
  specialty!: Specialty;
  getSpecialty!: Sequelize.BelongsToGetAssociationMixin<Specialty>;
  setSpecialty!: Sequelize.BelongsToSetAssociationMixin<Specialty, SpecialtyId>;
  createSpecialty!: Sequelize.BelongsToCreateAssociationMixin<Specialty>;
  // Event belongsTo Template via templateId
  template!: Template;
  getTemplate!: Sequelize.BelongsToGetAssociationMixin<Template>;
  setTemplate!: Sequelize.BelongsToSetAssociationMixin<Template, TemplateId>;
  createTemplate!: Sequelize.BelongsToCreateAssociationMixin<Template>;
  // Event belongsTo Venue via venueId
  venue!: Venue;
  getVenue!: Sequelize.BelongsToGetAssociationMixin<Venue>;
  setVenue!: Sequelize.BelongsToSetAssociationMixin<Venue, VenueId>;
  createVenue!: Sequelize.BelongsToCreateAssociationMixin<Venue>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Event {
    return Event.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      },
      field: 'parent_id'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
meetingId: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_time'
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'venue',
        key: 'id'
      },
      field: 'venue_id'
    },
    eventClass: {
      type: DataTypes.ENUM('ONLINE','OFFLINE','HYBRID'),
      allowNull: true,
      defaultValue: "ONLINE",
      field: 'event_class'
    },
    interval: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      },
      field: 'company_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    hall: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'event_status',
        key: 'id'
      },
      field: 'status_id'
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'registration_deadline'
    },
    slugName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: "slug_name_UNIQUE",
      field: 'slug_name'
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'specialty',
        key: 'id'
      },
      field: 'specialty_id'
    },
    isAbstract: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'is_abstract'
    },
    abstractDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'abstract_date'
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'template',
        key: 'id'
      },
      field: 'template_id'
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'color',
        key: 'id'
      },
      field: 'color_id'
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
    },
    eventStartTime: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'event_start_time'
    },
    eventEndTime: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'event_end_time'
    }
  }, {
    sequelize,
    tableName: 'event',
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
        name: "slug_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slug_name" },
        ]
      },
      {
        name: "event_event_status_FK",
        using: "BTREE",
        fields: [
          { name: "status_id" },
        ]
      },
      {
        name: "event_venue_FK_idx",
        using: "BTREE",
        fields: [
          { name: "venue_id" },
        ]
      },
      {
        name: "company_id",
        using: "BTREE",
        fields: [
          { name: "company_id" },
        ]
      },
      {
        name: "event_template_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "template_id" },
        ]
      },
      {
        name: "event_asset_idFK_444_idx",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
      {
        name: "fk_specialty_id",
        using: "BTREE",
        fields: [
          { name: "specialty_id" },
        ]
      },
      {
        name: "event_asset_new_FK_idx",
        using: "BTREE",
        fields: [
          { name: "asset_id" },
        ]
      },
      {
        name: "event_color_FK_idx",
        using: "BTREE",
        fields: [
          { name: "color_id" },
        ]
      },
    ]
  });
  }
}
