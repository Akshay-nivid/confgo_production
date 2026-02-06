import { Request } from 'express';
import {
  UpdateNotificationSettingDTO,
  SendContactusDTO,
  InviteEventDTO,
  SponsorshipInterestDTO,
} from '../../dtos/notification/NotificationDTO';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import {
  validateContactus,
  validateNotificationSetting,
  validateSponsorshipInterest,
} from '../../validators/notificationSettingValidator';
import { validateObjectRequest } from '../../validators/validator';

/**
 * Extracts and validates notification setting data from the request for notification settings list.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 * @author : sarathavs
 */
export const extractNotificationSettingUpdateData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateNotificationSettingDTO => {
  const obj = req.body;
  const { error, value } = validateNotificationSetting(obj, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateNotificationSettingDTO;
};

/**
 * Extracts and validates contact form data from the request body using the provided Joi schema.
 * This function ensures that the incoming data adheres to the defined validation rules,
 * and throws an error if the data is invalid.
 *
 * @param req - The request object containing the form submission data in `req.body`.
 * @param schema - The Joi schema used to validate the incoming data.
 * @returns {SendContactusDTO} - The validated and sanitized contact form data as a SendContactusDTO object.
 * @throws {AppError} - Throws an error if the validation fails, including the validation error message and a 400 status code.
 */
export const extractContactusData = (
  req: Request,
  schema: Joi.ObjectSchema
): SendContactusDTO => {
  const obj = req.body;
  const { error, value } = validateContactus(obj, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as SendContactusDTO;
};

export const extractEventInvetationData = (
  req: Request,
  schema: Joi.ObjectSchema
): InviteEventDTO => {
  const obj = req.body;
  const { error, value } = validateObjectRequest(obj, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as InviteEventDTO;
};

/**
 * Extracts and validates sponsorship interest data from the request body.
 * 
 * @param req - Express request object containing the body to validate
 * @param schema - Joi schema used for validation
 * @returns Validated sponsorship interest data as SponsorshipInterestDTO
 */
export const extractSponsorshipInterestData = (
  req: Request,
  schema: Joi.ObjectSchema
): SponsorshipInterestDTO => {
  const obj = req.body;
  const { error, value } = validateSponsorshipInterest(obj, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as SponsorshipInterestDTO;
};
