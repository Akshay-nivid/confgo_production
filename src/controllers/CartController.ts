/**
 * @author saneeshiv
 * @class CartController
 * @description
 */

import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../models';
import { Transaction } from 'sequelize';
import { handleError } from '../utils/error_util';
import { Logger } from '../utils/logger';
import { JwtPayload } from 'jsonwebtoken';
import { createCartSchema } from '../validators/cartValidator';
import { CartService } from '../services/CartService';
import {
  extractCreateCartValidation,
  extractUpdateCartValidation,
} from '../handlers/cart/cartRequestHandler';
import {
  cartDetailsResponse,
  createCartResponse,
  updateCartResponse,
} from '../dtos/cart/CartDTO';
import { SessionHelper } from '../helper/sessionHelper';

export class CartController {
  private cartService = new CartService();

  /**
   * Handles the request to create a new Cart.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createCart(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;

      let sessionId = undefined;

      const cartData = extractCreateCartValidation(req, createCartSchema);

      if (!userId) {
        sessionId = SessionHelper.getSessionId(req);
        if (!sessionId) {
          sessionId = req.sessionID;
          SessionHelper.setSessionId(req, sessionId);
        }
      }
      const cartResp = await this.cartService.createCart(
        cartData,
        userId,
        sessionId,
        transaction
      );

      if (!cartResp) {
        const errorMessage = `Cart not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      transaction.commit();

      const response = createCartResponse(cartResp);
      res.status(201).json(response);
    } catch (error) {
      Logger.error('Error createCart:', error);
      transaction.rollback();
      handleError(next, error);
    }
  }

  /**
   * Handles the request to get cart details by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getCartDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      const cartId = req.params?.id;

      let sessionId = undefined;
      if (!userId) {
        sessionId = SessionHelper.getSessionId(req);
      }

      const cartResp = await this.cartService.getCartById(
        Number(cartId),
        userId,
        sessionId
      );

      if (cartResp && cartResp.cart) {
        const totalAmounts = {
          eventAmount: cartResp.eventAmount,
          programTotal: cartResp.programTotal,
          addonTotal: cartResp.addonTotal,
          priceTierDiscount: cartResp.priceTierDiscount,
        };
        const response = cartDetailsResponse(cartResp.cart, totalAmounts);
        res.status(200).json(response);
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Cart details not found',
        });
      }
    } catch (err) {
      Logger.error('Error getCartDetailById:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the user's cart with the provided data.
   *
   * This function retrieves the user ID from the JWT payload, validates the cart data,
   * and updates the specified cart entry in the database within a transaction.
   * If the update is successful, it retrieves and returns the updated cart data.
   *
   * @param req - The request object containing the user's JWT and cart data.
   *              The `id` parameter specifies the cart to be updated.
   * @param res - The response object used to send back the update result.
   * @param next - The next middleware function, used for error handling.
   *
   * @returns A JSON response with the updated cart data if successful, or an error message if not.
   *
   * @throws Will invoke the error handler if the update fails.
   *         Rolls back the transaction in case of errors.
   */
  async updateCart(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const cartId = req.params?.id;

      const cartData = extractUpdateCartValidation(req, createCartSchema);

      let sessionId = undefined;
      if (!userId) {
        sessionId = SessionHelper.getSessionId(req);
      }

      const [updatedCount] = await this.cartService.updateCart(
        Number(cartId),
        cartData,
        userId,
        sessionId,
        transaction
      );
      transaction.commit();

      if (updatedCount > 0) {
        const updatedCart = await this.cartService.getCartById(
          Number(cartId),
          userId,
          sessionId
        );
        if (updatedCart?.cart) {
          const response = updateCartResponse(updatedCart.cart);
          res.status(200).json(response);
        } else {
          res
            .status(400)
            .json({ status: 'error', message: 'Cart detail not found' });
        }
      } else {
        res
          .status(500)
          .json({ status: 'error', message: 'Failed to update cart' });
      }
    } catch (error) {
      Logger.error('Error updateCart:', error);
      transaction.rollback();
      handleError(next, error);
    }
  }
}
