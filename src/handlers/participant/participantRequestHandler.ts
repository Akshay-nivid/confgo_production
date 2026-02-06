import { Request } from 'express';
import {
  CreateParticipantRequestDTO,
  ExistingParticipantCheckDTO,
  QrParticipantRequestDTO,
} from '../../dtos/participant/ParticipantDTO';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { validateParticipant } from '../../validators/participant/participantValidator';
import { validateObjectRequest } from '../../validators/validator';

/**
 * Extracts and validates participant data from the request for Participant creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant data.
 * @throws AppError if validation fails.
 */
export const extractParticipantData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateParticipantRequestDTO => {
  const body = req.body;
  const { registrationType, orderId } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateParticipant(
    {
      registrationType,
      orderId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateParticipantRequestDTO;
};

/**
 * Extracts and validate data for checking existing participant or not.
 * @param req
 * @param schema
 * @returns
 */
export const extractParticipantCheckData = (
  req: Request,
  schema: Joi.ObjectSchema
): ExistingParticipantCheckDTO => {
  const body = req.body;
  const { eventId } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as ExistingParticipantCheckDTO;
};

/**
 * This function extracts the QR code and event ID from the request body
 * and validates them against the provided schema.
 * @param req - The incoming HTTP request.
 * @param schema - The Joi schema to validate the data.
 * @returns The validated data as a QrParticipantRequestDTO.
 * @throws AppError if validation fails.
 */
export const extractQrParticipantData = (
  req: Request,
  schema: Joi.ObjectSchema
): QrParticipantRequestDTO => {
  const body = req.body;
  const { qrCode, participantId } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      qrCode,
      participantId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as QrParticipantRequestDTO;
};
