import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { validateObjectRequest } from '../../validators/validator';
import { CreateEventRegistrationFormsRequestDTO } from '../../dtos/event/EventRegistrationFormDTO';

/**
 * Extracts and validates an array of event registration form data from the request body.
 *
 * @param {Request} req - The Express request object containing the body data.
 * @param {Joi.ObjectSchema} schema - The Joi array schema used for validating the data.
 * @returns {CreateEventRegistrationFormsRequestDTO} - Returns an array of validated event registration form data.
 * @throws {AppError} - Throws an AppError if validation fails or if any unexpected error occurs.
 */
export const extractEventRegistrationFormData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventRegistrationFormsRequestDTO => {
  // const { name, eventId, participantTypeId, metadata } = req.body;
  const data = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(data, schema);

  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateEventRegistrationFormsRequestDTO;
};
