import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import { CreateParticipantRequestDTO } from '../../dtos/participant/ParticipantDTO';

/**
 * Participant Validations
 * @description Joi schema for validating participant data.
 */
export const createParticipantSchema = Joi.object({
  orderId: Joi.number().required().messages({
    'number.empty': 'order id is required',
    'any.required': 'order id is required',
  }),
  registrationType: Joi.string().required().messages({
    'string.empty': 'Registration type is required',
    'any.required': 'Registration type is required',
  }),
});

/**
 * @function validateParticipant
 * @description Validates Participant data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateParticipant = (
  data: CreateParticipantRequestDTO,
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
 * Schema for Validating existingParticipantOrNot Data
 */
export const createParticipantCheckSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
});

/**
 * Schema for fetch participant details by qr code and event id
 */
export const createQrParticipantSchema = Joi.object({
  qrCode: Joi.string().optional().messages({
    'string.empty': 'Qr Code is a required field',
    'any.required': 'Qr Code is a required field',
  }),
  participantId: Joi.number().optional(),
});
