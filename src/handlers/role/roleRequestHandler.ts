import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { AddRoleDTO } from '../../dtos/role/AddRoleDTO';
import { validateRole } from '../../validators/roleValidator';


/**
 * Extracts and validates role data from the request for role Addition.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractRoleData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddRoleDTO => {
  const { roleName,description } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateRole(
    {
      roleName,
      description
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddRoleDTO;
};

