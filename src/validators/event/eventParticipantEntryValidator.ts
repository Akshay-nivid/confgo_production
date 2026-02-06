import Joi from 'joi';
import {
  AddEventParticipantDTO,
  UpdateEntryDTO,
} from '../../dtos/event/EventParticipantEntryDTO';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

/**
 * Event participant entry Validations
 * @description Joi schema for validating event participant entry data.
 */
export const addEventParticipantSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event Id is required.',
    'any.required': 'Event Id is a required field.',
  }),
  participantTypeId: Joi.number().optional().messages({
    'number.empty': 'Participant Type Id is required.',
    'any.required': 'Participant Type Id is a required field.',
  }),
  parentEventId: Joi.number().required().messages({
    'number.empty': 'Parent Event Id is required.',
    'any.required': 'Parent Event Id is a required field.',
  }),
  totalSeat: Joi.number().required().messages({
    'number.empty': 'Total Seat is required.',
    'any.required': 'Total Seat is a required field.',
  }),
  seatAllocated: Joi.number().required().messages({
    'number.empty': 'Seat Allocated is required.',
    'any.required': 'Seat Allocated is a required field.',
  }),
});

/**
 * @function validateEventParticipant
 * @description Validates Event Participant Entry data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateEventParticipant = (
  data: AddEventParticipantDTO,
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
 * Update Event Participant Entry Schema and Validator
 */
export const updateEventParticipantSchema = Joi.object({
  totalSeat: Joi.number().optional(),
  seatAllocated: Joi.number().optional(),
});

export const validateUpdateEventParticipant = (
  data: UpdateEntryDTO,
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
