import Joi from 'joi';

export const createOrderSchema = Joi.object({
  coupon: Joi.string().optional(),
  cartId: Joi.number().required().messages({
    'number.empty': 'Cart Id is required',
    'any.required': 'Cart Id is required',
  }),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().optional(),
  paymentStatus: Joi.string().optional(),
});
