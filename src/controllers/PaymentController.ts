import { UserService } from './../services/UserService';
import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/error_util';
import {
  extractCreatePaymentData,
  extractCreatePaymentMethodData,
  extractCreateSubscriptionPaymentData,
  extractUpdatePaymentData,
  extractUpdateSubscriptionPaymentData,
} from '../handlers/payment/paymentRequestHandler';
import {
  createPaymentMethodSchema,
  createPaymentSchema,
  createSubscriptionPaymentSchema,
  updatdePaymentSchema,
  updateSubscriptionPaymentSchema,
} from '../validators/paymentValidator';
import { paymentService } from '../services/PaymentService';
import {
  createPaymentResponse,
  updatePaymentResponse,
} from '../dtos/payment/paymentDTO';
import { Logger } from '../utils/logger';
import { extractListRequestData } from '../utils/request_util';
import { JwtPayload } from 'jsonwebtoken';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { EventService } from '../services/EventService';
import {
  enumPaymentState,
  enumStatus,
  enumSubscriptionStatus,
} from '../utils/enum';
import { OrderService } from '../services/OrderService';
import { Payment } from '../models/Payment';
import { createPaginatedResponse } from '../utils/response_util';
import {
  createPaymentMethodResponse,
  listPaymentMethodResponse,
} from '../dtos/payment/PaymentMethodDTO';
import {
  createSubscriptionPaymentResponse,
  updateSubscriptionPaymentResponse,
} from '../dtos/payment/PaymentSubscriptionDTO';
import { SubscriptionService } from '../services/SubscriptionService';

export class PaymentController {
  private paymentService = new paymentService();
  private eventService = new EventService();
  private orderService = new OrderService();
  private userService = new UserService();
  private subscriptionService = new SubscriptionService();

