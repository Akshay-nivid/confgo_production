import { handleError } from '../utils/error_util';
import { Request, Response, NextFunction } from 'express';
import { PlanService } from '../services/PlanService';
import { extractListRequestData } from '../utils/request_util';
import { Plan } from '../models/init-models';
import { createPaginatedResponse } from '../utils/response_util';
import { extractPlanLisFiltertData } from '../handlers/plan/planRequestHandler';
/**
 * @author saneeshiv
 * @class PlanController
 * @description
 */

export class PlanController {
  private planService = new PlanService();

  /**
   * Handles the request to list all plan.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllPlan(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const extractedFilter = extractPlanLisFiltertData(req);

      // Fetch plans with applied filters, pagination, limit, and sorting
      const { rows: plans, count: total } = await this.planService.getAllPlans(
        extractedFilter,
        limit,
        offset,
        sortBy,
        sortDirection
      );

      // Optionally filter the response fields
      const filteredPlans = plans.map((plan: Plan) =>
        this.filterPlanFields(plan)
      );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        filteredPlans,
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

  /**
   * Filters the plan fields based on the requested fields.
   * @param plan - The plan object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered plan object.
   */
  private filterPlanFields(plan: Plan) {
    return plan;
  }
}
