import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

/**
 * @author saneeshiv
 * @description Validates the request data against the provided Joi schema.
 */

/**
 * Validates an object of data against a Joi object schema.
 *
 * @template T - The type of the data being validated.
 * @param {T} data - The object to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema used for validation.
 * @param {Joi.ValidationOptions} [options={}] - Optional validation options for Joi.
 * @returns {{ error?: string[], value: T }} - Returns an object containing:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated value if validation succeeds.
 * @throws {AppError} - Throws an AppError if an unexpected error occurs during validation.
 */
export const validateObjectRequest = <T>(
  data: T,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateObjectRequest
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validateObjectRequest::', err); // Log any unexpected errors during validation
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};

/**
 * Validates an array of data against a Joi array schema.
 *
 * @template T - The type of the data being validated.
 * @param {T} data - The data to validate, expected to be an array.
 * @param {Joi.ArraySchema} schema - The Joi schema used for validation.
 * @param {Joi.ValidationOptions} [options={}] - Optional validation options for Joi.
 * @returns {{ error?: string[], value: T }} - Returns an object containing:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated value if validation succeeds.
 * @throws {AppError} - Throws an AppError if an unexpected error occurs during validation.
 */
export const validateArrayRequest = <T>(
  data: T,
  schema: Joi.ArraySchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    // Validate the input data against the provided schema, allowing multiple errors
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateArrayRequest
    });

    // Check if there are validation errors
    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validateArrayRequest::', err);
    throw new AppError('An unexpected error occurred during validation', 500); // Handle the error appropriately
  }
};
