import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import {
  AddVolunteerDTO,
  AddVolunteerEventDTO,
} from '../../dtos/volunteer/AddVolunteerDTO';
import {
  validateVolunteer,
  validateVolunteerEvent,
} from '../../validators/volunteerValidator';

/**
 * Extracts and validates volunteer data from the request for Volunteer Addition.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractVolunteerData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddVolunteerDTO => {
  const { userId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateVolunteer(
    {
      userId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddVolunteerDTO;
};

/**
 * Extracts and validates volunteer data from the request for Volunteer Addition.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractVolunteerEventData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddVolunteerEventDTO => {
  const { volunteerId, eventId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateVolunteerEvent(
    {
      volunteerId,
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddVolunteerEventDTO;
};
