import Joi from 'joi';
import {
  AddEventParticipantDTO,
  UpdateEntryDTO,
} from '../../dtos/event/EventParticipantEntryDTO';
import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import {
  validateEventParticipant,
  validateUpdateEventParticipant,
} from '../../validators/event/eventParticipantEntryValidator';

export const extractEventParticipantData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddEventParticipantDTO => {
  const {
    eventId,
    totalSeat,
    seatAllocated,
    participantTypeId,
    parentEventId,
  } = req.body;

  const { error, value } = validateEventParticipant(
    {
      eventId,
      totalSeat,
      seatAllocated,
      participantTypeId,
      parentEventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as AddEventParticipantDTO;
};

export const extractUpdateEventParticipantData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEntryDTO => {
  const { totalSeat, seatAllocated } = req.body;

  const { error, value } = validateUpdateEventParticipant(
    {
      totalSeat,
      seatAllocated,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as AddEventParticipantDTO;
};
