import Joi from 'joi';
import {
  CreatePaypalConfigDTO,
  UpdatePaypalConfigDTO,
} from '../../dtos/companyPaypalConfiguration/CompanyPaypalConfigurationDTO';
import { AppError } from '../../utils/AppError';
import { validateObjectRequest } from '../../validators/validator';
import { Request } from 'express';

export const extractPaypalConfigurationData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreatePaypalConfigDTO => {
  const { companyId, eventId, clientId, currency } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      companyId,
      eventId,
      clientId,
      currency,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreatePaypalConfigDTO;
};

export const extractPaypalConfigUpdateData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdatePaypalConfigDTO => {
  const { companyId, eventId, clientId, currency, userId, statusId } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      companyId,
      eventId,
      clientId,
      currency,
      userId,
      statusId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreatePaypalConfigDTO;
};
