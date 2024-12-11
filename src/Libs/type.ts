
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

export interface IEvent  {
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

interface Data  {
  Events: IEvent[];
};

export interface IUserEvents  {
  data: Data;
  loading: boolean;
  success: boolean;
};
