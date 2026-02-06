import { ResponseDTO } from '../ResponseDTO';
import { Payment } from '../../models/init-models';
/**
 * DTO for creating a payment record.
 * This interface defines the structure of the data required to create
 * a new payment entry, typically for events or orders.
 */
export interface CreatePaymentDTO {
  paymentMethodId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  paymentReferenceNumber: string;
  metadata?: string;
  amount: number;
  eventId: number;
  orderId?: number;
}

/**
 * DTO for updating a payment record.
 * This interface defines the structure of the data required to update
 * a payment entry, typically for events or orders.
 */
export interface UpdatePaymentDTO {
  paymentMethodId?: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  paymentReferenceNumber: string;
  metadata?: string;
  amount: number;
  orderId?: number;
}

/**
 * DTO for the response returned after creating or retrieving a payment record.
 * This interface defines the structure of the payment data provided in a response,
 * typically after a successful payment process or when querying payment details.
 */
export interface PaymentResponseDTO {
  id?: number;
  paymentMethodId: number;
  state: string;
  errorMessage?: string;
  transactionId?: string;
  paymentReferenceNumber?: string;
  metadata?: string;
  amount: number;
  orderId?: number;
}

export interface GetAllPaymentListDTO {
  id?: number;
  userId?: number;
  companyId?: number;
  eventId?: number;
  paymentMethodId?: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Constructs a standardized response for a payment.
 * This function takes a `Payment` object and maps its properties to the
 * `PaymentResponseDTO` format, which is then wrapped in a `ResponseDTO` object.
 *
 * @param payment - The `Payment` object containing payment details.
 * @returns A `ResponseDTO` object with the status, message, and payment data in `PaymentResponseDTO` format.
 */
export const createPaymentResponse = (
  payment: Payment
): ResponseDTO<PaymentResponseDTO> => {
  const response: PaymentResponseDTO = {
    id: payment.id,
    paymentMethodId: payment.paymentMethodId,
    state: payment.state,
    errorMessage: payment.errorMessage,
    transactionId: payment.transactionId,
    paymentReferenceNumber: payment.paymentReferenceNumber,
    metadata: payment.metadata,
    amount: payment.amount,
    orderId: payment.orderId,
  };

  return {
    status: 'success',
    message: 'Payment created successfully',
    data: response,
  };
};

export const updatePaymentResponse = (
  payment: Payment
): ResponseDTO<PaymentResponseDTO> => {
  const response: PaymentResponseDTO = {
    id: payment.id,
    paymentMethodId: payment.paymentMethodId,
    state: payment.state,
    errorMessage: payment.errorMessage,
    transactionId: payment.transactionId,
    paymentReferenceNumber: payment.paymentReferenceNumber,
    metadata: payment.metadata,
    amount: payment.amount,
    orderId: payment.orderId,
  };

  return {
    status: 'success',
    message: 'Payment updated successfully',
    data: response,
  };
};
