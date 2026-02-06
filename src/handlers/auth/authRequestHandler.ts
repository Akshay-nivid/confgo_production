import { Request } from 'express';
import {
  validateAuth,
  validateSsoAuth,
  validateSsoUserAuth,
} from '../../validators/authValidator';
import { AppError } from '../../utils/AppError';
import { CreateSsoUserDTO } from '../../dtos/auth/AuthDTO';
import Joi from 'joi';

/**
 * Extracts and validates authentication data from the request.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated authentication data.
 * @throws AppError if validation fails.
 * @author : sarathavs
 */
export const extractAuthData = (
  req: Request
): { username: string; password: string } => {
  const { username, password } = req.body;

  // Validate the data
  const { error, value } = validateAuth({ username, password });
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as { username: string; password: string };
};

/**
 * Extracts and validates SSO authentication data from the request.
 *
 * This function retrieves the SSO provider and provider-specific user ID from the request body,
 * validates the input, and throws an error if the validation fails.
 * If the validation passes, it returns the extracted data.
 *
 * @param {Request} req - The HTTP request object containing the SSO auth data in the body.
 * @returns {{ provider: string; providerUserId: string }} - An object containing the provider and providerUserId.
 * @throws {AppError} - Throws an error if the validation of the provider or providerUserId fails.
 */
export const extractSsoAuthData = (
  req: Request
): { provider: string; providerUserId: string } => {
  const { provider, providerUserId } = req.body;

  // Validate the data
  const { error, value } = validateSsoAuth({
    provider,
    providerUserId: providerUserId,
  });
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as { provider: string; providerUserId: string };
};

/**
 * Extracts and validates the user data required for SSO-based account creation.
 *
 * This function retrieves the user's first name, last name, email, and phone number from the request body.
 * It then validates the extracted data against a provided Joi schema. If the validation passes,
 * it returns the validated data in the form of a `CreateSsoUserDTO`. If the validation fails,
 * it throws an `AppError` with a relevant error message.
 *
 * @param {Request} req - The HTTP request object containing the SSO user data in the body.
 * @param {Joi.ObjectSchema} schema - The Joi schema used to validate the extracted user data.
 * @returns {CreateSsoUserDTO} - The validated user data object ready for creating a new SSO user.
 * @throws {AppError} - Throws an error if the validation of user data fails.
 */
export const extractSsoUserData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateSsoUserDTO => {
  const { firstName, lastName, email, phone, ssoMetadata } = req.body;

  // Validate the data
  const { error, value } = validateSsoUserAuth(
    { firstName, lastName, email, phone, ssoMetadata },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateSsoUserDTO;
};
