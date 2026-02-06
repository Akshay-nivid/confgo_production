import Joi from 'joi';
import {
  CreateEventPriceTierDTO,
  UpdatePriceTierDTO,
} from '../../dtos/event/EventPriceTierDTO';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import {
  validateEventPriceTier,
  validateUpdatePriceTier,
} from '../../validators/event/eventPriceTierValidator';

export const extractPriceTierData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventPriceTierDTO => {
  const { eventId, priceTiers } = req.body;

  const { error, value } = validateEventPriceTier(
    {
      eventId,
      priceTiers,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreateEventPriceTierDTO;
};

export const extractPriceTierUpdateData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdatePriceTierDTO => {
  const { name, description, participantTypeId, percentage, endDate } =
    req.body;

  const { error, value } = validateUpdatePriceTier(
    {
      name,
      description,
      participantTypeId,
      percentage,
      endDate,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdatePriceTierDTO;
};
