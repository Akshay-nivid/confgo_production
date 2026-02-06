import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import { SponsorshipInterestDTO } from '../dtos/notification/NotificationDTO';

/**
 * @author saneeshiv
 * @description Joi schema for validating notification setting request data.
 */

export const updateNotificationSettingSchema = Joi.object({
  actionName: Joi.string().optional(),
  email: Joi.number().optional(),
  whatsapp: Joi.number().optional(),
  sms: Joi.number().optional(),
  isEnabled: Joi.number().optional(),
});

export const contactusSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'string.min': 'First name must be at least 3 characters long.',
      'string.max':
        'First name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'First name must contain only alphabetic characters and spaces.',

      'any.required': 'First name is a required field.',
    }),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required.',
      'string.min': 'Last name must be at least 1 characters long.',
      'string.max':
        'Last name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'Last name must contain only alphabetic characters and spaces.',

      'any.required': 'Last name is a required field.',
    }),
  companyName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Company name is required.',
    'any.required': 'Company name is a required field.',
  }),
  gRecaptcha: Joi.string().required().messages({
    'string.empty': 'Google recaptcha is required.',
    'any.required': 'Google recaptcha is a required field.',
  }),
  phone: Joi.string()
    // .pattern(
    //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    // )
    .required()
    .messages({
      'string.empty': 'Phone is required.',
      'string.pattern.base': 'Phone must be a valid phone number.',
      'any.required': 'Phone is a required field.',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  message: Joi.string().optional(),
});

export const eventInviteSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id must be a number',
    'any.required': 'Event id is required field',
  }),
  eventName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Event name is required.',
    'any.required': 'Event name is a required field.',
  }),
  eventUrl: Joi.string().required().uri().messages({
    'any.required': 'Event URL is a required field.',
    'string.uri': 'Event URL must be a valid URL.',
    'string.empty': 'Event URL is required.',
  }),
  emails: Joi.array().items(Joi.string().email()).required().messages({
    'array.base': 'Emails must be an array.',
    'array.includes': 'Each emails must be a string.',
    'any.required': 'Emails is a required field.',
  }),
  notes: Joi.string().optional(),
});

/**
 * @function validateNotificationSetting
 * @description Validates notification setting data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateNotificationSetting = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateNotificationSetting
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

/**
 * @function validateContactus
 * @description Validates contactus data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateContactus = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateContactus
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

/**
 * Validator for sponsor interest from.
 */
export const sponsorshipInterestSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'string.min': 'First name must be at least 3 characters long.',
      'string.max':
        'First name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'First name must contain only alphabetic characters and spaces.',

      'any.required': 'First name is a required field.',
    }),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required.',
      'string.min': 'Last name must be at least 1 characters long.',
      'string.max':
        'Last name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'Last name must contain only alphabetic characters and spaces.',

      'any.required': 'Last name is a required field.',
    }),
  companyName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Company name is required.',
    'any.required': 'Company name is a required field.',
  }),
  gRecaptcha: Joi.string().required().messages({
    'string.empty': 'Google recaptcha is required.',
    'any.required': 'Google recaptcha is a required field.',
  }),
  jobTitle: Joi.string().optional().messages({
    'string.empty': 'Job Title is required.',
    'any.required': 'Job Title is a required field.',
  }),
  eventId: Joi.number().required().messages({
    'number.empty': 'Event Id is required',
    'any.required': 'Event Id is required'
  }),
  phone: Joi.string()
    // .pattern(
    //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    // )
    .required()
    .messages({
      'string.empty': 'Phone is required.',
      'string.pattern.base': 'Phone must be a valid phone number.',
      'any.required': 'Phone is a required field.',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  message: Joi.string().optional(),
});

export const validateSponsorshipInterest = (
  data: SponsorshipInterestDTO,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateContactus
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