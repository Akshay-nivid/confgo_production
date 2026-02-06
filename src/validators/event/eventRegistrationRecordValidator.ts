import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import {
  UpdateEventRegistrationRecordDTO,
  UpdateRegistrationRecordParticipantDTO,
} from '../../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';

export const updateEventRegistrationRecordSchema = Joi.object({
  response: Joi.string().optional().messages({}),
});
export const validateRecord = (
  data: UpdateEventRegistrationRecordDTO,
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

export const updateRegistrationRecordParticipantSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'any.required': 'EventId is required',
  }),
});
export const validateRegistrationRecordParticipant = (
  data: UpdateRegistrationRecordParticipantDTO,
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
