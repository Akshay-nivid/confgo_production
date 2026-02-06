/**
 * @class AuthController
 * @description Controller class for handling HTTP requests related to Auth operations.
 *
 * @author : sarathavs
 */

import { Request, Response, NextFunction } from 'express';
import { DataService } from '../services/DataService';
import { handleError } from '../utils/error_util';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { JwtPayload } from 'jsonwebtoken';

export class DataController {
  private dataService = new DataService();

  /**
   * Handles the request to get all users.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getData(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const userId = (req.user as JwtPayload)?.id;
      // Apply base filters (e.g., only active users)
      const baseFilter = { userId: userId };

      // Combine base filters with provided filters
      const finalFilters = { ...baseFilter, ...filters };

      // Fetch users with applied filters, pagination, limit, and sorting
      const { rows: userData, count: total } =
        await this.dataService.getAllData(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(userData, total, limit, offset);

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }
}
