import { Coupon } from '../../models/Coupon';
import { ResponseDTO } from '../ResponseDTO';

export interface CreateCouponDTO {
  code: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  discountType: string;
  discountValue: number;
  maxUses: number;
  maxDiscountValue: number;
  minPurchaseValue: number;
  companyId: number;
  timesUsed: number;
  statusId?: number;
  createdBy: number;
  modifiedBy: number;
}

export interface UpdateCouponDTO {
  code?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  discountType?: string;
  discountValue?: number;
  maxUses?: number;
  maxDiscountValue?: number;
  minPurchaseValue?: number;
  companyId?: number;
  statusId?: number;
  description?: string;
}

export interface CouponResponseDTO {
  id: number;
  code: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  discountType: string;
  discountValue: number;
  maxUses: number;
  maxDiscountValue: number;
  minPurchaseValue: number;
  companyId: number;
  timesUsed: number;
  statusId?: number;
  description?: string;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export const createCouponResponse = (
  coupon: Coupon
): ResponseDTO<CouponResponseDTO> => {
  const response: CouponResponseDTO = {
    id: coupon.id,
    code: coupon.code,
    name: coupon.name,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxUses: coupon.maxUses,
    maxDiscountValue: coupon.maxDiscountValue,
    minPurchaseValue: coupon.minPurchaseValue,
    companyId: coupon.companyId,
    description: coupon.description,
    timesUsed: coupon.timesUsed,
    statusId: coupon.statusId,
    createdBy: coupon.createdBy || 0,
    createdOn: coupon.createdOn || new Date(),
    modifiedBy: coupon.modifiedBy || 0,
    modifiedOn: coupon.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Coupon created successfully',
    data: response,
  };
};

export const updateCouponResponse = (
  coupon: CouponResponseDTO
): ResponseDTO<CouponResponseDTO> => {
  return {
    status: 'success',
    message: 'Coupon updated successfully',
    data: coupon,
  };
};

export const getCouponResponse = (
  coupon: CouponResponseDTO
): ResponseDTO<CouponResponseDTO> => {
  return {
    status: 'success',
    data: coupon,
  };
};

export interface CouponFilterDTO {
  id?: number;
  code?: string;
  name?: string;
  startTime?: Date;
  endTime?: Date;
  discountType?: string;
  discountValue?: number;
  maxUses?: number;
  maxDiscountValue?: number;
  minPurchaseValue?: number;
  companyId?: number;
  timesUsed?: number;
  statusId?: number;
  createdBy?: number;
  modifiedBy?: number;
}

export interface CouponUsageFilterDTO {
  id?: number;
  couponId?: number;
  userId?: number;
  eventId?: number;
  createdBy?: number;
  modifiedBy?: number;
}

export interface ApplyCouponDTO {
  code: string;
  cartId: number;
}

export interface RemoveCouponDTO {
  cartId: number;
}

export interface ResponseData {
  coupon: Coupon;
  purchaseAmount: number;
  discountAmount: number;
  total: number;
}
export interface CouponResponse {
  status: string;
  message: string;
  data: ResponseData;
}

export interface AppliedCouponDTO {
  status?: string | null;
  message?: string | null;
  data?: ResponseData | null;
}
