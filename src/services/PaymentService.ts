import { Op, Transaction, WhereOptions } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';

import {
  CreatePaymentDTO,
  GetAllPaymentListDTO,
  UpdatePaymentDTO,
} from '../dtos/payment/paymentDTO';
import {
  Company,
  Event,
  EventContact,
  Order,
  Payment,
  PaymentMethod,
  Plan,
  Subscription,
  SubscriptionPayment,
  User,
  UserCompany,
} from '../models/init-models';
import {
  CreatePaymentMethodDTO,
  PaymentMethodFilterDTO,
} from '../dtos/payment/PaymentMethodDTO';
import {
  CreateSubscriptionPaymentDTO,
  PaymentSubscriptionListDTO,
  UpdateSubscriptionPaymentDTO,
} from '../dtos/payment/PaymentSubscriptionDTO';
import { Utils } from '../utils/Utils';
import { enumPaymentState, enumRoll, enumSubscriptionStatus } from '../utils/enum';

export class paymentService {
  private paymentMethodBaseService: BaseService<PaymentMethod>;
  private paymentBaseService: BaseService<Payment>;
  private userCompanyService: BaseService<UserCompany>;
  private subscriptionPaymentBaseService: BaseService<SubscriptionPayment>;
  private subscriptionBaseService: BaseService<Subscription>;

  constructor() {
    this.paymentBaseService = new BaseService(
      Payment as unknown as {
        new (): Payment;
      } & typeof Payment
    );
    this.paymentMethodBaseService = new BaseService(
      PaymentMethod as unknown as {
        new (): PaymentMethod;
      } & typeof PaymentMethod
    );
    this.subscriptionPaymentBaseService = new BaseService(
      SubscriptionPayment as unknown as {
        new (): SubscriptionPayment;
      } & typeof SubscriptionPayment
    );
    this.subscriptionBaseService = new BaseService(
      Subscription as unknown as {
        new (): Subscription;
      } & typeof Subscription
    );
    this.userCompanyService = new BaseService(
      UserCompany as unknown as { new(): UserCompany } & typeof UserCompany
    );
  }

