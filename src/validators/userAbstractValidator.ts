import Joi from 'joi';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

/**
 * Joi schema for validating user abstract creation.
 */
export const createUserAbstractSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
  assetId: Joi.string().required().messages({
    'string.empty': 'Asset id is required',
    'any.required': 'Asset id is required',
  }),
});

/**
 * Joi schema for validating user abstract updation.
 */
export const updateUserAbstractSchema = Joi.object({
  reviewerId: Joi.number().optional().allow(null),
  comment: Joi.string().optional(),
  assetId: Joi.string().optional(),
  rating: Joi.number().optional().messages({
    'number.base': 'rating must be a number.',
  }),
  statusId: Joi.number().optional().messages({
    'number.base': 'Status id must be a number.',
  }),
});

export const assignReviewerSchema = Joi.object({
  abstracts: Joi.array().items(Joi.number().integer().positive().required()).min(1).required()
    .messages({
      'array.base': 'Abstracts must be an array.',
      'array.min': 'Abstracts array must have at least one item.',
      'number.base': 'Each abstract ID must be a number.',
      'number.integer': 'Each abstract ID must be an integer.',
      'number.positive': 'Each abstract ID must be a positive number.',
      'any.required': 'Abstracts array is required.',
    }),
  reviewerId: Joi.number().integer().positive().required().messages({
    'number.base': 'Reviewer ID must be a number.',
    'number.integer': 'Reviewer ID must be an integer.',
    'number.positive': 'Reviewer ID must be a positive number.',
    'any.required': 'Reviewer ID is required.',
  }),
});
export const validateUserAbstract = (
  data: any,
  schema: Joi.ObjectSchema,
  options: Joi.ValidationOptions = {}
) => {
  try {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Continue validating all fields even if one fails
      ...options, // Spread the options provided when calling validateCompany
    });

    if (error) {
      // Extract all custom error messages from the validation error details
      const messages = error.details.map((detail) => detail.message);
      return { error: messages };
    }

    return { value };
  } catch (err) {
    Logger.error('Error validateUserAbstract:', err);
    throw new AppError('An unexpected error occurred during validation', 500);
  }
};
