import Joi from 'joi';
import { CreateSponsorDTO } from '../dtos/sponsor/SponsorDTO';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

/**
 * @description Joi schema for validating sponsor data.
 */
export const createSponsorSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is a required field.',
    'any.required': 'Name is a required field.',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is a required field.',
  }),
  phone: Joi.string().optional().messages({
    'string.empty': 'phone is a required field.',
    'any.required': 'phone is a required field.',
  }),
  website: Joi.string().uri().optional().messages({
    'string.uri': 'Website must be a valid URL.',
  }),
  logoAssetId: Joi.string().optional(),
  bannerImgAssetId: Joi.string().optional(),
  companyId: Joi.number().allow(null).optional(),
  assetId: Joi.string().optional(),
});

/**
 * @description Joi schema for validating sponsor assign data.
 */
export const assignSponsorSchema = Joi.object({
  sponsors: Joi.array()
    .items(
      Joi.object({
        sponsorId: Joi.number().required().messages({
          'number.base': 'Sponsor ID must be a number.',
          'any.required': 'Sponsor ID is a required field.',
        }),
        parentEventId: Joi.number().required().messages({
          'number.base': 'Parent Event ID must be a number.',
          'any.required': 'Parent Event ID is a required field.',
        }),
        eventId: Joi.number().optional(),
        reservedSeats: Joi.number().optional(),
        eventAddonPropertyId: Joi.number().optional(),
        eventAddonId: Joi.number().optional(),
        sponsorTypeId: Joi.number().required().messages({
          'number.base': 'Choose type of sponsor.',
          'any.required': 'Sponsor Type is a required field.',
        }),
        createdBy: Joi.number().optional()
      })
    )
    .required()
    .messages({
      'array.base': 'Sponsors must be an array.',
      'any.required': 'Sponsors array is required.',
    }),
});

/**
 * @function validateSponsor
 * @description Validates sponsor data against a provided Joi schema.
 * @param data - The data to validate.
 * @param schema - The Joi schema to validate against.
 * @param options - Optional validation options.
 * @returns An object containing validation errors (if any) and the validated data.
 */
export const validateSponsor = (
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

/**
 * @description Joi schema for validating sponsor data.
 */
export const updateSponsorSchema = Joi.object({
  name: Joi.string().optional(),
  website: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
  companyId: Joi.number().optional(),
  logoAssetId: Joi.string().optional(),
  bannerImgAssetId: Joi.string().optional(),
});
