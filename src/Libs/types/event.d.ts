/**
 * Event response data type
 */
export interface IEventResponse {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId: number;
  eventClass: "OFFLINE" | "ONLINE" | "HYBRID";
  interval: string;
  companyId: string;
  title: string;
  amount: string;
  discount: number;
  statusId: number;
  slugName: string;
  assetId: number;
  published: boolean;
  templateId: number

  venue: IVenue;
  status: IStatus;
  template: ITemplate;
  eventCapacity: IEventCapacity[];
  eventPriceTiers: IEventPriceTier[];
  eventSpeakers: Omit<IEventSpeaker, "speakerBios">[];
  programs: IProgram[];
  addons: IAddons[];
  eventContacts: IEventContact[];
  url: string | null;
  specialtyId: number;
  speciality: ISpeciality;
  isAbstract: number;
  abstractDate: string;
  eventImages: any[]
};


export interface IStatus {
  id: number;
  statusName: string;
  description: string;
}

export interface IVenue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  totalCapacity: number | null;
  mapUrl: string;
}


export interface ITemplate {
  id: number;
  name: string;
  description: string;
  assetId: number | null;
  enabled: number;
  isDefault: number;
  createdBy: number;
  createdOn: string;
  modifiedBy: number;
  modifiedOn: string;
}

export interface IEventCapacity {
  id: number;
  totalSeats: number;
  seatAllocated: number;
  participantTypeId: number | null;
  eventId: number;
  parentEventId: number;
}


export interface IEventPriceTier {
  id: number;
  name: string;
  description: string | null;
  participantTypeId: number;
  eventId: number;
  percentage: string;
  startDate: string;
  endDate: string;
  participantType: IParticipantType
}


export interface IParticipantType {
  id: number;
  name: string;
  eventId: number;
  description: string;
  isContributor: number;
}


export interface IEventSpeaker {
  id: number;
  userId: number;
  eventId: number;
  statusId: number;
  parentEventId: number;
  user: IUser;
  speakerBios: any[];
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  phoneVerified: boolean;
  isSsoUser: boolean;
  ssoMetadata: null | string;
  designation: string;
  deviceToken: null | string;
  userDescription: string;
  statusId: number;
  acceptedTerms: null | any;
  assetId: number;

}

export interface IProgram {
  id: number;
  parentId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId: number;
  eventClass: "OFFLINE" | "ONLINE" | "HYBRID"
  interval: null | any;
  companyId: number;
  title: string | null;
  amount: string;
  discount: null | number;
  statusId: number;
  registrationDeadline: string | null;
  slugName: string | null;
  published: boolean;
  url: string | null;
  specialtyId: number | null;
  isAbstract: null | boolean;
  abstractDate: string | null;
  templateId: number | null;
  assetId: number | null;
  eventStartTime: string | null;
  eventEndTime: string | null;
  status: IStatus;
  eventParticipantEntries: Partial<IEventCapacity>;
  eventSpeakers: IEventSpeaker[];
  eventSponsors: IEventSponsor[];

}


export interface IEventSponsor {
  bannerImgAssetId: number | null;

  companyId: number;

  email: string;

  id: number;

  logoAssetId: number | null;

  name: string;

  phone: string;

  statusId: number

  website: string | null
}


export interface IAddon {
  id: number;
  eventId: number;
  addonId: number;
  companyId: number;
  amount: string;
  tier: any;
  startTime: string;
  endTime: string;
  description: string;
  statusId: number;
  addon: IAddonDetails
}

export interface IAddonDetails {
  id: number

  name: string

  description: string;

  companyId: number | null;

  owner: string;

  enabled: number;

  assetId: number | null;

  eventAddonProperties: IEventAddonProperty[];
}


export interface IEventAddonProperty {
  id: number;
  name: string;
  amount: string;
  eventAddonId: number;
  description: string | null;
  enabled: number;
  assetId: number | null;
}


export interface IEventContact {
  id: number;
  eventId: number;
  phone: string;
  email: string;
}


export interface ISpeciality {
  id: number;
  name: string;
  description: string;
}