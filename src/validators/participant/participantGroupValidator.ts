import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import { CreateParticipantGroupDTO } from '../../dtos/participant/ParticipantGroupDTO';

/**
 * participant group Validations
 * @description Joi schema for validating participant group data.
 */
export const createParticipantGroupSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name is required.',
    'any.required': 'name is a required field.',
  }),
  participantId: Joi.number().required().messages({
    'number.empty': 'participant id is required.',
    'any.required': 'participant id is a required field.',
  }),
  tag: Joi.string(),
});

/**
 * @function validateParticipantGroup
 * @description Validates Participant Group data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateParticipantGroup = (
  data: CreateParticipantGroupDTO,
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
