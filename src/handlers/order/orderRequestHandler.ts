import Joi from 'joi';
import { CreateOrderDTO, UpdateOrderDTO } from '../../dtos/order/OrderDTO';
import { validateObjectRequest } from '../../validators/validator';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';

/**
 *  Extracts and validates create order data from the request .
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated order data.
 */
export const extractCreateOrderValidation = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateOrderDTO => {
  const { cartId, coupon } = req.body;
  const { error, value } = validateObjectRequest({ cartId, coupon }, schema);
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateOrderDTO;
};

/**
 *  Extracts and validates update order data from the request .
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated order data.
 */
export const extractUpdateOrderData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateOrderDTO => {
  const { status, paymentStatus } = req.body;
  const { error, value } = validateObjectRequest(
    { status, paymentStatus },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateOrderDTO;
};
