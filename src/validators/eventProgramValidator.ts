import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import {
  CreateEventSpeakerDTO,
  CreateSpeakerBioDTO,
  UpdateEventProgramDTO,
} from '../dtos/event/EventProgramDTO';
import { StatusValidateDTO } from '../dtos/token/TokenDTO';

export const createEventProgramSchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.empty': 'User id is required.',
    'any.required': 'User id is a required field.',
  }),
 
 
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required.',
    'any.required': 'Event id is a required field.',
  }),
  parentEventId: Joi.number().optional(),
  statusId: Joi.optional(),
});

export const createSpeakerBioSchema = Joi.object({
  speakerFileId: Joi.optional(),
  eventSpeakerId: Joi.optional(),
  endTime: Joi.optional(),
  startTime: Joi.optional(),
  description: Joi.optional(),
  designation: Joi.optional(),
  isModerator: Joi.optional(),
});

/**
 * Validator for Update speaker bio
 */
export const updateSpeakerBioSchema = Joi.object({
  fileId: Joi.optional(),
  eventSpeakerId: Joi.optional(),
  endTime: Joi.optional(),
  startTime: Joi.optional(),
  description: Joi.optional(),
});

export const validateEventProgram = (
  data: CreateEventSpeakerDTO,
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
 * Validate Speaker Bio details
 * @param data 
 * @param schema 
 * @param options 
 * @returns 
 */
export const validateSpeakerBio = (
  data: CreateSpeakerBioDTO,
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
  statusName: Joi.string().required().messages({
    'string.empty': 'statusName cannot be empty.',
    'any.required': 'statusName is required.',
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
  data: StatusValidateDTO,
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

export const updateEventProgramSchema = Joi.object({
  eventId: Joi.number().optional().messages({
    'number.empty': 'Event id is required.',
    'any.required': 'Event id is a required field.',
  }),
  speakerFileId: Joi.number().optional().allow(null).messages({
    'number.empty': 'Asset id is required.',
    'any.required': 'Asset id is a required field.',
  }),
  statusId: Joi.number().optional().messages({
    'number.empty': 'Status id is required.',
    'any.required': 'Status id is a required field.',
  }),
});

export const validateUpdateEventProgram = (
  data: UpdateEventProgramDTO,
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

export const fetchEventIdSchema = Joi.object({
  eventId: Joi.number().optional().messages({
    'number.empty': 'Event id is required.',
    'any.required': 'Event id is a required field.',
  }),
})