import { Request } from 'express';
import { AppError } from '../../utils/AppError';
import Joi from 'joi';
import {
  CreatePaymentDTO,
  UpdatePaymentDTO,
} from '../../dtos/payment/paymentDTO';
import { validateObjectRequest } from '../../validators/validator';
import { CreatePaymentMethodDTO } from '../../dtos/payment/PaymentMethodDTO';
import {
  CreateSubscriptionPaymentDTO,
  UpdateSubscriptionPaymentDTO,
} from '../../dtos/payment/PaymentSubscriptionDTO';

export const extractCreatePaymentMethodData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreatePaymentMethodDTO => {
  const {
    code,
    handler,
    enabled,
    name,
    description,
    logoUrl,
    minAmount,
    maxAmount,
  } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      code,
      handler,
      enabled,
      name,
      description,
      logoUrl,
      minAmount,
      maxAmount,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreatePaymentMethodDTO;
};

export const extractCreatePaymentData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreatePaymentDTO => {
  const {
    paymentMethodId,
    state,
    errorMessage,
    transactionId,
    metadata,
    paymentReferenceNumber,
    amount,
    eventId,
    orderId,
  } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      paymentMethodId,
      state,
      errorMessage,
      transactionId,
      metadata,
      paymentReferenceNumber,
      amount,
      eventId,
      orderId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreatePaymentDTO;
};

/**
 * Request handler for update payment
 * @param req
 * @param schema
 * @returns
 */
export const extractUpdatePaymentData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdatePaymentDTO => {
  const {
    paymentMethodId,
    state,
    errorMessage,
    transactionId,
    metadata,
    orderId,
    paymentReferenceNumber,
    amount,
  } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      paymentMethodId,
      state,
      errorMessage,
      transactionId,
      metadata,
      orderId,
      paymentReferenceNumber,
      amount,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdatePaymentDTO;
};

/**
 * Extracts and validates data from the request body to create a subscription payment record.
 * This function pulls out specific properties from the request, validates them using a schema,
 * and then returns the validated data as a `CreateSubscriptionPaymentDTO` object.
 *
 * @param {Request} req - The request object containing the data to be extracted.
 * @param {Joi.ObjectSchema} schema - The Joi schema used to validate the extracted data.
 * @returns {CreateSubscriptionPaymentDTO} - The validated data needed to create a subscription payment.
 * @throws {AppError} - Throws an error if validation fails, with the first error message and a 400 status code.
 */
export const extractCreateSubscriptionPaymentData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateSubscriptionPaymentDTO => {
  const {
    paymentMethodId,
    state,
    errorMessage,
    transactionId,
    metadata,
    paymentReferenceNumber,
    amount,
    finalAmount,
    discountAmount,
    subscriptionId,
    userId,
    orderId,
  } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      paymentMethodId,
      state,
      errorMessage,
      transactionId,
      metadata,
      amount,
      paymentReferenceNumber,
      finalAmount,
      discountAmount,
      subscriptionId,
      userId,
      orderId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as CreateSubscriptionPaymentDTO;
};

export const extractUpdateSubscriptionPaymentData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateSubscriptionPaymentDTO => {
  const {
    paymentMethodId,
    state,
    errorMessage,
    transactionId,
    metadata,
    paymentReferenceNumber,
    amount,
    finalAmount,
    discountAmount,
  } = req.body;

  // Validation the extract data against the provided schema
  const { error, value } = validateObjectRequest(
    {
      paymentMethodId,
      state,
      errorMessage,
      transactionId,
      metadata,
      amount,
      paymentReferenceNumber,
      finalAmount,
      discountAmount,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }
  return value as UpdateSubscriptionPaymentDTO;
};
