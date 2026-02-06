/**
 * @class TokenController
 * @description Controller class for handling HTTP requests related to Token operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import {
  createOtpTokenResponse,
  createTokenResponse,
  getStatusByNameResponse,
} from '../dtos/token/TokenDTO';
import { Transaction } from 'sequelize';
import {
  extractCreateTokenValidation,
  extractOtpTokenData,
  extractOtpValidation,
  extractStatusData,
  extractTokenValidation,
} from '../handlers/token/tokenRequestHandler';
import {
  createOtpTokenSchema,
  createTokenSchema,
  otpValidatorSchema,
  statusValidatorSchema,
  tokenValidatorSchema,
} from '../validators/tokenValidator';
import {
  getOtpValidationResponse,
  getTokenValidationResponse,
} from '../dtos/token/TokenDTO';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { sequelize } from '../models';
import { enumTokenType } from '../utils/enum';
import { UserService } from '../services/UserService';

export class TokenController {
  private tokenService = new TokenService();
  private userService = new UserService();

  /**
   * Handles the request to create a new token and OTP.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createOtpToken(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const tokenData = extractOtpTokenData(req, createOtpTokenSchema);

      const token = await this.tokenService.createOtpToken(
        tokenData,
        transaction
      );
      transaction.commit();
      const response = createOtpTokenResponse(token);

      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error creating OTP token:', error);
      transaction.rollback();
      handleError(next, error); // Handle error and propagate it to the next middleware
    }
  }

  /**
   * Handles the request to create a new token.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createToken(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const tokenData = extractCreateTokenValidation(req, createTokenSchema);

      const userResp = await this.userService.getUserById(tokenData.userId);
      if (!userResp || userResp.dataValues.email !== tokenData.email) {
        throw new Error('User not found or email mismatch');
      }
      const token = await this.tokenService.createToken(tokenData, transaction);
      transaction.commit();
      const response = createTokenResponse(token);
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error creating OTP token:', error);
      transaction.rollback();
      handleError(next, error); // Handle error and propagate it to the next middleware
    }
  }

  /**
   * Handles the request to validation of token.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async tokenValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractTokenValidation(req, tokenValidatorSchema);

      const result = await this.tokenService.tokenValidation(data);

      const response = getTokenValidationResponse(result);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('error validating token', err);
      handleError(next, err);
    }
  }

  /**
   *  OTP Validation Controller
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction for error handling
   */
  async otpValidation(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract and validate the OTP data from the request body using the schema
      const data = extractOtpValidation(req, otpValidatorSchema);

      const result = await this.tokenService.OtpValidation(data);
      const resultValue: { isValid: boolean; token?: string } = {
        isValid: result,
      };
      if (
        result &&
        (data.type === enumTokenType.RESET_PASSWORD_OTP ||
          data.type === enumTokenType.USER_REGISTRATION_OTP)
      ) {
        await this.tokenService.expireToken(data.token);
        const userResp = await this.userService.getUserById(data.userId);
        const newToken = await this.tokenService.createToken({
          type: data.type,
          userId: data.userId,
          email: userResp?.dataValues.email || '',
        });
        resultValue.token = newToken.dataValues.token;
      }

      const response = getOtpValidationResponse(resultValue);
      const statusCode = response.data?.isValid ? 200 : 400;
      res.status(statusCode).json(response);
    } catch (err) {
      Logger.error('error validating OTP', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to list token status.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async listTokenStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const { rows: userData, count: total } =
        await this.tokenService.getTokenStatusList(
          limit,
          offset,
          sortBy,
          sortDirection
        );

      const response = createPaginatedResponse(userData, total, limit, offset);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error listing Token Status:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Get token status by name.
   * @param req - Express request object, contains the request data.
   * @param res  - Express response object, used to send the response.
   * @param next - Express next function, used to pass control to the next middleware.
   * @returns - Returns a promise that resolves to sending the response.
   */
  async getTokenStatusByName(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract and validate incoming request data using the provided schema
      const data = extractStatusData(req, statusValidatorSchema);

      const result = await this.tokenService.getTokenStatusByName(data);

      // Check if the result is null (i.e., no token status found)
      if (!result) {
        return res
          .status(404)
          .json({ status: 'error', message: 'status not found' });
      }

      const response = getStatusByNameResponse(result);

      res.status(201).json(response);
    } catch (err) {
      // Log the error and pass it to the error handler middleware
      Logger.error('Error in getTokenStatusByName:', err);
      handleError(next, err);
    }
  }
}
