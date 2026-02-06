import { Request } from 'express';
import {
  validateOtp,
  validateOtpToken,
  validateStatus,
  validateToken,
  validatesToken,
} from '../../validators/tokenValidator';
import {
  CreateOtpTokenDTO,
  CreateTokenDTO,
  OtpValidationDTO,
  StatusValidationDTO,
  TokenValidationDTO,
} from '../../dtos/token/TokenDTO';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';

/**
 *  Extracts and validates tiken data from the request .
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant data.
 */
export const extractTokenValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): TokenValidationDTO => {
  const { token, userId, type } = req.body;
  const { error, value } = validatesToken({ token, userId, type }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as TokenValidationDTO;
};

export const extractOtpValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): OtpValidationDTO => {
  const { token, userId, otp, type } = req.body;
  const { error, value } = validateOtp({ token, userId, otp, type }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as OtpValidationDTO;
};

export const extractStatusData = (
  req: Request,
  schema: Joi.ObjectSchema
): StatusValidationDTO => {
  const { name } = req.body;
  const { error, value } = validateStatus({ name }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as StatusValidationDTO;
};

export const extractOtpTokenData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateOtpTokenDTO => {
  const { phone, type } = req.body;
  const { error, value } = validateOtpToken({ phone, type }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateOtpTokenDTO;
};

/**
 *  Extracts and validates create token data from the request .
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated participant data.
 */
export const extractCreateTokenValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateTokenDTO => {
  const { email, userId, type } = req.body;
  const { error, value } = validateToken({ email, userId, type }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateTokenDTO;
};
