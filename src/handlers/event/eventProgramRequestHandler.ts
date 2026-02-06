import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import {
  CreateEventSpeakerDTO,
  CreateSpeakerBioDTO,
  EventIdDTO,
  StatusValidationDTO,
  UpdateEventProgramDTO,
  UpdateSpeakerBioDTO,
} from '../../dtos/event/EventProgramDTO';
import {
  validateEventProgram,
  validateSpeakerBio,
  validateStatus,
  validateUpdateEventProgram,
} from '../../validators/eventProgramValidator';
import { validateObjectRequest } from '../../validators/validator';

export const extractEventProgramData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventSpeakerDTO => {
  const {
    userId,
    eventId,
    statusId,
    parentEventId
  } = req.body;

  const { error, value } = validateEventProgram(
    {
      userId,
      eventId,
      statusId,
      parentEventId
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreateEventSpeakerDTO;
};

export const extractStatusData = (
  req: Request,
  schema: Joi.ObjectSchema
): StatusValidationDTO => {
  const { statusName } = req.body;
  const { error, value } = validateStatus({ statusName }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as StatusValidationDTO;
};

/**
 * Extracts and validates event program data from the request body based on the provided schema.
 * @param req - The request object containing the data to be extracted.
 * @param schema - The schema to validate the extracted data against.
 * @returns - The validated event program data.
 */
export const extractUpdateEventProgramData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventProgramDTO => {
  const {
    eventId,
    speakerFileId,
    statusId,
  } = req.body;

  const { error, value } = validateUpdateEventProgram(
    {
      eventId,
      speakerFileId,
      statusId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateEventProgramDTO;
};
//Extract Event Speaker Bio Details
export const extractEventSpeakerBioData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateSpeakerBioDTO => {
  const {
    eventSpeakerId,
    speakerFileId,
    description,
    isModerator,
    designation,
    startTime,
    endTime,
  } = req.body;

  const { error, value } = validateSpeakerBio(
    {
      eventSpeakerId,
      speakerFileId,
      description,
      startTime,
      endTime,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreateSpeakerBioDTO;
};


/**
 * request handler for fetching event id
 * @returns 
 */
export const extractEventId = (
  req: Request,
  schema: Joi.ObjectSchema
): EventIdDTO => {
  const { eventId } = req.body;

  const { error, value } = validateUpdateEventProgram(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as EventIdDTO;
};

/**
 * Extracts and validates the data for updating the event speaker's bio.
 * 
 * @param req - The HTTP request object containing the body data.
 * @param schema - The Joi schema used for validating the data.
 * @returns The validated and parsed data as an UpdateSpeakerBioDTO.
 */
export const extractUpdateEventSpeakerBioData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateSpeakerBioDTO => {
  const {
    eventSpeakerId,
    fileId,
    description,
    startTime,
    endTime,
  } = req.body;

  const { error, value } = validateObjectRequest(
    {
      eventSpeakerId,
      fileId,
      description,
      startTime,
      endTime,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateSpeakerBioDTO;
};