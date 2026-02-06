import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import {
  CreateEventPriceTierDTO,
  UpdatePriceTierDTO,
} from '../../dtos/event/EventPriceTierDTO';

export const createPriceTierSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event Id is a required field',
    'any.required': 'Event Id is a required field',
  }),
  priceTiers: Joi.array().items(
    Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is a required field',
        'any.required': 'Name is a required field',
      }),
      description: Joi.string().optional(),
      participantTypeId: Joi.number().required().messages({
        'number.empty': 'Participant Type Id must be a number',
        'any.required': 'Participant Type Id is a required field',
      }),
      startDate: Joi.date().optional().messages({
        'date.empty': 'Start Date must be a valid date',
        'any.required': 'Start Date is a required field',
      }),
      endDate: Joi.date().optional().messages({
        'date.empty': 'End Date must be a valid date',
        'any.required': 'End Date is a required field',
      }),
      percentage: Joi.number().optional().messages({
        'number.empty': 'Percentage must be a number',
        'any.required': 'Percentage is a required field',
      }),
    })
  ),
});
/**
 * @function validateEventPriceTier
 * @description Validates Event Price Tier data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateEventPriceTier = (
  data: CreateEventPriceTierDTO,
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

//Update Event Price tier schema and validator
export const updatePriceTierSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name is a required field',
    'any.required': 'Name is a required field',
  }),
  description: Joi.string().optional(),
  participantTypeId: Joi.number().optional().messages({
    'number.empty': 'Participant Type Id must be a number',
    'any.required': 'Participant Type Id is a required field',
  }),
  endDate: Joi.date().optional().messages({
    'date.empty': 'End Date must be a valid date',
    'any.required': 'End Date is a required field',
  }),
  percentage: Joi.number().optional().messages({
    'number.empty': 'Percentage must be a number',
    'any.required': 'Percentage is a required field',
  }),
});

export const validateUpdatePriceTier = (
  data: UpdatePriceTierDTO,
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
