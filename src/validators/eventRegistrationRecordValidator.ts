import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

export const createRegistrationRecordSchema = Joi.object({
  data: Joi.array()
    .items(
      Joi.object({
        eventRegistrationFormId: Joi.number().optional(),
        response: Joi.string().optional(),
      })
    )
    .optional(),
  eventId: Joi.number().required().messages({
    'any.required': 'eventId is a required field.',
  }),
});

export const validateRegistrationRecord = (
  data: any,
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
