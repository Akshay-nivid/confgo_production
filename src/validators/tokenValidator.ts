import Joi from 'joi';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import {
  CreateOtpTokenDTO,
  CreateTokenDTO,
  OtpValidationDTO,
  StatusValidationDTO,
  TokenValidationDTO,
} from '../dtos/token/TokenDTO';

/**
 * token Validations
 * @description Joi schema for validating token data.
 */
export const createTokenSchema = Joi.object({
  type: Joi.string().required().messages({
    'string.empty': 'Type is Required',
    'any.required': 'Type is required',
  }),
  userId: Joi.number().required().messages({
    'number.base': 'User ID must be a number.',
    'any.required': 'User ID is required.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
});

/**
 * @function validateToken
 * @description Validates token data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateToken = (
  data: CreateTokenDTO,
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
/**
 *
 */
export const tokenValidatorSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token cannot be empty.',
    'any.required': 'Token is required.',
  }),

  type: Joi.string().required().messages({
    'string.empty': 'Type cannot be empty.',
    'any.required': 'Type is required.',
  }),

  userId: Joi.number().required().messages({
    'string.empty': 'User ID cannot be empty.',
    'any.required': 'User ID is required.',
  }),
});

export const validatesToken = (
  data: TokenValidationDTO,
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

export const otpValidatorSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token cannot be empty.',
    'any.required': 'Token is required.',
  }),

  type: Joi.string().required().messages({
    'string.empty': 'Type cannot be empty.',
    'any.required': 'Type is required.',
  }),

  otp: Joi.string().required().messages({
    'string.empty': 'OTP cannot be empty.',
    'any.required': 'OTP is required.',
  }),

  userId: Joi.number().required().messages({
    'number.base': 'User ID must be a number.',
    'any.required': 'User ID is required.',
  }),
});
/**
 * Validates otp data against a provided Joi schema.
 * @param data
 * @param schema
 * @param options
 * @returns
 */
export const validateOtp = (
  data: OtpValidationDTO,
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

export const statusValidatorSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name cannot be empty.',
    'any.required': 'Name is required.',
  }),
});
/**
 * Validates otp data against a provided Joi schema.
 * @param data
 * @param schema
 * @param options
 * @returns
 */
export const validateStatus = (
  data: StatusValidationDTO,
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

/**
 * Schema to validate phone while creating otp token
 */
export const createOtpTokenSchema = Joi.object({
  // phone: Joi.string()
  //   .pattern(
  //     /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
  //   )
  //   .required()
  //   .messages({
  //     'string.empty': 'Phone is required.',
  //     'string.pattern.base': 'Phone must be a valid phone number.',
  //     'any.required': 'Phone is a required field.',
  //   }),
  phone: Joi.string()
  .required()
  .messages({
    'string.empty': 'Phone is required.',
    'any.required': 'Phone is a required field.',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Type is Required',
    'any.required': 'Type is required',
  }),
});
/**
 * Validates otp data against a provided Joi schema.
 * @param data
 * @param schema
 * @param options
 * @returns
 */
export const validateOtpToken = (
  data: CreateOtpTokenDTO,
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
