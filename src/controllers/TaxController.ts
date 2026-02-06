/**
 * @class TaxController
 *
 * @description Controller class for handling HTTP requests related to tax operations.
 * @author Neethu
 */

import { Request, Response, NextFunction, response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import { enumRoll } from '../utils/enum';
import { createTaxSchema, updateTaxSchema } from '../validators/tax';
import { extractTaxData } from '../handlers/tax/taxRequestHandler';
import { TaxService } from '../services/TaxService';
import { createTaxResponse, createUpdatedTaxResponse } from '../dtos/tax/TaxDTO';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';

export class TaxController {
  private taxService = new TaxService();

  /**
   * Handles the request to create company Tax.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createCompanyTax(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      const { id: userId, userRole } = req.user as JwtPayload;
  
      // Validate user role
      if (userRole !== enumRoll.COMPANYADMIN) {
        const errorMessage = `Unauthorized Access: Only Company admin can perform this operation.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      // Extract and validate tax data
      const data = extractTaxData(req, createTaxSchema);
  
      // Create tax(s)
      const taxResult = await this.taxService.createTax(
        data,
        userId,
        transaction
      );
  
      // Commit transaction
      await transaction.commit();
  
      // Prepare and send response
      const response = createTaxResponse(taxResult);
      return res.status(201).json(response);
    } catch (err) {
      // Rollback transaction and handle error
      await transaction.rollback();
      Logger.error('Error in creating tax:', err);
      handleError(next, err);
    }
  }
  
    /**
    * Handles the request to get all tax.
    * @param req - Express request object.
    * @param res - Express response object.
    * @param next - Express next middleware function.
    */
    async getAllTaxes(req: Request, res: Response, next: NextFunction) {
      try {
        const { id: userId, userRole } = req.user as JwtPayload;
        const { filters, limit, offset, sortBy, sortDirection } =
          extractListRequestData(req);
        const { rows: result, count: total } =
          await this.taxService.getList(
            filters,
            limit,
            offset,
            sortBy,
            sortDirection,
            userId
          );
        const response = createPaginatedResponse(result, total, limit, offset);
        res.status(200).json(response);
      } catch (error) {
        handleError(next, error);
      }
    }

  /**
   * Handles the request to update a tax.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateTax(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Extract tax from the request
      const userId = (req.user as JwtPayload)?.id;
      const taxId = req.params?.id;

      // Extract tax data from the request and validate
     // Extract and validate tax data
     const data = extractTaxData(req, updateTaxSchema);
      // Update tax
      await this.taxService.updateTax(
        Number(taxId),
        data,
        userId,
        transaction
      );

      // Retrieve updated tax details
      const updatedData = await this.taxService.getTax(
        Number(taxId),
        transaction
      );

      const response = createUpdatedTaxResponse(updatedData);
      await transaction.commit();

      res.status(200).json(response);
    } catch (err) {
      await transaction.rollback();
      Logger.error('Error in updating tax:', err);
      handleError(next, err);
    }
  }
  
}
