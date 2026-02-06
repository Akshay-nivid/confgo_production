import Joi from 'joi';
import { CreateSubscriptionDTO } from '../../dtos/subscription/SubscriptionDTO';
import { validateSubscription } from '../../validators/subscriptionValidator';
import { Request } from 'express';
import { AppError } from '../../utils/AppError';

export const extractCreateSubscriptionData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateSubscriptionDTO => {
  const {
    planId,
    discountCouponId,
    extendedPlanId,
    extendedPlanStart,
    paymentId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateSubscription(
    {
      planId,
      discountCouponId,
      extendedPlanId,
      extendedPlanStart,
      paymentId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateSubscriptionDTO;
};
