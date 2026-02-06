import { ResponseDTO } from '../ResponseDTO';
import { SubscriptionPayment } from '../../models/init-models';

/**
 * DTO for creating a subscription payment record.
 * This interface defines the structure of the data required to create
 * a new subscription payment entry.
 */
export interface CreateSubscriptionPaymentDTO {
  paymentMethodId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount: number;
  paymentReferenceNumber?: string;
  discountAmount?: number;
  finalAmount: number;
  subscriptionId: number;
  userId: number;
  orderId?: number;
}

/**
 * DTO for updating a subscription payment record.
 * This interface defines the structure of the data required to update
 * a subscription payment entry.
 */
export interface UpdateSubscriptionPaymentDTO {
  paymentMethodId?: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  amount?: number;
  paymentReferenceNumber?: string;
  discountAmount?: number;
  finalAmount?: number;
  subscriptionId?: number;
  userId?: number;
  orderId?: number;
}

/**
 * DTO for the response containing subscription payment details.
 * This interface defines the structure of the data returned after a subscription payment
 * is created or queried, including details about the transaction, amount, and related entities.
 */
export interface SubscriptionPaymentResponseDTO {
  id?: number;
  paymentMethodId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  metadata?: string;
  paymentReferenceNumber?: string;
  amount: number;
  orderId?: number;
  finalAmount: number;
  discountAmount?: number;
  subscriptionId: number;
  userId: number;
}

/**
 * Constructs a standardized response for a subscription payment.
 * This function takes a `SubscriptionPayment` object and maps its properties
 * to a `SubscriptionPaymentResponseDTO` format, which is then wrapped in a `ResponseDTO` object.
 *
 * @param payment - The `SubscriptionPayment` object containing payment details.
 * @returns A `ResponseDTO` object with the status, message, and payment data in `SubscriptionPaymentResponseDTO` format.
 */
export const createSubscriptionPaymentResponse = (
  payment: SubscriptionPayment
): ResponseDTO<SubscriptionPaymentResponseDTO> => {
  const response: SubscriptionPaymentResponseDTO = {
    id: payment.id,
    paymentMethodId: payment.paymentMethodId,
    state: payment.state,
    errorMessage: payment.errorMessage,
    transactionId: payment.transactionId,
    metadata: payment.metadata,
    paymentReferenceNumber: payment.paymentReferenceNumber,
    amount: payment.amount,
    orderId: payment.orderId,
    finalAmount: payment.finalAmount,
    discountAmount: payment.discountAmount,
    subscriptionId: payment.subscriptionId,
    userId: payment.userId,
  };

  return {
    status: 'success',
    message: 'Subscription payment created successfully',
    data: response,
  };
};

export const updateSubscriptionPaymentResponse = (
  payment: SubscriptionPayment
): ResponseDTO<SubscriptionPaymentResponseDTO> => {
  const response: SubscriptionPaymentResponseDTO = {
    id: payment.id,
    paymentMethodId: payment.paymentMethodId,
    state: payment.state,
    errorMessage: payment.errorMessage,
    transactionId: payment.transactionId,
    metadata: payment.metadata,
    paymentReferenceNumber: payment.paymentReferenceNumber,
    amount: payment.amount,
    orderId: payment.orderId,
    finalAmount: payment.finalAmount,
    discountAmount: payment.discountAmount,
    subscriptionId: payment.subscriptionId,
    userId: payment.userId,
  };

  return {
    status: 'success',
    message: 'Subscription payment updated successfully',
    data: response,
  };
};

/**
 * DTO for retrieving a list of payment subscriptions with various filter options.
 */
export interface PaymentSubscriptionListDTO {
  state?: string;
  subscriptionId?: string;
  transactionId?: string;
  paymentMethodId?: number;
  startDate?: Date;
  endDate?: Date;
}
