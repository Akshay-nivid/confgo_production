import Joi from 'joi';
import { enumPaymentState } from '../utils/enum';

export const createPaymentMethodSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': 'code is required.',
    'any.required': 'code is a required field.',
  }),

  handler: Joi.string().required().messages({
    'string.empty': 'Handler is required.',
    'any.required': 'Handler is a required field.',
  }),

  enabled: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .required()
    .messages({
      'string.empty': 'enabled is required',
      'any.required': 'enabled is a required field',
      'alternatives.types':
        'enabled must be a boolean (true/false) or a number (0/1)',
      'number.base': 'enabled must be either 0 or 1',
    }),

  name: Joi.string().required().messages({
    'string.empty': 'name is required',
    'any.required': 'name is a required field',
  }),

  description: Joi.string().required().messages({
    'string.empty': 'description is required',
    'any.required': 'description is a required field',
  }),

  logoUrl: Joi.string().required().messages({
    'string.empty': 'Logo url is required',
    'any.required': 'Logo url is a required field',
  }),
  minAmount: Joi.number().required().messages({
    'string.empty': 'Min amount is required',
    'any.required': 'Min amount is a required field',
  }),

  maxAmount: Joi.number().required().messages({
    'string.empty': 'Max amount is required',
    'any.required': 'Max amount is a required field',
  }),
});

/**
 * Joi schema for validating the payment creation form.
 * This schema enforces required fields and data structure for creating a new payment.
 */
export const createPaymentSchema = Joi.object({
  paymentMethodId: Joi.number().required().messages({
    'number.empty': 'Payment method id is required.',
    'any.required': 'Payment method id is a required field.',
  }),

  state: Joi.string()
    .valid(
      enumPaymentState.INITIATED,
      enumPaymentState.PENDING,
      enumPaymentState.COMPLETED,
      enumPaymentState.FAILED,
      enumPaymentState.CANCELED
    )
    .required()
    .messages({
      'any.only': `Invalid payment state.`,
      'string.empty': 'State is required.',
      'any.required': 'State is a required field.',
    }),
  errorMessage: Joi.string().optional().messages({
    'string.empty': 'Error mesasge cannot be blank',
  }),
  transactionId: Joi.string().optional().messages({
    'string.empty': 'Transaction id is required',
    'any.required': 'Transaction id is a required field',
  }),
  metadata: Joi.string().optional().messages({
    'string.empty': 'Metadata is required',
    'any.required': 'Metadata is a required field',
  }),
  amount: Joi.number().required().messages({
    'number.empty': 'Amount is required',
    'any.required': 'Amount is a required field',
  }),
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is a required field',
  }),
  orderId: Joi.number().optional(),
  paymentReferenceNumber: Joi.string().optional().messages({
    'string.empty': ' paymentReferenceNumber is required',
    'any.required': ' paymentReferenceNumber is a required field',
  }),
});

export const updatdePaymentSchema = Joi.object({
  paymentMethodId: Joi.number().optional().messages({
    'number.empty': 'Payment method id is required.',
    'any.required': 'Payment method id is a required field.',
  }),

  state: Joi.string()
    .valid(
      enumPaymentState.INITIATED,
      enumPaymentState.PENDING,
      enumPaymentState.COMPLETED,
      enumPaymentState.FAILED,
      enumPaymentState.CANCELED
    )
    .required()
    .messages({
      'any.only': `Invalid payment state.`,
      'string.empty': 'State is required.',
      'any.required': 'State is a required field.',
    }),
  errorMessage: Joi.string().optional().messages({
    'string.empty': 'Error mesasge cannot be blank',
  }),
  transactionId: Joi.string().optional().messages({
    'string.empty': 'Transaction id is required',
    'any.required': 'Transaction id is a required field',
  }),
  metadata: Joi.string().optional().messages({
    'string.empty': 'Metadata is required',
    'any.required': 'Metadata is a required field',
  }),
  amount: Joi.number().optional().messages({
    'number.empty': 'Amount is required',
    'any.required': 'Amount is a required field',
  }),
  paymentReferenceNumber: Joi.string().optional().messages({
    'string.empty': ' paymentReferenceNumber is required',
    'any.required': ' paymentReferenceNumber is a required field',
  }),
  orderId: Joi.number().optional().messages({
    'number.empty': 'Order Id is required',
    'any.required': 'Order Id is required'
  })
});

