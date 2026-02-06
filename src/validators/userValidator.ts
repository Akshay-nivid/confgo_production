/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import { AssignEventToUserDTO, AssignEventVolunteerDTO } from '../dtos/user/UserDTO';

/**
 * User Validations
 * @description Joi schema for validating user data.
 * @author : sarathavs
 */
export const createUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z\s.]+$/)
    .required()
    .messages({
      'string.empty': 'First name is required.',
      'string.min': 'First name must be at least 3 characters long.',
      'string.max':
        'First name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'First name must contain only alphabetic characters, spaces, and periods.',
      'any.required': 'First name is a required field.',
    }),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z\s.]+$/)
    .required()
    .messages({
      'string.empty': 'Last name is required.',
      'string.min': 'Last name must be at least 1 characters long.',
      'string.max':
        'Last name must be less than or equal to 30 characters long.',
      'string.pattern.base':
        'Last name must contain only alphabetic characters, spaces, and periods.',
      'any.required': 'Last name is a required field.',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
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
  phone: Joi.number().required().messages({
    'string.empty': 'Phone is required.'
  }),
  designation: Joi.string().optional(),
  userDescription: Joi.string().optional(),
  assetId: Joi.string().optional(),
  roleId: Joi.number().optional(),
  companyId: Joi.number().optional(),
});

export const assignVolunteerSchema = Joi.object({
  userIds: Joi.array().items(Joi.number()).min(1).required().messages({
    'array.base': 'User ids must be an array.',
    'array.includes': 'Each User IDs must be a number.',
    'any.required': 'User IDs is a required field.',
    'array.min': 'User ids array cannot be empty.',
  }),
  speakerFileId: Joi.optional(),
 
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required.',
    'any.required': 'Event id is a required field.',
  }),
  statusId: Joi.optional(),
});
/**
 * @constant updateUserSchema
 * @description Joi schema for validating user update request data.
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address.',
  }),
  assetId: Joi.string().optional().allow(null),
  deviceToken: Joi.string().optional().allow(null),
  designation: Joi.string().optional().allow(null),
  userDesciption: Joi.string().optional().allow(null),
  statusId: Joi.number().optional().allow(null),
  acceptedTerms: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().valid(0, 1))
    .custom((value) => {
      if (value === 0) return false;
      if (value === 1) return true;
      return value;
    })
    .optional(),
});

/**
 * @constant updateUserPhoneSchema
 * @description Joi schema for validating user update request data.
 */
export const updateUserPhoneSchema = Joi.object({
  phone: Joi.string()
    .pattern(
      /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    )
    .required()
    .messages({
      'string.empty': 'Phone is required.',
      'string.pattern.base': 'Phone must be a valid phone number.',
      'any.required': 'Phone is a required field.',
    }),
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
});

/**
 * @function validateUser
 * @description Validates user data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateUser = (
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

export const userPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(
      new RegExp(
        '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,16}$'
      )
    )
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must not exceed 16 characters.',
      'string.pattern.base':
        'Password must be 8-16 characters long and include at least one uppercase letter, one number, and one special character.',
      'any.required': 'Password is a required field.',
    }),

  token: Joi.string().required().messages({
    'any.required': 'Token is required.',
  }),

  type: Joi.string().required().messages({
    'any.required': 'Type is required.',
  }),

  userId: Joi.number().required().messages({
    'any.required': 'userId is required.',
  }),
});

/**
 * vilidatePassword
 * @param data
 * @param schema
 * @param options
 * @returns
 */
export const validatePassword = (
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

/**
 * User Validations
 * @description Joi schema for validating user data.
 * @author : sarathavs
 */
export const retrieveUserSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required.',
    'any.required': 'Token is a required field.',
  }),
  userId: Joi.number().required().messages({
    'number.base': 'User id must be a number.',
    'any.required': 'User id is a required field.',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Type is required.',
    'any.required': 'Type is a required field.',
  }),
});

/**
 * @constant forgotPasswordSchema
 * @description Schema to validate the forgot password request using Joi
 */
export const forgotPasswordSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required.',
    'any.required': 'Username is a required field.',
  }),
});

export const checkUserRegistrationSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address.',
  }),
  phone: Joi.string()
    // .pattern(
    //   /^((\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$|^(\+1[\-\s]?)?\(?[2-9][0-9]{2}\)?[\-\s]?[2-9][0-9]{2}[\-\s]?[0-9]{4}$)/
    // )
    .optional()
    .messages({
      'string.empty': 'Phone is required.',
      //'string.pattern.base': 'Phone must be a valid phone number.',
    }),
})
  .or('email', 'phone') // Ensure at least one field is provided
  .messages({
    'object.missing': 'Either email or phone is required.',
  });

/**
 * Schema validation for creating a user event.
 * This schema validates the required `userId` and `eventId` fields.
 * - `userId`: Must be a number and is required. Provides custom error messages for type mismatch and missing value.
 * - `eventId`: Must be an array and is required. Provides custom error messages for type mismatch and missing value.
 */
export const assignUserEventSchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.base': 'User ID must be a number.',
    'any.required': 'User ID is required.',
  }),
  eventId: Joi.number().required().messages({
    'number.base': 'Event ID must be a number.',
    'any.required': 'Event ID is required.',
  }),
});

/**
 * Validates data against a specified Joi schema for user event assignment.
 * This function uses the provided schema to validate the given data object and
 * returns either a list of validation errors or the validated data.
 *
 * @param {AssignEventToUserDTO} data - The data object containing user event details to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Joi.ValidationOptions} [options={}] - Optional Joi validation options to customize validation behavior.
 *
 * @returns {object} - An object containing either:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated data if validation passes.
 *
 * @throws {AppError} - Throws an error if an unexpected issue occurs during validation.
 */
export const validateAssignEvent = (
  data: AssignEventToUserDTO,
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
 * Validates data against a specified Joi schema for user event assignment to volunteer.
 * @param {AssignEventToUserDTO} data - The data object containing user event details to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Joi.ValidationOptions} [options={}] - Optional Joi validation options to customize validation behavior.
 * @returns {object} - An object containing either:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated data if validation passes.
 */
export const validateAssignEventToVolunteer = (
  data: AssignEventVolunteerDTO,
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
 * Validator for Reset Password api request.
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.base': 'Current Password must be a string.',
    'any.required': 'Current Password is required.',
  }),
  newPassword: Joi.string().required().messages({
    'string.base': 'New Password must be a string.',
    'any.required': 'New Password is required.',
  }),
});