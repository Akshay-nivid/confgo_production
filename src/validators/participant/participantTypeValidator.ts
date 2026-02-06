import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import {
  CreateParticipantTypeDTO,
  UpdateParticipantTypeDTO,
} from '../../dtos/participant/ParticipantTypeDTO';

/**
 * participant type Validations
 * @description Joi schema for validating participant type data.
 */
export const createParticipantTypeSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name is required.',
    'any.required': ' name is a required field.',
  }),
  eventId: Joi.number().required().messages({
    'number.empty': 'event id is required.',
    'any.required': 'event id is a required field.',
  }),
  description: Joi.string(),
  isContributor: Joi.number().optional(),
});

/**
 * @function validateParticipant
 * @description Validates Participant data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateParticipantType = (
  data: CreateParticipantTypeDTO,
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

export const updateParticipantTypeSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'name is not be empty.',
  }),
  eventId: Joi.number().optional().messages({
    'number.empty': 'event id is not be empty required.',
  }),
  id: Joi.number().required().messages({
    'number.empty': 'id is required.',
    'any.required': 'id is a required field.',
  }),
  description: Joi.string().optional(),
});

export const validateUpdateParticipantType = (
  data: UpdateParticipantTypeDTO,
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
