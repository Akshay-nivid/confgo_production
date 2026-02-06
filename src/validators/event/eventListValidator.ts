import Joi from 'joi';
import { ListEventDTO } from '../../dtos/event/EventDTO';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';

export const listEventSchema = Joi.object({
  name: Joi.string().optional(),
  title: Joi.string().optional(),
  amount: Joi.number().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
});
/**
 * @function validateEvent
 * @description Validates Event data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateListEvent = (
  data: ListEventDTO,
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
