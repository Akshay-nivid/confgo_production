import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

/**
 * @author saneeshiv
 * @description Joi schema for validating company data.
 */

export const createCompanySchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
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
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  phone: Joi.string()
    .required()
    .messages({
      'string.empty': 'Phone is required.',
      'string.pattern.base': 'Phone must be a valid phone number.',
      'any.required': 'Phone is a required field.',
    }),
  companyName: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Company name is required.',
    'string.min': 'Company name cannot be empty or contain only spaces.',
    'any.required': 'Company name is a required field.',
  }),
  companyAddress: Joi.string().required().messages({
    'string.empty': 'Company address is required.',
    'any.required': 'Company address is a required field.',
  }),
  companyEmail: Joi.string().email().optional().messages({
    'string.email': 'Company email must be a valid email address.',
  }),
  companyPhone: Joi.string()
    .required()
    .messages({
      'string.empty': 'Company phone is required.',
      'string.pattern.base': 'Company phone must be a valid phone number.',
      'any.required': 'Company phone is a required field.',
    }),
  planId: Joi.number().required().messages({
    'number.base': 'Plan id must be a number.',
    'any.required': 'Plan id is a required field.',
  }),
  statusId: Joi.number().required().messages({
    'number.base': 'Status id must be a number.',
    'any.required': 'Status id is a required field.',
  }),
  assetId: Joi.string().optional(),
});

export const updateCompanySchema = Joi.object({
  companyName: Joi.string().trim().min(1).optional().messages({
    'string.empty': 'Company name is required.',
    'string.min': 'Company name cannot be empty or contain only spaces.',
    'any.required': 'Company name is a required field.',
  }),
  companyAddress: Joi.string().optional().messages({
    'string.empty': 'Company address is required.',
    'any.required': 'Company address is a required field.',
  }),
  companyEmail: Joi.string().email().optional().messages({
    'string.email': 'Company email must be a valid email address.',
  }),
  companyPhone: Joi.string()
    // .pattern(
    //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    // )
    .optional()
    .messages({
      'string.empty': 'Company phone is required.',
      'string.pattern.base': 'Company phone must be a valid phone number.',
      'any.required': 'Company phone is a required field.',
    }),
  statusId: Joi.number().optional().messages({
    'number.base': 'Status id must be a number.',
    'any.required': 'Status id is a required field.',
  }),
  assetId: Joi.string().optional().messages({
    'string.empty': 'Asset Id is not valid',
    'any.required': 'Asset Id is required',
  }),
});

/**
 * @function validateCompany
 * @description Validates company data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateCompany = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateCompany
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error validateCompany:', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};
