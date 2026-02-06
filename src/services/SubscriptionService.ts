/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author saneeshiv
 * @class SubscriptionService
 * @description Service class for handling CRUD operations related to the Subscription model.
 */
import {
  enumPlanPropertyAssignmentStatus,
  enumStatus,
  enumSubscriptionStatus,
} from './../utils/enum';
import { Transaction } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  ExtraPricing,
  PlanPropertyAssignment,
  Subscription,
  SubscriptionExtraPricing,
  SubscriptionStatus,
  UsageRecord,
} from '../models/init-models';
import { CreateSubscriptionDTO } from '../dtos/subscription/SubscriptionDTO';

export class SubscriptionService {
  private subscriptionBaseService: BaseService<Subscription>;
  private subscriptionStatusBaseService: BaseService<SubscriptionStatus>;
  private planPropertyAssignmentBaseService: BaseService<PlanPropertyAssignment>;
  private usageRecordBaseService: BaseService<UsageRecord>;
  private subscriptionExtraPricingBaseService: BaseService<SubscriptionExtraPricing>;

  constructor() {
    this.subscriptionBaseService = new BaseService(
      Subscription as unknown as { new (): Subscription } & typeof Subscription
    );
    this.subscriptionStatusBaseService = new BaseService(
      SubscriptionStatus as unknown as {
        new (): SubscriptionStatus;
      } & typeof SubscriptionStatus
    );
    this.planPropertyAssignmentBaseService = new BaseService(
      PlanPropertyAssignment as unknown as {
        new (): PlanPropertyAssignment;
      } & typeof PlanPropertyAssignment
    );
    this.usageRecordBaseService = new BaseService(
      UsageRecord as unknown as { new (): UsageRecord } & typeof UsageRecord
    );
    this.subscriptionExtraPricingBaseService = new BaseService(
      SubscriptionExtraPricing as unknown as {
        new (): SubscriptionExtraPricing;
      } & typeof SubscriptionExtraPricing
    );
  }

  /**
   * Checks if a company user has an active subscription.
   * @param userId - The ID of the company user.
   * @returns A promise that resolves to the subscription record if found, or null if no active subscription exists.
   */
  async getCompanySubscription(userId: number): Promise<Subscription | null> {
    try {
      // Retrieve the active status ID for the subscription
      const subscriptionStatus = await this.getSubscriptionStatus(
        enumStatus.ACTIVE
      );
      const subscription = await this.subscriptionBaseService.findOne({
        where: {
          userId: userId,
          statusId: subscriptionStatus?.dataValues.id,
        },
      });
      return subscription;
    } catch (error) {
      Logger.error('Error getCompanySubscription:', error);
      throw error;
    }
  }

  /**
   * Checks if a company's subscription has expired.
   * @param companyId - The ID of the company.
   * @returns A boolean indicating whether the subscription has expired.
   */
  async isSubscriptionExpired(companyId: number): Promise<boolean> {
    try {
      const subscription = await this.getCompanySubscription(companyId);
      if (
        !subscription ||
        !subscription.endDate ||
        subscription.endDate < new Date() ||
        subscription.statusId === enumSubscriptionStatus.INACTIVE ||
        subscription.statusId === enumSubscriptionStatus.EXPIRED
      ) {
        // No subscription or end date, so consider it expired
        return true;
      }
      const now = new Date();
      return subscription.endDate < now;
    } catch (error) {
      Logger.error('Error isSubscriptionExpired:', error);
      throw error;
    }
  }

  /**
   * Checks if a specific plan property for a company's subscription has reached its limit.
   * @param subscriptionId - The ID of the subscription.
   * @param propertyId - The ID of the plan property.
   * @returns A boolean indicating whether the plan property has reached its limit.
   */
  async isPlanPropertyLimitReached(
    subscriptionId: number,
    propertyId: number
  ): Promise<boolean> {
    try {
      // Fetch the plan property assignment
      const propertyAssignment =
        await this.planPropertyAssignmentBaseService.findOne({
          where: {
            planId: subscriptionId,
            planPropertyId: propertyId,
            statusId: enumPlanPropertyAssignmentStatus.ACTIVE,
          },
        });

      if (!propertyAssignment) {
        throw new Error('Plan property assignment not found');
      }

      // Fetch the current usage from the usage record
      const usageRecord = await this.usageRecordBaseService.findOne({
        where: {
          subscriptionId: subscriptionId,
          planPropertyId: propertyId,
        },
      });

      if (!usageRecord) {
        return false; // No usage record means the limit hasn't been reached yet
      }

      // Fetch all subscription extra pricing records for the given subscriptionId
      const subscriptionExtraPricings =
        await this.subscriptionExtraPricingBaseService.findAll({
          where: {
            subscriptionId: subscriptionId,
          },
          include: [{ model: ExtraPricing, as: 'extraPricing' }],
        });

      // Initialize additional limit
      let additionalLimit = 0;

      // Loop through all subscription extra pricing records
      for (const subscriptionExtraPricing of subscriptionExtraPricings) {
        // Check if the property_id matches
        if (
          subscriptionExtraPricing.extraPricing &&
          subscriptionExtraPricing.extraPricing.planPropertyId === propertyId
        ) {
          additionalLimit +=
            subscriptionExtraPricing.extraPricing.maxLimit ?? 0;
        }
      }

      // Calculate the total max limit including additional limits
      const totalMaxLimit = propertyAssignment.maxLimit! + additionalLimit;

      // Check if the usage has reached the limit
      return (usageRecord.currentUsage ?? 0) >= totalMaxLimit;
    } catch (error) {
      Logger.error('Error isPlanPropertyLimitReached:', error);
      throw error;
    }
  }

