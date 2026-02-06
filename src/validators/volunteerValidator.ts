/**
 * @constant volunteer validation
 * @description Joi schema for validating volunteer data.
 */
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import {
  AddVolunteerDTO,
  AddVolunteerEventDTO,
} from '../dtos/volunteer/AddVolunteerDTO';

/**
 * Schema validation for creating a volunteer.
 * This schema validates the required `userId` field to ensure it is a number
 * and provides meaningful error messages for invalid or missing inputs.
 *
 * Fields:
 * - userId: A required numeric identifier for the user. Custom error messages
 *   are provided for type mismatch and missing value.
 */
export const createVolunteerSchema = Joi.object({
  userId: Joi.number().required().messages({
    'number.base': 'User ID must be a number.',
    'any.required': 'User ID is required.',
  }),
});

/**
 * Schema validation for creating a volunteer event.
 * This schema validates the required `volunteerId` and `eventId` fields.
 * - `volunteerId`: Must be a number and is required. Provides custom error messages for type mismatch and missing value.
 * - `eventId`: Must be an array and is required. Provides custom error messages for type mismatch and missing value.
 */
export const createVolunteerEventSchema = Joi.object({
  volunteerId: Joi.number().required().messages({
    'number.base': 'Volunteer ID must be a number.',
    'any.required': 'Volunteer ID is required.',
  }),
  eventId: Joi.array().required().messages({
    'number.base': 'Volunteer ID must be a number.',
    'any.required': 'Volunteer ID is required.',
  }),
});

/**
 * Validates data against a specified Joi schema.
 * This function uses the provided schema to validate the given data and returns
 * either a list of validation errors or the validated data.
 *
 * @param {AddVolunteerDTO} data - The data object to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Joi.ValidationOptions} [options={}] - Optional Joi validation options to customize validation behavior.
 *
 * @returns {object} - An object containing either:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated data if validation passes.
 *
 * @throws {AppError} - Throws an error if an unexpected issue occurs during validation.
 */
export const validateVolunteer = (
  data: AddVolunteerDTO,
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
 * Validates data against a specified Joi schema for volunteer event assignment.
 * This function uses the provided schema to validate the given data object and
 * returns either a list of validation errors or the validated data.
 *
 * @param {AddVolunteerEventDTO} data - The data object containing volunteer event details to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Joi.ValidationOptions} [options={}] - Optional Joi validation options to customize validation behavior.
 *
 * @returns {object} - An object containing either:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated data if validation passes.
 *
 * @throws {AppError} - Throws an error if an unexpected issue occurs during validation.
 */
export const validateVolunteerEvent = (
  data: AddVolunteerEventDTO,
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
