/**
 * @author saneeshiv
 * @description Joi schema for validating cart data.
 */
import Joi from 'joi';

/**
 * Joi validation schema for creating a cart.
 * Validates the `eventId`, `programIds`, and optional `addons` fields.
 */
export const createCartSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.base': 'Event id must be a number',
    'any.required': 'Event id is required',
  }),
  programIds: Joi.array().items(Joi.number()).min(1).optional().messages({
    'array.base': 'Program id must be an array.',
    'array.includes': 'Each Program ID must be a number.',
    'any.required': 'Program ID is a required field.',
    'array.min': 'Program id array cannot be empty.',
  }),
  participantTypeId: Joi.number().optional(),
  addons: Joi.array()
    .items(
      Joi.object({
        addonId: Joi.number().required().messages({
          'number.base': 'Addon Id is required',
          'any.required': 'Addon Id is required',
        }),
        propertyIds: Joi.array()
          .items(Joi.number())
          .min(1)
          .optional()
          .messages({
            'array.base': 'Property Ids must be an array.',
            'array.min': 'Property Ids array cannot be empty if provided.',
          }),
      })
    )
    .min(1)
    .optional()
    .messages({
      'array.base': 'Addons must be an array.',
      'array.min': 'Addons array cannot be empty if provided.',
    }),
});

/**
 * Joi validation schema for updating the cart.
 * Validates the `eventId`, `programIds`, and optional `addonIds` fields.
 */
export const updateCartSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id must be a number',
    'any.required': 'Event id is required',
  }),
  programIds: Joi.array().items(Joi.number()).required().messages({
    'array.base': 'Program id must be an array.',
    'array.includes': 'Each Program ID must be a number.',
    'any.required': 'Program ID is a required field.',
  }),
  addonIds: Joi.array().items(Joi.number()).optional(),
});
