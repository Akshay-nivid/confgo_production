import { Order, OrderItem } from '../../models/init-models';
import { ResponseDTO, createResponse } from '../ResponseDTO';

/**
 * Represents the DTO for creating an order.
 * @interface CreateOrderDTO
 */
export interface CreateOrderDTO {
  cartId: number;
  coupon: string;
}

/**
 * Represents the response DTO for order creation.
 * @interface OrderResponseDTO
 */
export interface OrderResponseDTO {
  id: number;
  companyId: number;
  userId: number;
  subTotal?: number;
  tax?: number;
  taxInclusive?:number;
  taxPercentage?:number;
  couponDeduction?: number;
  paymentStatus?: string;
  statusId?: number;
  participantTypeId?: number;
  orderDate?: Date;
  parentEventId?: number;
  discountAmount?: number;
  finalPrice?: number;
  programTotal?: number;
  addonTotal?: number;
  orderItems: OrderItem[];
  priceTierDiscount?: number;
}

export interface OrderDataDTO {
  order: Order;
  taxPercentage:number;
}

/**
 * Represents the DTO for updating an order.
 * @interface UpdateOrderDTO
 */
export interface UpdateOrderDTO {
  status?: string;
  paymentStatus?: string;
}
/**
 * Represents the DTO for updating an order condition.
 * @interface UpdateOrderDTO
 */
export interface UpdateOrderCondition {
  statusId?: number;
  paymentStatus?: string;
}

/**
 * Creates a response DTO for order creation.
 * @param order - The order object to be included in the response.
 * @returns The response DTO.
 */
export const createOrderResponse = (
  orderData: OrderDataDTO
): ResponseDTO<OrderResponseDTO> => {
  const response: OrderResponseDTO = {
    id: orderData.order.dataValues.id,
    companyId: orderData.order.companyId,
    userId: orderData.order.userId,
    subTotal: orderData.order.subTotal,
    tax: orderData.order.tax,
    taxInclusive: orderData.order.taxInclusive,
    taxPercentage:orderData.taxPercentage,
    couponDeduction: orderData.order.couponDeduction,
    paymentStatus: orderData.order.paymentStatus,
    statusId: orderData.order.statusId,
    participantTypeId: orderData.order?.participantTypeId,
    orderDate: orderData.order.orderDate,
    parentEventId: orderData.order.parentEventId,
    discountAmount: orderData.order.discountAmount,
    finalPrice: orderData.order.finalPrice,
    programTotal: orderData.order.dataValues.programTotalAmount,
    addonTotal: orderData.order.dataValues.addonTotalAmount,
    orderItems: orderData.order.orderItems,
    priceTierDiscount: orderData.order.dataValues.priceTierDiscount,
  };

  return createResponse({
    status: 'success',
    message: 'Order created successfully',
    data: response,
  });
};

/**
 * Creates a response DTO for order details.
 * @param result - The order details to be included in the response.
 * @returns The response DTO.
 */
export const orderDetailsResponse = (
  result: OrderResponseDTO | null
): ResponseDTO<OrderResponseDTO> => {
  if (result) {
    return {
      status: 'success',
      message: 'success',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Order details not found',
    };
  }
};

export interface OrderFilterDTO {
  companyId?: number;
  userId?: number;
  eventId?: number;
  startDate?: Date;
  endDate?: Date;
  couponDeduction?: number;
  orderDate?: number;
  parentEventId?: number;
  paymentStatus?: string;
}
