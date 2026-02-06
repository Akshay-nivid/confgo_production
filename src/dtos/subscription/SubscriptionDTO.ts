/**
 * @author saneeshiv
 */

import { Subscription } from '../../models/Subscription';
import { ResponseDTO } from '../ResponseDTO';

/**
 * DTO for creating a new subscription.
 */
export interface CreateSubscriptionDTO {
  userId: number;
  validityDay?: number;
  planId: number;
  isTrial?: number;
  endDate?: Date;
  startDate?: Date;
  statusId: number;
  discountCouponId?: number;
  extendedPlanId?: number;
  extendedPlanStart?: Date;
  paymentId?: number;
  createdBy: number;
}

/**
 * DTO for request: creating a new subscription through api.
 */
export interface CreateSubscriptionRequestDTO {
  planId: number;
  discountCouponId?: number;
  extendedPlanId?: number;
  extendedPlanStart?: Date;
  paymentId?: number;
}

/**
 * DTO for updating an existing subscription.
 */
export interface UpdateSubscriptionDTO {
  validityDay?: number;
  planId?: number;
  isTrial?: number;
  endDate?: Date;
  startDate?: Date;
  statusId?: number;
  discountCouponId?: number;
  extendedPlanId?: number;
  extendedPlanStart?: Date;
  paymentId?: number;
  modifiedBy: number;
}

/**
 * Constructs a response object indicating the user's subscription status and details.
 *
 * @param subscriptionStatus - Boolean indicating whether the user currently has an active subscription.
 * @param current - Array of active Subscription objects (if any), representing the user's current subscriptions.
 * @param previous - The last inactive Subscription object (if any), representing the user's most recent inactive subscription.
 *
 * @returns A ResponseDTO containing the subscription status and relevant subscription details.
 */
export const checkSubscriptionResponse = (
  subscriptionStatus: boolean,
  current?: Subscription[],
  previous?: Subscription
): ResponseDTO<CheckSubscriptionResponseDTO> => {
  const response: CheckSubscriptionResponseDTO = {
    subscriptionStatus: subscriptionStatus,
    current: current,
    previous: previous,
  };
  return {
    status: 'success',
    data: response,
  };
};

export interface CheckSubscriptionResponseDTO {
  subscriptionStatus: boolean;
  current?: Subscription[];
  previous?: Subscription;
}

/**
 * @interface SubscriptionResponseDTO
 * @description Interface for formatting subscription data in responses.
 */
export interface SubscriptionResponseDTO {
  id?: number;
  userId?: number;
  planId?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy?: number;
  modifiedBy?: number;
  createdOn?: Date;
  modifiedOn?: Date;
}

/**
 * @function createSubscriptionPaymentResponse
 * @description Formats the response data for subscription creation.
 * @param subscription - The subscription data to format.
 * @returns The formatted response data.
 */
export const createSubscriptionPaymentResponse = (
  subscription: Subscription
): ResponseDTO<SubscriptionResponseDTO> => {
  const response: SubscriptionResponseDTO = {
    id: subscription.id,
    userId: subscription.userId,
    planId: subscription.planId,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    createdBy: subscription.createdBy || 0,
    createdOn: subscription.createdOn || new Date(),
    modifiedBy: subscription.modifiedBy || 0,
    modifiedOn: subscription.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Subscription created successfully',
    data: response,
  };
};
