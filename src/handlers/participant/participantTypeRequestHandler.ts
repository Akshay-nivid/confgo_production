import { Request } from 'express';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import {
  CreateParticipantTypeDTO,
  UpdateParticipantTypeDTO,
} from '../../dtos/participant/ParticipantTypeDTO';
import {
  validateParticipantType,
  validateUpdateParticipantType,
} from '../../validators/participant/participantTypeValidator';

/**
 * Extracts and validates participant type data from the request for Participant type creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant data.
 * @throws AppError if validation fails.
 */
export const extractParticipantTypeData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateParticipantTypeDTO => {
  const body = req.body;
  const { name, eventId, description, isContributor } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateParticipantType(
    {
      name,
      eventId,
      description,
      isContributor,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateParticipantTypeDTO;
};

export const extractUpdateParticipantTypeData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateParticipantTypeDTO => {
  const body = req.body;
  const { id, name, eventId, description } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUpdateParticipantType(
    {
      id,
      name,
      eventId,
      description,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateParticipantTypeDTO;
};
