import { IAddon, IProgram } from "./event";

export interface ISource {
  method: string; // HTTP method, e.g., 'POST'
  data: {
    offset: number;
    limit: number;
    filters?: any;
  };
  url: string; // API endpoint, e.g., 'coupon/list'
  listName: string; // Name of the list
}

export type IParticipantCoupon = {
  loading: boolean;
  success: boolean;
  data?: {
    coupon: {
      id: number;
      code: string;
      description: string;
      startDate: string;
      endDate: string;
      timesUsed: number;
      discountType: "percentage" | "fixed";
      discountValue: string;
      maxUses: number;
      maxDiscountValue: string;
      minPurchaseValue: string;
      companyId: number;
      statusId: number;
      createdBy: number;
      createdOn: string;
      modifiedBy: number;
      modifiedOn: string;
      name: string;
    };
    purchaseAmount: number;
    discountAmount: number;
    total: number;
  };
};


export interface IParticipantOrder {
  data: {
    id: number;
    companyId: number;
    userId: number;
    subTotal: string;
    tax: number;
    couponDeduction: number;
    paymentStatus: string;
    statusId: number;
    participantTypeId: number;
    orderDate: string;
    parentEventId: number;
    discountAmount: number;
    finalPrice: string;
    programTotal: number;
    addonTotal: number;
    priceTierDiscount: number;
  };
  loading: boolean;
  success: boolean;
}




export interface ICart {
  id: number;
  parentEventId: number;
  companyId: number;
  userId: number;
  statusId: number;
  finalPrice: string;
  createdBy: number;
  modifiedBy: number;
}

export interface IEvents {
  id: number;
  parentId: number | null;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId: number;
  eventClass: 'OFFLINE' | 'ONLINE';
  interval: string | null;
  companyId: number;
  title: string | null;
  amount: string;
  discount: string | null;
  statusId: number;
  registrationDeadline: string;
  slugName: string;
  published: boolean;
  url: string | null;
  speciality: string | null;
  templateId: number | null;
  assetId: string | null;
}



export type IPrograms = {
  id: number;
  parentId: number;
  name: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  venueId: number;
  eventClass: "OFFLINE" | "ONLINE";
  interval: string | null;
  companyId: number;
  title: string | null;
  amount: string;
  discount: number | null;
  statusId: number;
  registrationDeadline: string | null;
  slugName: string | null;
  published: boolean;
  url: string | null;
  speciality: string | null;
  templateId: number | null;
  assetId: string | null;
  status: Status;
}

// export type IAddons = {
//   id: number;
//   eventId: number;
//   addonId: number;
//   companyId: number;
//   amount: string;
//   tier: string | null;
//   startTime: string;
//   endTime: string;
//   description: string;
//   addon: {
//     id: number;
//     name: string;
//     description: string;
//     companyId: number | null;
//     owner: string;
//     enabled: number;
//     assetId: number | null;
//   };
//   eventAddonProperties: (null | Record<string, unknown>)[];
// }

export interface ICartData {
  data: {
    cart: ICart;
    event: IEvent;
    programs: IProgram[];
    addons: IAddon[];
    eventAmount: string;
    priceTierDiscount: string;
    programTotal: string;
    addonTotal: string;
  },
  loading: boolean;
  success: boolean;
}


interface CartResponseData {
  id: number;
  companyId: number;
  userId: number;
  statusId: number;
  parentEventId: number;
  participantTypeId: number;
  finalPrice: string;
  createdOn: string;
  modifiedOn: string;
}

export interface ICartResponse {
  data: CartResponseData;
  loading: boolean;
  success: boolean;
}


// export interface IEventResponse {
//   data: IEventData;
//   loading: boolean;
//   success: boolean;
// }

export interface IEventData {
  id: number;
  name: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  venueId: number;
  eventClass: "OFFLINE" | "ONLINE";
  interval: string | null;
  companyId: number;
  title: string | null;
  amount: string;
  discount: number | null;
  statusId: number;
  slugName: string;
  assetId: string;
  published: boolean;
  venue: Venue;
  status: Status;
  templateId: number;
  template: Template;
  eventCapacity: any[]; // Adjust if structure is known
  eventPriceTiers: any[]; // Adjust if structure is known
  eventProgramSchedules: any[]; // Adjust if structure is known
  programs: IProgram[];
  addons: Addon[];
  eventContacts: any[]; // Adjust if structure is known
}

export interface Status {
  id: number;
  statusName: string;
  description: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  assetId: string | null;
  enabled: number;
  isDefault: number;
  createdBy: number;
  createdOn: string; // ISO 8601 format
  modifiedBy: number;
  modifiedOn: string; // ISO 8601 format
}



export interface Addon {
  id: number;
  eventId: number;
  addonId: number;
  companyId: number;
  amount: string;
  tier: string | null;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  description: string;
  statusId: number;
  addon: AddonDetails;
  eventAddonProperties: any[]; // Adjust if structure is known
}

export interface AddonDetails {
  id: number;
  name: string;
  description: string;
  companyId: number | null;
  owner: string;
  enabled: number;
  assetId: string | null;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  totalCapacity: number;
  createdBy: number;
  createdOn: string;
  modifiedBy: number;
  modifiedOn: string;
  mapUrl: string | null;
};

export interface IEvent {
  id: number;
  parentId: number | null;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId: number;
  eventClass: "OFFLINE" | "ONLINE" | string;
  interval: string;
  companyId: number;
  title: string;
  amount: string;
  discount: string;
  statusId: number;
  registrationDeadline: string | null;
  slugName: string;
  published: boolean;
  url: string | null;
  speciality: string | null;
  templateId: string | null;
  assetId: string | null;
  createdBy: number;
  createdOn: string;
  modifiedBy: number;
  modifiedOn: string;
  venue: Venue;
};

interface Data {
  Events: IEvent[];
};

export interface IUserEvents {
  data: Data;
  loading: boolean;
  success: boolean;
};


export type OrderSummary = {
  addonTotal: number;
  companyId: number;
  couponDeduction: number;
  discountAmount: number;
  finalPrice: number;
  id: number;
  orderDate: string;
  parentEventId: number;
  participantTypeId: number;
  paymentStatus: string;
  priceTierDiscount: string; 
  programTotal: number;
  statusId: number;
  subTotal: string; 
  tax: number;
  taxInclusive: number;
  taxPercentage: number;
  userId: number;
};