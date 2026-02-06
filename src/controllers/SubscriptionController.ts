import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/SubscriptionService';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import {
  checkSubscriptionResponse,
  createSubscriptionPaymentResponse,
} from '../dtos/subscription/SubscriptionDTO';
import { Transaction } from 'sequelize';
import { PlanService } from '../services/PlanService';
import { sequelize } from './../models/index';
import { calculateEndDate } from '../utils/date_util';
import { extractCreateSubscriptionData } from '../handlers/subscription/subscriptionRequestHandler';
import { createSubscriptionSchema } from '../validators/subscriptionValidator';

/**
 * @author saneeshiv
 * @class SubscriptionController
 * @description
 */

export class SubscriptionController {
  private subscriptionService = new SubscriptionService();
  private planService = new PlanService();

  /**
   * Validates the user's subscription status and retrieves their active and most recent inactive subscriptions.
   *
   * This function checks if the user currently has an active subscription. If so, it retrieves both the active
   * subscription(s) and the last inactive subscription (if one exists). The response includes details of the
   * subscription(s) and their status.
   *
   * @param req - The incoming request object with user details in the JWT payload.
   * @param res - The response object used to return the subscription status and details.
   * @param next - The next middleware function in the Express.js route chain for error handling.
   */
  async verifyUserSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      // Get active subscriptions for the user
      const activeSubscriptions =
        await this.subscriptionService.getActiveSubscriptions(userId);
      // Retrieve the last subscription that was active but is now inactive
      const lastInactiveSubscription =
        await this.subscriptionService.getLastInActiveSubscriptions(userId);
      // Determine if the user has an active subscription
      const hasActiveSubscription = activeSubscriptions.length > 0;

      const response = checkSubscriptionResponse(
        hasActiveSubscription,
        activeSubscriptions || undefined,
        lastInactiveSubscription || undefined
      );
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in verifyUserSubscription', err);
      handleError(next, err);
    }
  }

  /**
   *  Create Subscription
   *
   * @param req - The incoming request object with user details in the JWT payload.
   * @param res - The response object used to return the subscription details.
   * @param next - The next middleware function in the Express.js route chain for error handling.
   */
  async createSubscription(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const subscriptionReq = extractCreateSubscriptionData(
        req,
        createSubscriptionSchema
      );

      const startDate = new Date(); // Set the subscription start date

      // Validate subscriptionData by checking if the provided planId exists
      const planData = await this.planService.getPlanById(
        subscriptionReq.planId
      );
      if (!planData) {
        throw new Error('The provided planId does not exist.');
      }

     // Check whether active subscription exists or not
     let subscriptionDetails=await this.subscriptionService.getActiveSubscriptions(userId);
     if(subscriptionDetails.length>0)
     {
      throw new Error(
        'You already have an active subscription. Please wait until your current plan expires before making another payment. If you want to upgrade, contact the  admin.'
      );
     }
     // Prepare the subscription data to create
      const subscriptionData = {
        userId: userId,
        planId: subscriptionReq.planId,
        startDate: startDate,
        endDate: calculateEndDate(startDate, planData.dataValues.validityDay),
        validityDay: planData.dataValues.validityDay,
        discountCouponId: subscriptionReq.discountCouponId,
        extendedPlanId: subscriptionReq.extendedPlanId,
        extendedPlanStart: subscriptionReq.extendedPlanStart,
        paymentId: subscriptionReq.paymentId,
        isTrial: 0,
        statusId: 0,
        createdBy: userId,
      };

      // Call the SubscriptionService to create a subscription
      const subscription = await this.subscriptionService.createSubscription(
        subscriptionData,
        transaction
      );

      const response = createSubscriptionPaymentResponse(subscription);
      transaction.commit();

      res.status(200).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error in verifyUserSubscription', err);
      handleError(next, err);
    }
  }
}
