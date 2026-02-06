/**
 * @author nihal
 * @description Joi schema for validating company paypal configuration data.
 */

import Joi from 'joi';

/**
 * Validator for Company Paypal Configuration Creation
 */
export const createPaypalConfigSchema = Joi.object({
  eventId: Joi.number().optional().messages({
    'number.base': 'Event id must be a number',
    'any.required': 'Event id is required',
  }),
  companyId: Joi.number().required().messages({
    'number.base': 'Company id must be a number',
    'any.required': 'Company id is required',
  }),
  clientId: Joi.string().required().messages({
    'string.empty': 'Cliend id must be a string',
    'any.required': 'Client id is required',
  }),
  currency: Joi.string().required().messages({
    'string.empty': 'Currency must be a string',
    'any.required': 'Currency is required',
  }),
});

/**
 * Validator for Update Paypal Configuration
 */
export const updatePaypalConfigSchema = Joi.object({
  eventId: Joi.number().optional(),
  companyId: Joi.number().optional(),
  clientId: Joi.string().optional(),
  currency: Joi.string().optional(),
  userId: Joi.number().optional(),
  statusId: Joi.number().optional(),
});
