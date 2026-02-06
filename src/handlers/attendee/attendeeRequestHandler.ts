import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { AddAttendeeDTO } from '../../dtos/attendee/AddAttendeeDTO';
import { validateAttendee } from '../../validators/attendeeValidator';

/**
 * Extracts and validates attendee data from the request for Attednee Addition.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractAttendeeData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddAttendeeDTO => {
  const { eventId, qrCode, addons, participantId } = req.body;
  //   const { name, title, amount } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateAttendee(
    {
      eventId,
      qrCode,
      addons,
      participantId
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddAttendeeDTO;
};
