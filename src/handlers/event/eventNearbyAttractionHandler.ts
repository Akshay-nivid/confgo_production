import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { validateObjectRequest } from '../../validators/validator';
import {
  CreateEventNearbyAttractionDTO,
  UpdateEventNearbyAttractionDTO,
} from '../../dtos/event/EventNearbyAttractionDTO';

/**
 * Extracts and validates nearby attraction data from the request body.
 *
 * This function retrieves fields required to create a nearby attraction record from the
 * request body and validates them against a given Joi schema. If validation fails, an
 * error is thrown. If successful, the validated data is returned in the format of
 * `CreateEventNearbyAttractionDTO`.
 *
 * @param {Request} req - The incoming HTTP request containing the attraction data in `req.body`.
 * @param {Joi.ArraySchema} schema - Joi schema to validate the extracted data against.
 *
 * @returns {CreateEventNearbyAttractionDTO[]} - Validated data ready for creating a nearby attraction record.
 *
 * @throws {AppError} - Throws an error if validation fails, with a message and status code 400.
 */
export const extractEventNearbyAttractionData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventNearbyAttractionDTO => {
  const data = req.body;
  const { error, value } = validateObjectRequest(data, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateEventNearbyAttractionDTO;
};

/**
 * Extracts and validates the update data for a nearby attraction from the request body.
 *
 * @param req - Express request object containing the data to be validated
 * @param schema - Joi validation schema to validate the request data
 * @returns The validated data as an UpdateEventNearbyAttractionDTO object
 * @throws AppError if validation fails, with a 400 status code and error message
 */
export const extractUpdateNearbyAttractionData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventNearbyAttractionDTO => {
  const data = req.body;
  const { error, value } = validateObjectRequest(data, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateEventNearbyAttractionDTO;
};
