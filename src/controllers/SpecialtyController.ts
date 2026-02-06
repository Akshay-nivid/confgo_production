import { handleError } from '../utils/error_util';
import { Request, Response, NextFunction } from 'express';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { SpecialtyService } from '../services/SpecialtyService';
/**
 * @class SpecialtyController
 * @description
 */

export class SpecialtyController {
  private specialtyService = new SpecialtyService();

  /**
   * Handles the request to list all specialties.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Fetch specialties with applied filters, pagination, limit, and sorting
      const { rows: plans, count: total } = await this.specialtyService.getAllSpecialties(
        limit,
        offset,
        sortBy,
        sortDirection
      );

    
      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        plans,
        total,
        limit,
        offset
      );

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

}
