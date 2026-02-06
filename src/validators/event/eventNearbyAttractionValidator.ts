import Joi from 'joi';

export const createEventNearbyAttractionSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
  nearbyAttractions: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          'string.empty': 'Name is required.',
          'any.required': 'Name is a required field.',
        }),
        venueId: Joi.number().optional().messages({
          'number.base': 'Venue ID must be a number.',
        }),
        assetId: Joi.string().optional().messages({
          'string.base': 'Asset ID must be a string.',
        }),
        distance: Joi.string().optional().messages({
          'string.base': 'Distance must be a string.',
        }),
        category: Joi.string().optional().messages({
          'string.base': 'Category must be a string.',
        }),
        description: Joi.string().optional().messages({
          'string.base': 'Description must be a string.',
        }),
        openingHour: Joi.string().optional().messages({
          'string.base': 'Opening hour must be a string.',
        }),
      })
    )
    .min(1)
    .messages({
      'array.base': 'Nearby attractions should be provided as an array.',
      'array.min': 'At least one nearby attraction is required.',
    }),
});

export const updateEventNearbyAttractionSchema = Joi.object({
  eventId: Joi.number().required().messages({
    'number.empty': 'Event id is required',
    'any.required': 'Event id is required',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is a required field.',
  }),
  venueId: Joi.number().optional().messages({
    'number.base': 'Venue ID must be a number.',
  }),
  assetId: Joi.string().optional().messages({
    'string.base': 'Asset ID must be a string.',
  }),
  distance: Joi.string().optional().messages({
    'string.base': 'Distance must be a string.',
  }),
  category: Joi.string().optional().messages({
    'string.base': 'Category must be a string.',
  }),
  description: Joi.string().optional().messages({
    'string.base': 'Description must be a string.',
  }),
  openingHour: Joi.string().optional().messages({
    'string.base': 'Opening hour must be a string.',
  }),
});
