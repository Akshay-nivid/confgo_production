import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';
import { AddonValidateDTO } from '../dtos/addon/AddonDTO';

export const createAddonSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),

  description: Joi.string().optional().messages({
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is required',
  }),
  owner: Joi.string().optional().messages({
    'string.empty': 'owner cannot be empty',
  }),

  createdBy: Joi.number().optional().messages({
    'number.empty': 'owner cannot be empty',
  }),
});

export const validateAddon = (
  data: AddonValidateDTO,
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
