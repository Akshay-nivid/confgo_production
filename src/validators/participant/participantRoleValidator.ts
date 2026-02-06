import Joi from 'joi';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/AppError';
import { CreateParticipantRoleDTO } from '../../dtos/participant/ParticipantRoleDTO';

/**
 * participant role Validations
 * @description Joi schema for validating participant role data.
 */
export const createParticipantRoleSchema = Joi.object({
  roleName: Joi.string().required().messages({
    'string.empty': 'Role Name is required.',
    'any.required': 'Role name is a required field.',
  }),
  owner: Joi.string().required().messages({
    'string.empty': 'owner is required.',
    'any.required': 'owner is a required field.',
  }),
  description: Joi.string(),
  companyId: Joi.number(),
});

/**
 * @function validateParticipantRole
 * @description Validates Participant Role data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing any validation errors and the validated data.
 */
export const validateParticipantRole = (
  data: CreateParticipantRoleDTO,
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
