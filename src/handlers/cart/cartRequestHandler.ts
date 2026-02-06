import Joi from 'joi';
import { validateObjectRequest } from '../../validators/validator';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { CreateCartDTO, UpdateCartDTO } from '../../dtos/cart/CartDTO';

/**
 * Extracts and validates create cart data from the request .
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated cart data.
 */
export const extractCreateCartValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateCartDTO => {
  const cart = req.body;
  const { error, value } = validateObjectRequest(cart, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateCartDTO;
};

/**
 * Extracts and validates update cart data from the request.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated cart data.
 */
export const extractUpdateCartValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateCartDTO => {
  const cart = req.body;
  const { error, value } = validateObjectRequest(cart, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateCartDTO;
};