  /**
   * Create a new payment method
   * @param req req Request object containing the payment method data
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async createPaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract the payment method data from the request, using validation schema
      const data = extractCreatePaymentMethodData(
        req,
        createPaymentMethodSchema
      );

      const paymentMethod = await this.paymentService.createPaymentMethod(data);
      // Create a response object for the newly created payment method
      const response = createPaymentMethodResponse(paymentMethod);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in creating payment method', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieve all payment methods with optional filters, sorting, and pagination
   * @param req req Request object containing query parameters for filters, sorting
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async getAllPaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const finalFilters = { ...filters };

      const list = await this.paymentService.getAllPaymentmethod(
        finalFilters,
        limit,
        offset,
        sortBy,
        sortDirection
      );
      // Format the response using a custom response handler
      const response = listPaymentMethodResponse(list);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in retrieving payment methods', err);
      handleError(next, err);
    }
  }

  /**
   * Create a new payment for a specific event.
   * This method is called when participant pays for an event
   * @param req req Request object containing the payment data
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async createPayment(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const userId = (req.user as JwtPayload)?.id;

      // Extract the payment data from the request, using validation schema
      const data = extractCreatePaymentData(req, createPaymentSchema);
      const eventResp = await this.eventService.getEventDetailById(
        data.eventId,
        transaction
      );

      const payment = await this.paymentService.createPayment(
        userId,
        eventResp.event?.dataValues.companyId ?? 0,
        data,
        transaction
      );
      // If the payment is completed and an order ID is provided, update the order status to completed.
      if (
        payment.dataValues.state === enumPaymentState.COMPLETED &&
        data.orderId
      ) {
        this.orderService.updateOrder(
          data.orderId,
          {
            status: 'COMPLETED',
          },
          transaction
        );
      }
      transaction.commit();
      // Create a response object for the newly created payment
      const response = createPaymentResponse(payment);

      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error in creating payment', err);
      handleError(next, err);
    }
  }

  /**
   * Create a new payment for a subscription.
   * This method is called when company pays for subscription
   * @param req req Request object containing the payment data
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async createSubscriptionPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Extract the payment data from the request, using validation schema
      const data = extractCreateSubscriptionPaymentData(
        req,
        createSubscriptionPaymentSchema
      );

      const payment = await this.paymentService.createSubscriptionPayment(
        data,
        transaction
      );

      if (data.state === enumPaymentState.COMPLETED) {
        const userStatus = await this.userService.getUserStatus(
          enumStatus.ACTIVE
        );
        if (!userStatus) {
          throw new Error('User status not found');
        }
        await this.userService.updateUser(
          data.userId,
          {
            statusId: userStatus.dataValues.id,
          },
          transaction
        );

        //Updating subscription status after completing payment
        const subscriptionStatus = enumSubscriptionStatus.ACTIVE;
        await this.subscriptionService.updateSubscription(
          data.subscriptionId,
          {
            statusId: subscriptionStatus,
          },
          transaction
        );
      }

      transaction.commit();
      // Create a response object for the newly created subscription payment
      const response = createSubscriptionPaymentResponse(payment);

      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error in createSubscriptionPayment', err);
      handleError(next, err);
    }
  }

  /**
   * Handles fetching a list of Payment events with optional filters, pagination, and sorting.
   * Responds with a paginated list of payments and associated user details.
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  async paymentList(req: Request, res: Response, next: NextFunction) {
    try {
      const uId = (req.user as JwtPayload)?.id;

      const userRole = (req.user as JwtPayload)?.userRole;
      
      const { filters, limit, sortBy, offset, sortDirection } =
        extractListRequestData(req);
    
      const { rows: paymentList, count: total } =
        await this.paymentService.getAllpaymentList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection,
          uId,
          userRole
        );
      const filteredPaymentList = paymentList.map((payment: Payment) =>
        this.filteredPaymentList(payment)
      );
      const response = createPaginatedResponse(
        filteredPaymentList,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('error creating payment list', error);
      handleError(next, error);
    }
  }

  /**
   * Handles the request to retrieve a paginated list of subscription payments based on filters, pagination, and sorting.
   *
   * @param {Request} req - The HTTP request object, which contains the user info, filters, limit, offset, and sorting parameters.
   * @param {Response} res - The HTTP response object used to send the response back to the client.
   * @param {NextFunction} next - The next middleware function in the stack, used for error handling.
   *
   * @returns {Promise<void>} - Sends a JSON response containing a paginated list of subscription payments or handles errors.
   */
  async subscriptionpaymentList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const { filters, limit, sortBy, offset, sortDirection } =
        extractListRequestData(req);
      const { rows: paymentList, count: total } =
        await this.paymentService.getAllSubscriptionpaymentList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection,
          userId
        );

      const response = createPaginatedResponse(
        paymentList,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in subscriptionpaymentList', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the payment fields based on the requested fields.
   * @param feedback - The Payment object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered feedback object.
   */
  private filteredPaymentList(Payment: Payment) {
    return Payment;
  }

  /**
   * Update a payment.
   *
   * @param req req Request object containing the payment data
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async updatePayment(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const userId = (req.user as JwtPayload)?.id;
      const paymentId = Number(req.params.id);

      const data = extractUpdatePaymentData(req, updatdePaymentSchema);

      await this.paymentService.updatePayment(Number(userId), paymentId, data);
      const updatedData =
        await this.paymentService.getPaymentOrThrow(paymentId);
      transaction.commit();
      // Create a response object for the updated subscription payment
      const response = updatePaymentResponse(updatedData);

      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in updatePayment', error);
      handleError(next, error);
    }
  }

  /**
   * Update a subscription payment.
   *
   * @param req req Request object containing the payment data
   * @param res res Response object for sending the result back
   * @param next next NextFunction for error handling
   */
  async updateSubscriptionPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const transaction: Transaction = await sequelize.transaction();

    try {
      const userId = (req.user as JwtPayload)?.id;
      const subscriptionPaymentId = Number(req.params.id);

      const data = extractUpdateSubscriptionPaymentData(
        req,
        updateSubscriptionPaymentSchema
      );

      await this.paymentService.updateSubscriptionPayment(
        Number(userId),
        subscriptionPaymentId,
        data
      );
      const updatedData =
        await this.paymentService.getSubscriptionPaymentOrThrow(
          subscriptionPaymentId
        );
      transaction.commit();
      // Create a response object for the updated subscription payment
      const response = updateSubscriptionPaymentResponse(updatedData);

      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in updateSubscriptionPayment', error);
      handleError(next, error);
    }
  }
}
