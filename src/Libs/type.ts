
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
