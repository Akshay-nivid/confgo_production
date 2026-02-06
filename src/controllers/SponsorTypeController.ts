/**
 * @class SponsorTypeController
 * @description Controller class for handling HTTP requests related to Sponsor Type operations.
 * @author Nihal
 */

import { extractListRequestData } from '../utils/request_util';
import { Request, Response, NextFunction } from 'express';
import { createPaginatedResponse } from '../utils/response_util';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { SponsorTypeService } from '../services/SponsorTypeService';

export class SponsorTypeController {
  private sponsorTypeService = new SponsorTypeService();

  /**
   * Retrieves a paginated list of sponsor types based on provided filters and sorting criteria.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  async getSponsorTypeList(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Merge any additional filters from the request
      const finalFilters = { ...filters };

      //giving limit 25
      const limit = 25;

      // Fetch filtered roles from the service
      const { rows: data, count: total } =
        await this.sponsorTypeService.getRoleList(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create paginated response
      const response = createPaginatedResponse(data, total, limit, offset);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in retrieving role list', err);
      handleError(next, err);
    }
  }
}