  /**
   * Creates a new subscription for a company.
   * @param subscriptionData - The data to create the subscription.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Subscription.
   */
  async createSubscription(
    subscriptionData: CreateSubscriptionDTO,
    transaction?: Transaction
  ): Promise<Subscription> {
    try {
      subscriptionData.statusId = enumSubscriptionStatus.PENDING;
      return await this.subscriptionBaseService.create(
        subscriptionData,
        transaction
      );
    } catch (error) {
      Logger.error('Error createSubscription:', error);
      throw error;
    }
  }

  /**
   * Updates an existing subscription for a company.
   * @param id - The ID of the subscription to update.
   * @param updateData - The data to update.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the number of affected rows and an array of the updated Subscription records (if { returning: true } is set).
   */
  async updateSubscription(
    id: number,
    updateData: any,
    transaction?: Transaction
  ): Promise<[number, Subscription[] | undefined]> {
    try {
      return this.subscriptionBaseService.update(
        id,
        updateData,
        undefined,
        transaction
      );
    } catch (error) {
      Logger.error('Error updateSubscription:', error);
      throw error;
    }
  }

  /**
   * Gets all active subscriptions for a company user.
   * @param userId - The ID of the company user.
   * @returns A promise that resolves to a list of subscriptions.
   */
  async getActiveSubscriptions(userId: number): Promise<Subscription[]> {
    try {
      const subStatus = await this.getSubscriptionStatus(enumStatus.ACTIVE);
      return this.subscriptionBaseService.findAll({
        where: {
          userId: userId,
          statusId: subStatus?.dataValues.id,
        },
      });
    } catch (error) {
      Logger.error('Error getActiveSubscriptions:', error);
      throw error;
    }
  }

  /**
   * Gets last inactive subscriptions for a company user.
   * @param userId - The ID of the company user.
   * @returns A promise that resolves to a list of subscriptions.
   */
  async getLastInActiveSubscriptions(
    userId: number
  ): Promise<Subscription | null> {
    try {
      // Retrieve the inactive status ID for the subscription
      const subscriptionStatus = await this.getSubscriptionStatus(
        enumStatus.INACTIVE
      );
      const subscription = await this.subscriptionBaseService.findOne({
        where: {
          userId: userId,
          statusId: subscriptionStatus?.dataValues.id,
        },
        order: [['modified_on', 'DESC']],
      });
      return subscription;
    } catch (error) {
      Logger.error('Error getCompanySubscription:', error);
      throw error;
    }
  }

  /**
   * Gets subscription status.
   * @param statusName
   * @returns A promise that resolves to  subscription status.
   */
  async getSubscriptionStatus(
    statusName: string,
    transaction?: Transaction
  ): Promise<SubscriptionStatus | null> {
    try {
      return this.subscriptionStatusBaseService.findOne(
        {
          where: { statusName: statusName },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getSubscriptionStatus:', error);
      throw error;
    }
  }

  /**
   * Retrieves a subscription record by its unique identifier.
   * This function queries the database for a subscription with the specified `subscriptionId`.
   * If a subscription is found, it is returned; otherwise, an error is thrown.
   *
   * @param subscriptionId - The unique identifier of the subscription to be retrieved.
   * @param transaction - (Optional) The transaction object, if the operation is part of a larger transaction.
   * @returns A `Promise` that resolves to the `Subscription` object if found.
   *
   * @throws An error if no subscription is found with the provided `subscriptionId`.
   * @throws An error if there is an issue querying the database.
   */
  async getSubscriptionById(
    subscriptionId: any,
    transaction?: Transaction
  ): Promise<Subscription> {
    try {
      const data = await this.subscriptionBaseService.findById(
        subscriptionId,
        undefined,
        transaction
      );
      if (!data) {
        Logger.info(
          'No subscription found for subscriptionId:',
          subscriptionId
        );
        throw new Error('No subscription found');
      }

      return data;
    } catch (error) {
      Logger.error('Error getSubscriptionById:', error);
      throw error;
    }
  }
}
