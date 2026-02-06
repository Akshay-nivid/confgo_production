/**
 * @constant auth validation
 * @description Joi schema for validating auth data.
 * @author : sarathavs
 */
import Joi from 'joi';
import {
  AuthRequestDTO,
  AuthSsoRequestDTO,
  CreateSsoUserDTO,
} from '../dtos/auth/AuthDTO';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

export const authSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required.',
    'any.required': 'Username is a required field.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is a required field.',
  }),
});

export const ssoAuthSchema = Joi.object({
  provider: Joi.string().required().messages({
    'string.empty': 'Provider is required.',
    'any.required': 'Provider is a required field.',
  }),
  providerUserId: Joi.string().required().messages({
    'string.empty': 'Provider userId is required.',
    'any.required': 'Provider userId is a required field.',
  }),
});

/**
 * Joi validation schema for SSO user creation.
 */
export const createSsoUserSchema = Joi.object({
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
    .optional()
    .messages({
      'string.min': 'Last name must be at least 1 characters long.',
      'string.max':
        'Last name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'Last name must contain only alphabetic characters and spaces.',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  phone: Joi.string()
    .pattern(
      /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    )
    .optional()
    .messages({
      'string.pattern.base': 'Phone must be a valid phone number.',
    }),
  ssoMetadata: Joi.string().optional().messages({
    'string.base': 'Sso metadata value must be a number.',
  }),
});

export const validateAuth = (data: AuthRequestDTO) => {
  const { error, value } = authSchema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return { error: messages };
  }
  return { value };
};

/**
 * Validates the SSO authentication request data using a Joi schema.
 *
 * This function takes the SSO request data and validates it against a predefined Joi schema (`authSchema`).
 * If the validation fails, it collects all error messages and returns them as an array.
 * If the validation passes, it returns the validated data.
 *
 * @param {AuthSsoRequestDTO} data - The SSO authentication data containing the provider and providerUserId.
 * @returns {object} - An object containing either a list of error messages (`error`) if validation fails,
 *                     or the validated data (`value`) if validation is successful.
 */
export const validateSsoAuth = (data: AuthSsoRequestDTO) => {
  const { error, value } = ssoAuthSchema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    return { error: messages };
  }
  return { value };
};

/**
 * Validates the SSO user data using a provided Joi schema.
 *
 * This function validates user data such as first name, last name, email, and phone number
 * against a provided Joi schema. If validation fails, it returns an array of error messages.
 * If validation passes, it returns the validated data. Additionally, custom validation options
 * can be passed to override default validation settings.
 *
 * @param {CreateSsoUserDTO} data - The user data to be validated (firstName, lastName, email, phone, etc.).
 * @param {Joi.ObjectSchema} schema - The Joi schema against which the data is validated.
 * @param {Joi.ValidationOptions} [options={}] - Optional validation options to customize the validation process.
 * @returns {object} - Returns an object with either an array of error messages (`error`) or the validated data (`value`).
 * @throws {AppError} - Throws an error if unexpected issues occur during the validation process.
 */
export const validateSsoUserAuth = (
  data: CreateSsoUserDTO,
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
    Logger.error('Error during validation::', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};
