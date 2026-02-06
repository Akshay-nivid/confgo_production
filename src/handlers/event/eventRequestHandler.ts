import Joi from 'joi';
import {
  AddProgramDTO,
  CreateEventDTO,
  UpdateEventDTO,
  UpdateEventIsPublishedDTO,
  UpdateEventSlugDTO,
  checkEventSlugDTO,
} from '../../dtos/event/EventDTO';
import { AppError } from '../../utils/AppError';
import {
  validateEvent,
  validateisPublished,
  validateProgram,
  validateSlug,
  validateUpdateEvent,
} from '../../validators/event/eventValidator';
import { Request } from 'express';
import { validateObjectRequest } from '../../validators/validator';
import { AddEventAddonDTO, updateAddonDTO } from '../../dtos/event/EventAddonDTO';
import { UpdateEventTemplateDTO } from '../../dtos/event/EventTemplateDTO';

/**
 * Extracts and validates event data from the request for Event creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated event data.
 * @throws AppError if validation fails.
 */
export const extractEventData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateEventDTO => {
  const {
    name,
    title,
    specialtyId,
    isAbstract,
    abstractDate,
    amount,
    description,
    startTime,
    endTime,
    eventStartTime,
    eventEndTime,
    venue,
    programs,
    addons,
    interval,
    statusId,
    templateId,
    colorId,
    registrationDeadline,
meetingUniqueId,
    url,
    eventClass,
    assetId,
    contacts,
    draftId,
  } = req.body;
  //   const { name, title, amount } = body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateEvent(
    {
      name,
      title,
      specialtyId,
      isAbstract,
      abstractDate,
      amount,
      description,
      startTime,
      endTime,
      venue,
      programs,
      addons,
      interval,
      statusId,
      templateId,
      colorId,
      registrationDeadline,
      url,
meetingUniqueId,
      eventClass,
      assetId,
      contacts,
      draftId,
      eventStartTime,
      eventEndTime
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateEventDTO;
};

export const extractUpdateEventisPublishedData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventIsPublishedDTO => {
  const { eventId } = req.body;

  const { error, value } = validateisPublished(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateEventIsPublishedDTO;
};

export const extractUpdateEventSlugData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventSlugDTO => {
  const { eventId, slugName } = req.body;

  const { error, value } = validateSlug(
    {
      eventId,
      slugName,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateEventSlugDTO;
};

/**
 * Extracts and validates event data from the request for Event creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated event data.
 * @throws AppError if validation fails.
 */
export const extractEventSlugData = (
  req: Request,
  schema: Joi.ObjectSchema
): checkEventSlugDTO => {
  const { slugName, eventId } = req.body;

  const { error, value } = validateObjectRequest(
    {
      slugName,
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as checkEventSlugDTO;
};

/**
 * Extracts and validates event data from the request for Event updation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated event data.
 * @throws AppError if validation fails.
 */
export const extractEventUpdateData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventDTO => {
  const {
    name,
    description,
    startTime,
    endTime,
    eventStartTime,
    eventEndTime,
    slugName,
    specialtyId,
    isAbstract,
    abstractDate,
    assetId,
    eventClass,
    amount,
    totalSeat,
    seatAllocated,
    participantTypeId,
    url,
    hall,
    venue,
    contacts,
    speakers,
    sponsors
  } = req.body;
  // Validate the extracted data against the provided schema
  const { error, value } = validateUpdateEvent(
    {
      name,
      description,
      eventClass,
      startTime,
      endTime,
      eventStartTime,
      eventEndTime,
      slugName,
      specialtyId,
      isAbstract,
      abstractDate,
      assetId,
      amount,
      totalSeat,
      seatAllocated,
      participantTypeId,
      url,
      hall,
      venue,
      contacts,
      speakers,
      sponsors
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateEventDTO;
};

export const extractProgramData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddProgramDTO => {
  const {
    name,
    title,
    amount,
    description,
    startTime,
    endTime,
    venueId,
    interval,
    hall,
    statusId,
    registrationDeadline,
    // parentId,
    parentEventId,
    totalSeat,
    seatAllocated,
    speakers,
    sponsors
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateProgram(
    {
      name,
      title,
      amount,
      description,
      startTime,
      endTime,
      venueId,
      hall,
      interval,
      statusId,
      registrationDeadline,
      //parentId,
      parentEventId,
      totalSeat,
      seatAllocated,
      speakers,
      sponsors
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddProgramDTO;
};

/**
 * Extracts and validates event addon data from the request body.
 *
 * @param req - Express request object containing event addon data in req.body
 * @param schema - Joi validation schema for addon data
 * @returns An object of type AddEventAddonDTO with validated data
 * @throws AppError if validation fails, providing an error message and a 400 status code
 */
export const extractEventAddonData = (
  req: Request,
  schema: Joi.ObjectSchema
): AddEventAddonDTO => {
  const { eventId, addons } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    { eventId, addons },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AddEventAddonDTO;
};

/**
 * Extracts and validates data for updating an event addon.
 * 
 * @param req - The request object containing the data to be validated.
 * @param schema - The Joi schema to validate the extracted data against.
 * @returns The validated data as an `updateAddonDTO` object.
 * @throws AppError if the validation fails with a status code of 400.
 */
export const extractUpdateEventAddonData = (
  req: Request,
  schema: Joi.ObjectSchema
): updateAddonDTO => {
  const {
    eventId,
    addonId,
    amount,
    startTime,
    endTime,
    tier,
    description,
    sponsors,
    properties,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      eventId,
      addonId,
      amount,
      startTime,
      endTime,
      tier,
      description,
      sponsors,
      properties,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as updateAddonDTO;
};

/**
 * Extracts and validates event template data from the request body.
 *
 * @param req - Express request object containing event template data in req.body
 * @param schema - Joi validation schema for template data
 * @returns An object of type UpdateEventTemplateDTO with validated data
 * @throws AppError if validation fails, providing an error message and a 400 status code
 */
export const extractEventTemplateData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateEventTemplateDTO => {
  const { templateId, colorId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      templateId,
      colorId
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateEventTemplateDTO;
};
