import { Request } from 'express';
import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import {
  AssignReviewerDTO,
  CreateUserAbstractDTO,
  UpdateUserAbstractDTO,
} from '../../dtos/userAbstract/userAbstractDTO';
import { validateUserAbstract } from '../../validators/userAbstractValidator';

/**
 * Extracts and validates user abstract data from the request for user abstract updation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractUpdateUserAbstractData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateUserAbstractDTO => {
  const { reviewerId, comment, rating, statusId, assetId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUserAbstract(
    {
      reviewerId,
      comment,
      rating,
      statusId,
      assetId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateUserAbstractDTO;
};

/**
 * Extracts and validates user abstract data from the request for user abstract creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractCreateUserAbstractData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateUserAbstractDTO => {
  const { eventId, assetId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUserAbstract(
    {
      eventId,
      assetId
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateUserAbstractDTO;
};

/**
 * Extracts and validates assign data from the request to assign reviewer for an array of abstracts.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractAssignReviewerData = (
  req: Request,
  schema: Joi.ObjectSchema
): AssignReviewerDTO => {
  const {abstracts,reviewerId} = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateUserAbstract(
    {
      reviewerId,
      abstracts
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as AssignReviewerDTO;
};