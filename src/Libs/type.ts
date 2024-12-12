
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

export interface IEvent {
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
  assetId: number | null;
}

// export interface IProgram {
//   id: number;
//   parentId: number;
//   name: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   venueId: number;
//   eventClass: 'OFFLINE' | 'ONLINE';
//   interval: string | null;
//   companyId: number;
//   title: string | null;
//   amount: string;
//   discount: string | null;
//   statusId: number;
//   registrationDeadline: string | null;
//   slugName: string | null;
//   published: boolean;
//   url: string | null;
//   speciality: string | null;
//   templateId: number | null;
//   assetId: number | null;
// }

export interface IProgram {
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
  assetId: number | null;
  status: Status;
}

export interface IAddon {
  id: number;
  eventId: number;
  addonId: number;
  companyId: number;
  amount: string;
  tier: string | null;
  startTime: string;
  endTime: string;
  description: string;
  addon: {
    id: number;
    name: string;
    description: string;
    companyId: number | null;
    owner: string;
    enabled: number;
    assetId: number | null;
  };
  eventAddonProperties: (null | Record<string, unknown>)[];
}

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





export interface IEventResponse {
  data: IEventData;
  loading: boolean;
  success: boolean;
}

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
  assetId: number;
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

export interface Venue {
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

export interface Status {
  id: number;
  statusName: string;
  description: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  assetId: number | null;
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
  assetId: number | null;
}
