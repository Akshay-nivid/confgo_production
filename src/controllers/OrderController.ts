/**
 * @author saneeshiv
 * @class OrderController
 * @description
 */

import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/OrderService';
import { sequelize } from '../models';
import { Transaction } from 'sequelize';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../validators/orderValidator';
import {
  createOrderResponse,
  orderDetailsResponse,
} from '../dtos/order/OrderDTO';
import {
  extractCreateOrderValidation,
  extractUpdateOrderData,
} from '../handlers/order/orderRequestHandler';
import { handleError } from '../utils/error_util';
import { Logger } from '../utils/logger';
import { JwtPayload } from 'jsonwebtoken';
import { CouponService } from '../services/CouponService';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { Order } from '../models/Order';

export class OrderController {
  private orderService = new OrderService();
  private couponService = new CouponService();

  /**
   * Handles the request to create a new Order.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const orderData = extractCreateOrderValidation(req, createOrderSchema);
      let applyCoupon;
      if (orderData.coupon) {
        const couponData = {
          code: orderData.coupon,
          cartId: orderData.cartId,
        };

        applyCoupon = await this.couponService.applyCoupon(couponData, userId);
      }

      const token = await this.orderService.createOrder(
        userId,
        orderData,
        applyCoupon,
        transaction
      );
      transaction.commit();
      const response = createOrderResponse(token);
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error createOrder:', error);
      transaction.rollback();
      handleError(next, error);
    }
  }

  /**
   * Handles the request to get order details by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getOrderDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      const eventId = req.params?.id;

      const orderResp = await this.orderService.getOrderById(
        Number(eventId),
        userId
      );

      const response = orderDetailsResponse(orderResp);
      if (orderResp) {
        res.status(200).json(response);
      } else {
        res.status(404).json(response);
      }
    } catch (err) {
      Logger.error('Error getOrderDetailById:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to list order
   * @param req - Express request object.
   * @param res  - Express response object.
   * @param next - Express next middleware function.
   */
  async orderList(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      // Fetch filtered order from the service
      const { rows: userData, count: total } =
        await this.orderService.orderList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create paginated response
      const response = createPaginatedResponse(userData, total, limit, offset);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in retrieving order list', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to update an existing order by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderData = extractUpdateOrderData(req, updateOrderSchema);
      const orderId = req.params?.id;

      const [updatedCount] = await this.orderService.updateOrder(
        Number(orderId),
        orderData
      );

      if (updatedCount > 0) {
        const updatedOrder = await this.orderService.getOrderOrThrow(
          Number(orderId)
        );

        const response = orderDetailsResponse(updatedOrder as Order);

        res.status(200).json(response);
      } else {
        res
          .status(500)
          .json({ status: 'error', message: 'Failed to update order' });
      }
    } catch (err) {
      Logger.error('Error updateOrder:', err);
      handleError(next, err);
    }
  }
}
