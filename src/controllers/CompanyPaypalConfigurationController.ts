/**
 * @author nihal
 * @class CompanyPaypalConfigurationController
 * @description
 */

import { Request, Response, NextFunction } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import { createConfigResponse } from '../dtos/companyPaypalConfiguration/CompanyPaypalConfigurationDTO';
import {
  createPaypalConfigSchema,
  updatePaypalConfigSchema,
} from '../validators/companyPaypalConfigurationValidator';
import {
  extractPaypalConfigUpdateData,
  extractPaypalConfigurationData,
} from '../handlers/companyPaypalConfiguration/companyPaypalConfigurationRequestHandler';
import { CompanyPaypalConfigurationService } from '../services/CompanyPaypalConfigurationService';
import { CompanyService } from '../services/CompanyService';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';

export class CompanyPaypalConfigurationController {
  private companyPaypalConfigurationService =
    new CompanyPaypalConfigurationService();
  private companyService = new CompanyService();

  /**
   * Create a new PayPal configuration for the user's company.
   *
   * @param req - The request object, containing information sent by the client.
   * @param res - The response object, used to send the server's response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async createPaypalConfig(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;

      // The data is validated against a predefined schema.
      const configData = extractPaypalConfigurationData(
        req,
        createPaypalConfigSchema
      );

      // Create the PayPal configuration using the provided data and user ID.
      const config =
        await this.companyPaypalConfigurationService.createPaypalConfig(
          configData,
          userId,
          transaction
        );

      const message = 'Company Paypal Configuration Created Successfully';

      const response = createConfigResponse(config, message);
      transaction.commit();

      // Send a successful response with the created configuration data (HTTP 201 Created).
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating PayPal config:', err);
      transaction.rollback();
      handleError(next, err);
    }
  }

  /**
   * Handles the request to retrieve PayPal configuration details by its ID.
   *
   * @param req - The Express request object, containing the configuration ID in the request parameters.
   * @param res - The Express response object used to send the JSON response.
   * @param next - The Express next function used for error handling.
   */
  async getPaypalConfigById(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract the config ID from request parameters
      const userId = (req.user as JwtPayload).id;

      const userCompany =
        await this.companyService.getCompanyDetailsByUserId(userId);
      // Fetch PayPal configuration details using the service method, ensuring the ID is a number
      const config =
        await this.companyPaypalConfigurationService.getPaypalConfigById(
          userCompany.company.dataValues.id
        );
      const message = 'Paypal Configuration details fetched successfully';
      const response = createConfigResponse(config, message);

      res.status(200).json(response);
    } catch (err) {
      // Log the error details for debugging
      Logger.error('Error in getPaypalConfigById:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates an existing PayPal configuration for the user's company.
   *
   * @param req - The request object, containing information sent by the client.
   * @param res - The response object, used to send the server's response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async updatePaypalConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      // Extract the PayPal configuration ID from the URL parameters.
      const configId = req.params?.id;

      // The data is validated against a predefined schema.
      const configData = extractPaypalConfigUpdateData(
        req,
        updatePaypalConfigSchema
      );

      // The update operation returns an array where the first element is the count of updated records.
      const [updatedCount] =
        await this.companyPaypalConfigurationService.updatePaypalConfig(
          Number(configId),
          configData,
          userId
        );

      // If at least one record was updated, fetch the updated configuration.
      if (updatedCount > 0) {
        const updatedPaypalConfig =
          await this.companyPaypalConfigurationService.getPaypalConfigOrThrow(
            Number(configId)
          );

        // Create a success message and format the response.
        const message = 'Paypal Configuration Updated Successfully';
        const response = createConfigResponse(updatedPaypalConfig, message);

        // Send a success response with the updated configuration data (HTTP 200 OK).
        res.status(200).json(response);
      } else {
        // If no records were updated, send an error response (HTTP 500 Internal Server Error).
        res
          .status(500)
          .json({ message: 'Failed to update Paypal Configuration' });
      }
    } catch (err) {
      // Log the error for debugging purposes.
      Logger.error('Error in updatePaypalConfig:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves a list of PayPal configurations with pagination and sorting.
   *
   * @param req - The request object, containing information sent by the client.
   * @param res - The response object, used to send the server's response back to the client.
   * @param next - The next middleware function in the request-response cycle.
   */
  async paypalConfigList(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract the filter parameters, pagination options, and sorting details from the request.
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Extract the user ID and user role from the JWT payload (from the authenticated user).
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;

      // The service returns an object with 'rows' (the actual data) and 'count' (the total number of records).
      const { rows: events, count: total } =
        await this.companyPaypalConfigurationService.paypalConfigList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection,
          userId,
          userRole
        );

      const response = createPaginatedResponse(events, total, limit, offset);

      // Send a successful response with the paginated list of PayPal configurations (HTTP 200 OK).
      res.status(200).json(response);
    } catch (error) {
      // Log the error if something goes wrong during the request.
      Logger.error('Error in paypalConfigList:', error);
      handleError(next, error);
    }
  }
}