/**
 * Joi validation schema for creating a subscription payment.
 * This schema defines the required fields and their data types for a subscription payment request.
 * Each field includes custom error messages to provide more informative validation feedback to the user.
 */
export const createSubscriptionPaymentSchema = Joi.object({
  paymentMethodId: Joi.number().required().messages({
    'number.empty': 'Payment method id is required.',
    'any.required': 'Payment method id is a required field.',
  }),
  state: Joi.string()
    .valid(
      enumPaymentState.INITIATED,
      enumPaymentState.PENDING,
      enumPaymentState.COMPLETED,
      enumPaymentState.FAILED,
      enumPaymentState.CANCELED
    )
    .required()
    .messages({
      'any.only': `Invalid payment state.`,
      'string.empty': 'State is required.',
      'any.required': 'State is a required field.',
    }),
  errorMessage: Joi.string().required().messages({
    'string.empty': 'Error message is required',
    'any.required': 'Error message is a required field',
  }),
  transactionId: Joi.string().required().messages({
    'string.empty': 'Transaction id is required',
    'any.required': 'Transaction id is a required field',
  }),
  metadata: Joi.string().optional().messages({
    'string.empty': 'Metadata is required',
    'any.required': 'Metadata is a required field',
  }),
  amount: Joi.number().required().messages({
    'number.empty': 'Amount is required',
    'any.required': 'Amount is a required field',
  }),
  finalAmount: Joi.number().required().messages({
    'number.empty': 'Final amount is required',
    'any.required': 'Final amount is a required field',
  }),
  discountAmount: Joi.number().optional(),
  subscriptionId: Joi.number().required().messages({
    'number.empty': 'Subscription id is required',
    'any.required': 'Subscription id is a required field',
  }),
  userId: Joi.number().required().messages({
    'number.empty': 'User id is required',
    'any.required': 'User id is a required field',
  }),
  orderId: Joi.number().optional(),
  paymentReferenceNumber: Joi.string().optional().messages({
    'string.empty': ' paymentReferenceNumber is required',
    'any.required': ' paymentReferenceNumber is a required field',
  }),
});

export const updateSubscriptionPaymentSchema = Joi.object({
  paymentMethodId: Joi.number().optional().messages({
    'number.empty': 'Payment method id is required.',
    'any.required': 'Payment method id is a required field.',
  }),
  state: Joi.string()
    .valid(
      enumPaymentState.INITIATED,
      enumPaymentState.PENDING,
      enumPaymentState.COMPLETED,
      enumPaymentState.FAILED,
      enumPaymentState.CANCELED
    )
    .required()
    .messages({
      'any.only': `Invalid payment state.`,
      'string.empty': 'State is required.',
      'any.required': 'State is a required field.',
    }),
  errorMessage: Joi.string().optional().messages({
    'string.empty': 'Error message is required',
    'any.required': 'Error message is a required field',
  }),
  transactionId: Joi.string().optional().messages({
    'string.empty': 'Transaction id is required',
    'any.required': 'Transaction id is a required field',
  }),
  metadata: Joi.string().optional().messages({
    'string.empty': 'Metadata is required',
    'any.required': 'Metadata is a required field',
  }),
  amount: Joi.number().optional().messages({
    'number.empty': 'Amount is required',
    'any.required': 'Amount is a required field',
  }),
  finalAmount: Joi.number().optional().messages({
    'number.empty': 'Final amount is required',
    'any.required': 'Final amount is a required field',
  }),
  discountAmount: Joi.number().optional(),
  paymentReferenceNumber: Joi.string().optional().messages({
    'string.empty': ' paymentReferenceNumber is required',
    'any.required': ' paymentReferenceNumber is a required field',
  }),
});
