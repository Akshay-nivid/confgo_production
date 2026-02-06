import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';
import { CreateAddonDTO } from '../../dtos/addon/AddonDTO';
import { validateAddon } from '../../validators/addonValidator';

export const extractAddonData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateAddonDTO => {
  const { name, description, owner, createdBy } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateAddon(
    {
      owner,
      name,
      description,
      createdBy,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreateAddonDTO;
};
