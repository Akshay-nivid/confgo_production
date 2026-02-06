import { Request } from 'express';
import { validateCoupon } from '../../validators/couponValidator';
import {
  ApplyCouponDTO,
  CreateCouponDTO,
  RemoveCouponDTO,
  UpdateCouponDTO,
} from '../../dtos/coupon/CouponDTO';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';

export const extractCreateCouponData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateCouponDTO => {
  const {
    code,
    name,
    startDate,
    endDate,
    discountType,
    discountValue,
    maxUses,
    maxDiscountValue,
    minPurchaseValue,
    description,
    statusId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCoupon(
    {
      code,
      name,
      startDate,
      endDate,
      discountType,
      discountValue,
      maxUses,
      maxDiscountValue,
      minPurchaseValue,
      description,
      statusId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateCouponDTO;
};

export const extractUpdateCouponData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateCouponDTO => {
  const {
    code,
    name,
    startDate,
    endDate,
    discountType,
    discountValue,
    maxUses,
    maxDiscountValue,
    minPurchaseValue,
    description,
    statusId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCoupon(
    {
      code,
      name,
      startDate,
      endDate,
      discountType,
      discountValue,
      maxUses,
      maxDiscountValue,
      minPurchaseValue,
      description,
      statusId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateCouponDTO;
};

export const extractApplyCouponData = (
  req: Request,
  schema: Joi.ObjectSchema
): ApplyCouponDTO => {
  const { code, cartId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCoupon(
    {
      code,
      cartId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as ApplyCouponDTO;
};

export const extractRemoveCouponData = (
  req: Request,
  schema: Joi.ObjectSchema
): RemoveCouponDTO => {
  const { cartId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCoupon(
    {
      cartId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as RemoveCouponDTO;
};
