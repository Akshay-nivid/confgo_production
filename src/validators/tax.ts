import Joi from 'joi';
/**
 * @description Joi schema for validating tax data.
 */
export const createTaxSchema = Joi.object({
  taxName: Joi.string().required().messages({
    'string.empty': 'Name is a required field.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().optional(),
  taxPercentage: Joi.number().optional().messages({
    'string.empty': 'Tax Percentage is a required field.',
    'any.required': 'Tax Percentage is a required field.',
  }),
  taxInclusive: Joi.boolean().optional().messages({
    'string.empty': 'Tax inclusive is a required field',
  }),
  companyId: Joi.number().optional(),
  createdBy: Joi.number().optional()
});


export const updateTaxSchema = Joi.object({
  taxName: Joi.string().optional().messages({
    'string.empty': 'Name is a required field.',
    'any.required': 'Name is a required field.',
  }),
  description: Joi.string().optional().messages({
    'string.empty': 'Description is required.',
    'any.required': 'Description is a required field.',
  }),
  taxPercentage: Joi.number().optional().messages({
    'string.empty': 'Tax Percentage is a required field.',
    'any.required': 'Tax Percentage is a required field.',
  }),
  taxInclusive: Joi.boolean().optional().messages({
    'string.empty': 'Tax inclusive is a required field',
  }),
  companyId: Joi.number().optional(),
  createdBy: Joi.number().optional()
});
