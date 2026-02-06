/**
 * @constant role validation
 * @description Joi schema for validating role data.
 */
import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import { AddRoleDTO } from '../dtos/role/AddRoleDTO';

/**
 * Schema validation for creating a role.
 * This schema validates the required `userId` field to ensure it is a number
 * and provides meaningful error messages for invalid or missing inputs.
 *
 * Fields:
 * - userId: A required numeric identifier for the user. Custom error messages
 *   are provided for type mismatch and missing value.
 */
export const createRoleSchema = Joi.object({
  roleName: Joi.string().required().messages({
    'string.base': 'Role Name must be a string.',
    'any.required': 'Role Name is required.',
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string.',
    'any.required': 'Description is required.',
  }),
});


/**
 * Validates data against a specified Joi schema.
 * This function uses the provided schema to validate the given data and returns
 * either a list of validation errors or the validated data.
 *
 * @param {AddRoleDTO} data - The data object to validate.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {Joi.ValidationOptions} [options={}] - Optional Joi validation options to customize validation behavior.
 *
 * @returns {object} - An object containing either:
 *   - `error`: An array of error messages if validation fails.
 *   - `value`: The validated data if validation passes.
 *
 * @throws {AppError} - Throws an error if an unexpected issue occurs during validation.
 */
export const validateRole = (
  data: AddRoleDTO,
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
