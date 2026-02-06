import Joi from 'joi';
import { CreateSubscriptionRequestDTO } from '../dtos/subscription/SubscriptionDTO';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
 * subscription Validations
 * @description Joi schema for validating subscription data.
 */
export const createSubscriptionSchema = Joi.object({
  planId: Joi.number().required().messages({
    'number.empty': 'Plan Id is a Required Field',
    'any.required': 'Plan Id is a Required Field',
  }),
  discountCouponId: Joi.number().optional(),
  extendedPlanId: Joi.number().optional(),
  extendedPlanStart: Joi.date().optional(),
  paymentId: Joi.number().optional(),
});

/**
 * @function validateSubscription
 * @description Validates subscription data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateSubscription = (
  data: CreateSubscriptionRequestDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      ...options,
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};
