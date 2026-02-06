import { Request } from 'express';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { CreateParticipantRoleDTO } from '../../dtos/participant/ParticipantRoleDTO';
import { validateParticipantRole } from '../../validators/participant/participantRoleValidator';

/**
 * Extracts and validates participant role data from the request for Participant role creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant role data.
 * @throws AppError if validation fails.
 */
export const extractParticipantRoleData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateParticipantRoleDTO => {
  const body = req.body;
  const { roleName, owner, description, companyId } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateParticipantRole(
    {
      roleName,
      owner,
      description,
      companyId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateParticipantRoleDTO;
};
