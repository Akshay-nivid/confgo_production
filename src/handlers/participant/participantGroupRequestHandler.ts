import { Request } from 'express';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { CreateParticipantGroupDTO } from '../../dtos/participant/ParticipantGroupDTO';
import { validateParticipantGroup } from '../../validators/participant/participantGroupValidator';

/**
 * Extracts and validates participant group data from the request for Participant group creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant group data.
 * @throws AppError if validation fails.
 */
export const extractParticipantGroupData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateParticipantGroupDTO => {
  const body = req.body;
  const { name, participantId } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateParticipantGroup(
    {
      name,
      participantId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateParticipantGroupDTO;
};
