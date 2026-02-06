/**
 * @constant attendee validation
 * @description Joi schema for validating attendee data.
 */
import Joi from 'joi';
import { AddAttendeeDTO } from '../dtos/attendee/AddAttendeeDTO';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

export const createAttendeeSchema = Joi.object({
  eventId: Joi.array().items(Joi.number()).required().messages({
    'array.base': 'Event ID must be an array.',
    'array.includes': 'Each Event ID must be a number.',
    'any.required': 'Event ID is a required field.',
  }),
  addons: Joi.array()
    .items(
      Joi.object({
        addonId: Joi.number().required().messages({
          'number.base': 'Addon id must be a number',
          'any.required': 'Addon id is required',
        }),
        addonPropertyId: Joi.number().optional().messages({
          'number.base': 'Addon Property id must be a number',
        }),
      })
    )
    .optional(),
  qrCode: Joi.string().optional().messages({
    'string.empty': 'Qr code is required',
    'any.required': 'Qr code is required',
  }),
  participantId: Joi.number().optional(),
});

export const validateAttendee = (
  data: AddAttendeeDTO,
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
