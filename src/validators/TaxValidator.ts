import Joi from 'joi';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/AppError';



/**
 * @function validateTax
 * @description Validates tax data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing validation errors (if any) and the validated data.
 */
export const validateTax = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      ...options,
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error during validation::', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};
