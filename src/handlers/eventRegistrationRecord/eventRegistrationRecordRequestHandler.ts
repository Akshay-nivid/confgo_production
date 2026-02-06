import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';
import { validateRegistrationRecord } from '../../validators/eventRegistrationRecordValidator';
import {
  CreateEventRegistrationRecordDTO,
  UpdateEventRegistrationRecordDTO,
  UpdateRegistrationRecordParticipantDTO,
} from '../../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';
import {
  validateRecord,
  validateRegistrationRecordParticipant,
} from '../../validators/event/eventRegistrationRecordValidator';

export const extractRegistrationRecordData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventRegistrationRecordDTO => {
  const { data, eventId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateRegistrationRecord(
    {
      eventId,
      data,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateEventRegistrationRecordDTO;
};

export const extractUpdateRecordData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventRegistrationRecordDTO => {
  const { response } = req.body;
  const { error, value } = validateRecord(
    {
      response,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateEventRegistrationRecordDTO;
};

export const extractUpdateParticipantRecordData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateRegistrationRecordParticipantDTO => {
  const { eventId } = req.body;
  const { error, value } = validateRegistrationRecordParticipant(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateRegistrationRecordParticipantDTO;
};
