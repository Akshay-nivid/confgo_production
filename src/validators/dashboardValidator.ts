/**
 * @constant volunteer validation
 * @description Joi schema for validating volunteer data.
 */
import Joi from 'joi';

/**
 * Schema validation for creating a dashboard count validator.
 * This schema validates the required `eventId` field to ensure it is a number
 * and provides meaningful error messages for invalid or missing inputs.
 *
 * Fields:
 * - userId: A required numeric identifier for the user. Custom error messages
 *   are provided for type mismatch and missing value.
 */
export const fetchDahboardSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.base': 'Event ID must be a number.',
    'any.required': 'Event ID is required.',
  }),
});

export const createRevenueCountSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  eventId: Joi.number().optional(),
});