import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { CompanyRevenueCountDTO, dashboardCountRequestDTO } from '../../dtos/dashBoard/DashBoardDTO';
import { validateObjectRequest } from '../../validators/validator';

/**
 * Extracts and validates  data from the request for count fetching.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated attendee data.
 * @throws AppError if validation fails.
 */
export const extractRequestData = (
  req: Request,
  schema: Joi.ObjectSchema
): dashboardCountRequestDTO => {
  const { eventId } = req.body;

  // Validate the extracted data against the provided schema
  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as dashboardCountRequestDTO;
};

/**
 * Extracts and validates revenue count data from the request body.
 * 
 * @param req - Express request object containing startDate, endDate, and eventId.
 * @param schema - Joi validation schema to validate the request data.
 * @returns A validated CompanyRevenueCountDTO object.
 * @throws An AppError if validation fails.
 */
export const extractRevenueCountData = (
  req: Request,
  schema: Joi.ObjectSchema
): CompanyRevenueCountDTO => {
  const { startDate, endDate, eventId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      startDate,
      endDate,
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CompanyRevenueCountDTO;
};