  /**
   * Creates a new payment entry in the database within a transaction.
   * @param userId - The ID of the user creating the payment.
   * @param data - The input data required to create a new payment, provided in the form of a DTO (Data Transfer Object).
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns - The newly created payment.
   */
  async createPayment(
    userId: number,
    compnayId: number,
    data: CreatePaymentDTO,
    transaction?: Transaction
  ): Promise<Payment> {
    try {
      // Check if a payment method with the same code already exists
      const existingPaymentMethod = await this.paymentMethodBaseService.findOne(
        {
          where: {
            id: data.paymentMethodId,
          },
        },
        transaction
      );

      if (!existingPaymentMethod) {
        throw new Error('Payment method not found.');
      }

      // checking the user already done payment in same event
      const existingPayment = await this.paymentBaseService.findOne({
        where: {
          eventId: data.eventId,
          userId: userId,
          state: enumPaymentState.COMPLETED,
        },
      });

      if (existingPayment) {
        const errorMessage = `Payment has already been completed.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const req = {
        paymentMethodId: data.paymentMethodId,
        state: data.state,
        transactionId: data.transactionId,
        errorMessage: data.errorMessage,
        metadata: data.metadata,
        paymentReferenceNumber: data.paymentReferenceNumber,
        orderId: data.orderId,
        amount: data.amount,
        companyId: compnayId,
        eventId: data.eventId,
        userId: userId,
        createdBy: userId,
        modifiedBy: 0,
      };

      const newPayment = await this.paymentBaseService.create(req, transaction);
      return newPayment;
    } catch (error) {
      Logger.error('Error creating payment', error);
      throw error;
    }
  }

  /**
   * Creates a new payment method entry in the database within a transaction.
   * @param data - The input data required to create a new payment method, provided in the form of a DTO (Data Transfer Object).
   * @returns - The newly created payment method.
   */
  async createPaymentMethod(
    data: CreatePaymentMethodDTO
  ): Promise<PaymentMethod> {
    return this.paymentMethodBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          const req = {
            code: data.code,
            handler: data.handler,
            enabled: data.enabled,
            name: data.name,
            description: data.description,
            logoUrl: data.logoUrl,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            createdBy: data.createdBy,
            createdOn: new Date(), // Set the current date
          };

          const newPaymentMethod = await this.paymentMethodBaseService.create(
            req,
            transaction
          );
          return newPaymentMethod;
        } catch (error) {
          Logger.error('Error creating payment method', error);
          throw error;
        }
      }
    );
  }

  /**
   * Retrieves all payment methods based on the provided filters, pagination, and sorting.
   * @param filters An object containing filter criteria for querying payment methods.
   * @param limit The maximum number of records to retrieve
   * @param offset The number of records to skip
   * @param sortBy The column name by which to sort the results
   * @param sortDirection The direction of sorting, either 'ASC' (ascending) or 'DESC' (descending).
   * @returns A promise that resolves to an array of payment methods that match the given filters and sorting options.
   */
  async getAllPaymentmethod(
    filters: PaymentMethodFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<PaymentMethod[]> {
    try {
      if (filters?.enabled !== undefined) {
        filters.enabled = filters.enabled === true;
      }

      if (filters?.name) {
        filters.name = { [Op.like]: `%${filters.name}%` }; // Use a wildcard search for the name
      }

      if (filters?.code) {
        filters.code = { [Op.like]: `%${filters.code}%` }; // Use a wildcard search for the code
      }
      const result = await this.paymentMethodBaseService.findAll({
        where: { ...filters },
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return result;
    } catch (error) {
      Logger.error('Error getAllPaymentMethod:', error);
      throw error;
    }
  }

  /**
   * Creates a new subscription payment entry in the database within a transaction.
   * @param userId - The ID of the user creating the subscription payment.
   * @param data - The input data required to create a new subscription payment, provided in the form of a DTO.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns - The newly created subscription payment.
   */
  async createSubscriptionPayment(
    data: CreateSubscriptionPaymentDTO,
    transaction?: Transaction
  ): Promise<SubscriptionPayment> {
    try {
      // Check if a payment method with the same code already exists
      const existingPayment = await this.paymentMethodBaseService.findOne(
        {
          where: {
            id: data.paymentMethodId,
          },
        },
        transaction
      );

      if (!existingPayment) {
        throw new Error('Payment method not found.');
      }

      const req = {
        paymentMethodId: data.paymentMethodId,
        state: data.state,
        transactionId: data.transactionId,
        errorMessage: data.errorMessage,
        metadata: data.metadata,
        paymentReferenceNumber: data.paymentReferenceNumber,
        orderId: data.orderId,
        amount: data.amount,
        finalAmount: data.finalAmount,
        discountAmount: data.discountAmount,
        subscriptionId: data.subscriptionId,
        userId: data.userId,
        createdBy: data.userId,
        modifiedBy: 0,
      };

      const newPayment = await this.subscriptionPaymentBaseService.create(
        req,
        transaction
      );

      // Updating subscription status after payment done
      await this.subscriptionBaseService.update(
        data.subscriptionId,
        {
          statusId: enumSubscriptionStatus.ACTIVE,
        },
        undefined,
        transaction
      );

      return newPayment;
    } catch (error) {
      Logger.error('Error createSubscriptionPayment', error);
      throw error;
    }
  }

  /**
   * Fetches a list of payments with optional filters, sorting, and pagination.
   * @param filters - Filtering options to apply to the paymentList.
   * @param limit - Number of results to return per page.
   * @param offset - Number of results to skip for pagination.
   * @param sortBy - Field by which to sort results.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @param userId - ID of the user requesting the payment list.
   * @returns An object containing the list of payments and the total count.
   */
  async getAllpaymentList(
    filters: GetAllPaymentListDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    uId: number,
    userRole:string
  ): Promise<{ rows: Payment[]; count: number }> {
    try {
      const { id, companyId, eventId, paymentMethodId, startDate, endDate, userId } =
        filters;
      const paymentListCondition: WhereOptions<Payment> = {};
      if (Utils.isNotUndefined(id)) {
        paymentListCondition.id = id;
      }
      if(userRole===enumRoll.USER){
        paymentListCondition.userId = uId;
      }
      if (Utils.isNotUndefined(eventId)) {
        paymentListCondition.eventId = eventId;
      }

      if (Utils.isNotUndefined(userId)) {
        paymentListCondition.userId = userId;
      }
      if(userRole===enumRoll.COMPANYADMIN){
         // if the user is admin, giving companyId Filter as default.
         const company = await this.userCompanyService.findOne({
          where: { userId: uId },
          include: [{ model: Company, as: 'company', required: true }],
        });
        paymentListCondition.companyId =  company?.company.dataValues.id;
      }
      else if (Utils.isNotUndefined(companyId)) {
         // if the user is admin, giving companyId Filter as default.
         const company = await this.userCompanyService.findOne({
          where: { userId: uId },
          include: [{ model: Company, as: 'company', required: true }],
        });
        paymentListCondition.companyId =  company?.company.dataValues.id;
      }

      if (Utils.isNotUndefined(paymentMethodId)) {
        paymentListCondition.paymentMethodId = paymentMethodId;
      }

      if (Utils.isNotUndefined(userId)) {
        paymentListCondition.userId = userId;
      }

      if (startDate && endDate) {
        paymentListCondition.createdOn = {
          [Op.between]: [
            new Date(startDate).setHours(0, 0, 0, 0),
            new Date(endDate).setHours(23, 59, 59, 999)
          ],
        };
      } else if (startDate) {
        paymentListCondition.createdOn = { [Op.gte]: new Date(startDate) };
      } else if (endDate) {
        paymentListCondition.createdOn = {
          [Op.lte]: new Date(endDate).setHours(23, 59, 59, 999),
        };
      }
      const excludeUser = [
        'modifiedOn',
        'modifiedBy',
        'createdBy',
        'createdOn',
        'phoneVerified',
        'isSsoUser',
        'ssoMetadata',
        'acceptedTerms',
      ];
      const exclude = [
        'modifiedOn',
        'modifiedBy',
        'createdBy',
        'createdOn',
      ];
      const { rows, count } = await this.paymentBaseService.findAndCountAll({
        where: paymentListCondition,
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: excludeUser,
            },
          },
          {
            model: Event,
            as: 'event',
            attributes: {
              exclude
            },
            include: [
              {
                model: EventContact,
                as: 'eventContacts',
                attributes: {
                  exclude
                },
              }
            ]
          },
          {
            model: Company,
            as: 'company',
            attributes: {
              exclude
            },
          },
          {
            model: PaymentMethod,
            as: 'paymentMethod',
            attributes: {
              exclude
            },
          },
          {
            model: Order,
            as: 'order',
            attributes: {
              exclude
            },
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error in getpaymentList:', error);
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of subscription payments based on the provided filters and sorting options.
   *
   * @param {getAllPaymentListDTO} filters - An object containing filter options, such as companyId, eventId, paymentMethodId, startDate, and endDate.
   * @param {number} limit - The maximum number of records to return.
   * @param {number} offset - The number of records to skip for pagination.
   * @param {string} sortBy - The column name to sort by.
   * @param {string} sortDirection - The sort direction, either 'ASC' or 'DESC'.
   * @param {number} userId - The ID of the user to filter payments for.
   *
   * @returns {Promise<{ rows: Payment[]; count: number }>} - A promise that resolves with an object containing:
   *  - rows: An array of Payment objects that match the filters.
   *  - count: The total count of payments that match the filters.
   *
   * @throws Will throw an error if the query fails.
   */
  async getAllSubscriptionpaymentList(
    filters: PaymentSubscriptionListDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: SubscriptionPayment[]; count: number }> {
    try {
      const {
        state,
        subscriptionId,
        transactionId,
        paymentMethodId,
        startDate,
        endDate,
      } = filters;
      const paymentListCondition: WhereOptions<SubscriptionPayment> = {};

      if (Utils.isNotUndefined(userId)) {
        paymentListCondition.userId = userId;
      }
      if (paymentListCondition.state) {
        paymentListCondition.state = state;
      }
      if (Utils.isNotUndefined(paymentListCondition.subscriptionId)) {
        paymentListCondition.subscriptionId = subscriptionId;
      }
      if (Utils.isNotUndefined(paymentListCondition.transactionId)) {
        paymentListCondition.transactionId = transactionId;
      }
      if (paymentMethodId) {
        paymentListCondition.paymentMethodId = paymentMethodId;
      }
      if (startDate && endDate) {
        paymentListCondition.createdOn = {
          [Op.between]: [startDate, endDate],
        };
      } else if (startDate) {
        paymentListCondition.createdOn = { [Op.gte]: startDate };
      } else if (endDate) {
        paymentListCondition.createdOn = { [Op.lte]: endDate };
      }
      const exclude = ['modifiedOn', 'modifiedBy', 'createdBy', 'createdOn'];
      const { rows, count } =
        await this.subscriptionPaymentBaseService.findAndCountAll({
          where: paymentListCondition,
          include: [
            {
              model: User,
              as: 'user',
              attributes: {
                exclude,
              },
            },
            {
              model: Subscription,
              as: 'subscription',
              attributes: {
                exclude,
              },
              include: [
                {
                  model: Plan,
                  as: 'plan',
                  attributes: {
                    exclude,
                  },
                }
              ]
            },
          ],
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });
      return { rows, count };
    } catch (error) {
      Logger.error('Error in getpaymentList:', error);
      throw error;
    }
  }

  /**
   * Update payment entry in the database within a transaction.
   * @param userId - The ID of the user updating the payment.
   * @param data - The input data required to update a payment, provided in the form of a DTO (Data Transfer Object).
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns - returning null.
   */
  async updatePayment(
    userId: number,
    paymentId: number,
    data: UpdatePaymentDTO,
    transaction?: Transaction
  ): Promise<Payment | null> {
    const req = {
      paymentMethodId: data.paymentMethodId,
      state: data.state,
      transactionId: data.transactionId,
      errorMessage: data.errorMessage,
      metadata: data.metadata,
      orderId: data.orderId,
      paymentReferenceNumber: data.paymentReferenceNumber,
      amount: data.amount,
      modifiedBy: userId,
    };
    try {
      // Check if a payment method with the same code already exists
      const existingPayment = await this.paymentBaseService.findOne(
        {
          where: {
            id: paymentId,
          },
        },
        transaction
      );

      if (!existingPayment) {
        throw new Error('Payment not found.');
      }

      await this.paymentBaseService.update(
        paymentId,
        req,
        undefined,
        transaction
      );
      return null;
    } catch (error) {
      Logger.error('Error updating payment', error);
      throw error;
    }
  }

  /**
   * Update a existing subscription payment entry in the database within a transaction.
   * @param userId - The ID of the user updating the subscription payment.
   * @param data - The input data required to update a subscription payment, provided in the form of a DTO.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns - returning null.
   */
  async updateSubscriptionPayment(
    userId: number,
    subscriptionPaymentId: number,
    data: UpdateSubscriptionPaymentDTO,
    transaction?: Transaction
  ): Promise<SubscriptionPayment | null> {
    try {
      // Check if a payment method with the same code already exists
      const subscriptionPayment =
        await this.subscriptionPaymentBaseService.findOne(
          {
            where: {
              id: subscriptionPaymentId,
            },
          },
          transaction
        );

      if (!subscriptionPayment) {
        throw new Error('Subscription Payment not found.');
      }

      const req = {
        paymentMethodId: data.paymentMethodId,
        state: data.state,
        transactionId: data.transactionId,
        errorMessage: data.errorMessage,
        metadata: data.metadata,
        paymentReferenceNumber: data.paymentReferenceNumber,
        amount: data.amount,
        finalAmount: data.finalAmount,
        discountAmount: data.discountAmount,
        modifiedBy: userId,
      };

      await this.subscriptionPaymentBaseService.update(
        subscriptionPaymentId,
        req
      );
      return null;
    } catch (error) {
      Logger.error('Error updateSubscriptionPayment', error);
      throw error;
    }
  }

  /**
   * Retrieves a payment by ID. If the Subscription payment is not found, throws an error.
   * @param id - The ID of the Subscription payment to retrieve.
   * @returns TheSubscription payment record if found.
   * @throws Error if them Subscription payment is not found.
   */
  async getPaymentOrThrow(id: number): Promise<Payment> {
    const payment = await this.paymentBaseService.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  /**
   * Retrieves a subscription payment by ID. If the Subscription payment is not found, throws an error.
   * @param id - The ID of the Subscription payment to retrieve.
   * @returns The Subscription payment record if found.
   * @throws Error if them Subscription payment is not found.
   */
  async getSubscriptionPaymentOrThrow(
    id: number
  ): Promise<SubscriptionPayment> {
    const payment = await this.subscriptionPaymentBaseService.findById(id);
    if (!payment) {
      throw new Error('Subscription Payment not found');
    }
    return payment;
  }
}
