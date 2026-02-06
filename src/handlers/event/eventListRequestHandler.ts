import { Request } from 'express';
import { ListEventDTO } from '../../dtos/event/EventDTO';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';

/**
 * Extracts and validates event data from the request for listing events.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated event data.
 * @throws AppError if validation fails.
 */
export const extractListEventData = (
  req: Request,
  schema: Joi.ObjectSchema
): ListEventDTO => {
  const { name, title, amount, startDate, endDate, city, state } = req.body;

  // Utility function to safely extract string values
  const extractString = (
    value: string | string[] | undefined
  ): string | undefined => {
    if (Array.isArray(value)) {
      return value[0]; // Get the first value if it's an array
    }
    return value; // Otherwise return the value as is
  };

  // Utility function to convert amount to a number
  const parseAmount = (
    value: string | number | boolean | null | undefined
  ): number | undefined => {
    return value != null ? Number(value) : undefined; // Convert to number or return undefined
  };

  // Ensure values are extracted correctly
  const parsedName = extractString(name);
  const parsedTitle = extractString(title);
  const parsedAmount = parseAmount(amount);
  const parsedStartDate = startDate ? new Date(startDate) : undefined;
  const parsedEndDate = endDate ? new Date(endDate) : undefined;
  const parsedCity = extractString(city);
  const parsedState = extractString(state);

  // Validate the extracted data against the provided schema
  const { error, value } = schema.validate({
    name: parsedName,
    title: parsedTitle,
    amount: parsedAmount,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    city: parsedCity,
    state: parsedState,
  });

  if (error) {
    throw new AppError(error.details[0].message, 400); // Handle validation errors
  }

  return value as ListEventDTO; // Cast the validated value to ListEventDTO
};
