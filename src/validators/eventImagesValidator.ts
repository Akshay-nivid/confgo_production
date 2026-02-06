import Joi from 'joi';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
 * Joi schema for validating the creation of a user abstract.
 */
export const uploadImagesSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.base': 'Event ID must be a number',
    'any.required': 'Event ID is required',
  }),
  assetIds: Joi.array()
    .items(
      Joi.string().required().messages({
        'string.base': 'Each Asset ID must be a valid string',
        'any.required': 'Asset IDs must not be empty',
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Asset IDs must be an array of numbers',
      'array.min': 'At least one Asset ID is required',
      'any.required': 'Asset IDs are required',
    }),
});

/**
 * Validates the provided data against the given Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to use for validation.
 * @param options - Optional Joi validation options.
 * @returns An object containing either a `value` or an `error` array.
 */
export const validateEventImages = (
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
    Logger.error('Error validateUserAbstract:', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};

/**
 * Schema for Validating getAllEventImages Data
 */
export const getAllEventImagesSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
});
