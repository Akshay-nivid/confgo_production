/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

export const createCouponSchema = Joi.object({
  code: Joi.string().min(6).max(8).required().messages({
    'string.empty': 'Coupon code is required.',
    'string.min': 'Coupon code must be at least 6 characters long.',
    'string.max': 'Coupon code must not exceed 8 characters.',
    'any.required': 'Coupon code is a required field.',
  }),

  name: Joi.string().required().messages({
    'string.empty': 'Coupon name is required.',
    'any.required': 'Coupon name is a required field.',
  }),

  startDate: Joi.date()
    .custom((value, helpers) => {
      const now = new Date();
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      if (value < currentDate) {
        return helpers.error('date.min');
      }
      return value;
    })
    .required()
    .messages({
      'date.min': 'The date must not be in the past.',
      'date.base': 'start Date must be a valid date.',
      'any.required': 'The date is required.',
    }),

  endDate: Joi.date().greater(Joi.ref('startDate')).optional().messages({
    'date.base': 'End Date must be a valid date.',
    'date.greater': 'End Date must be greater than Start Date.',
  }),

  discountType: Joi.string().required().messages({
    'string.empty': 'discount type cannot be empty.',
    'any.required': 'Discount Type is required.',
  }),

  discountValue: Joi.number()
    .positive()
    .required()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number().max(100).messages({
        'number.max':
          'Discount Value cannot exceed 100 for Percentage discounts.',
      }),
    })
    .messages({
      'number.base': 'Discount Value must be a number.',
      'number.positive': 'Discount Value must be a positive number.',
      'any.required': 'Discount Value is required.',
    }),

  maxUses: Joi.number().integer().positive().required().messages({
    'number.base': 'Max Uses must be a number.',
    'number.integer': 'Max Uses must be an integer.',
    'number.positive': 'Max Uses must be a positive number.',
    'any.required': 'Max Uses is required.',
  }),

  maxDiscountValue: Joi.number()
    .positive()
    .required()
    .when('discountType', {
      is: 'flat',
      then: Joi.valid(Joi.ref('discountValue')).messages({
        'any.only':
          'Maximum Discount Amount should be the same as the Discount Value for Flat Rate discounts.',
      }),
    })
    .messages({
      'number.base': 'Max Discount Value must be a number.',
      'number.positive': 'Max Discount Value must be a positive number.',
      'any.required': 'Max Discount Value is required.',
    }),

  minPurchaseValue: Joi.number()
    .positive()
    .required()
    .when('discountType', {
      is: 'flat',
      then: Joi.number().min(Joi.ref('discountValue')).messages({
        'number.min':
          'Minimum Purchase Amount should not be less than Discount Value for flat rate discounts.',
      }),
    })
    .messages({
      'number.base': 'Min Purchase Value must be a number.',
      'number.positive': 'Min Purchase Value must be a positive number.',
      'any.required': 'Min Purchase Value is required.',
    }),

  statusId: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Status ID must be a number.',
    'number.integer': 'Status ID must be an integer.',
    'number.min': 'Status ID must be at least greater than or equal to 0.',
  }),

  description: Joi.string().allow('').messages({
    'string.base': 'description must be a string.',
  }),
});

export const updateCouponSchema = Joi.object({
  code: Joi.string().min(6).max(8).optional().messages({
    'string.empty': 'Coupon code cannot be empty.',
    'string.min': 'Coupon code must be at least 6 characters long.',
    'string.max': 'Coupon code must not exceed 8 characters.',
  }),

  name: Joi.string().optional().messages({
    'string.empty': 'Coupon name cannot be empty.',
  }),

  startDate: Joi.date()
    .custom((value, helpers) => {
      const now = new Date();
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      if (value < currentDate) {
        return helpers.error('date.min');
      }
      return value;
    })
    .optional()
    .messages({
      'date.min': 'The date must not be in the past.',
      'date.base': 'start Date must be a valid date.',
      'any.required': 'The date is required.',
    }),

  endDate: Joi.date().greater(Joi.ref('startDate')).optional().messages({
    'date.base': 'End Date must be a valid date.',
    'date.greater': 'End Date must be greater than Start Date.',
  }),

  discountType: Joi.string().optional().messages({
    'string.empty': 'discount type cannot be empty.',
  }),

  discountValue: Joi.number().positive().optional().messages({
    'number.base': 'Discount Value must be a number.',
    'number.positive': 'Discount Value must be a positive number.',
  }),

  maxUses: Joi.number().integer().positive().optional().messages({
    'number.base': 'Max Uses must be a number.',
    'number.integer': 'Max Uses must be an integer.',
    'number.positive': 'Max Uses must be a positive number.',
  }),

  maxDiscountValue: Joi.number().positive().optional().messages({
    'number.base': 'Max Discount Value must be a number.',
    'number.positive': 'Max Discount Value must be a positive number.',
  }),

  minPurchaseValue: Joi.number().positive().optional().messages({
    'number.base': 'Min Purchase Value must be a number.',
    'number.positive': 'Min Purchase Value must be a positive number.',
  }),

  statusId: Joi.number().integer().optional().messages({
    'number.base': 'status must be a number.',
    'number.integer': 'status must be an integer.',
  }),

  description: Joi.string().allow('').messages({
    'string.base': 'description must be a string.',
  }),
});

export const applyCouponSchema = Joi.object({
  code: Joi.string().min(6).max(8).required().messages({
    'string.empty': 'Coupon code is required.',
    'string.min': 'Coupon code must be at least 6 characters long.',
    'string.max': 'Coupon code must not exceed 8 characters.',
    'any.required': 'Coupon code is a required field.',
  }),
  cartId: Joi.number().required().messages({
    'number.empty': 'Cart Id is required.',
    'any.required': 'Cart Id is a required field.',
  }),
});

export const removeCouponSchema = Joi.object({
  cartId: Joi.number().required().messages({
    'number.empty': 'Cart Id is required.',
    'any.required': 'Cart Id is a required field.',
  }),
});

export const validateCoupon = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateUser
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};
