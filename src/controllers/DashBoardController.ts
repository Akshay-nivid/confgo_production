/**
 * @class DashBoardController
 * @description Controller class for handling HTTP requests related to Dash Board operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { DashBoardService } from '../services/DashBoardService';
import {
  createAbstractCountResponse,
  createCountByEventResponse,
  createEventAndUserCountResponse,
  createVolunteerDashboardCountResponse,
} from '../dtos/dashBoard/DashBoardDTO';
import { extractRequestData, extractRevenueCountData } from '../handlers/dashboardCount/dashboardCountRequestHandler';
import { createRevenueCountSchema, fetchDahboardSchema } from '../validators/dashboardValidator';
import { enumRoll } from '../utils/enum';
import { create } from 'domain';

export class DashBoardController {
  private dashBoardService = new DashBoardService();

  /**
   * Handles the request to fetch published event count, total user count, and latest user count
   * @param req - Express Request Object
   * @param res - Express Response Object
   * @param next - Express Next Middleware function
   */
  async eventAndUserCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;
      const count = await this.dashBoardService.eventAndUserCount(
        userId,
        userRole
      );
      const response = createEventAndUserCountResponse(count);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error Fetching eventAndUser:', err);
      handleError(next, err);
    }
  }
  /**
   * Handles the request to fetch  total user count, and latest checkin count
   * @param req - Express Request Object
   * @param res - Express Response Object
   * @param next - Express Next Middleware function
   */
  async fetchVolunteerDashboardCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;
      const dashBoardData = extractRequestData(req, fetchDahboardSchema);
      //call service to fetch count values
      const count = await this.dashBoardService.volunteerDashboardCount(
        userId,
        userRole,
        dashBoardData
      );
      const response = createVolunteerDashboardCountResponse(count);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error Fetching fetchVolunteerDashboardCounts:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to fetch event-related statistics such as total registrations, check-ins, and amount collected.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The response object to send data back to the client.
   * @param {NextFunction} next - The next middleware function for error handling.
   */
  async countByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = (req.user as JwtPayload)?.userRole;
      if (userRole !== enumRoll.COMPANYADMIN) {
        const errorMessage = `Unauthorized access: Only COMPANYADMIN can access these details.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      const eventData = extractRequestData(req, fetchDahboardSchema);
      const count = await this.dashBoardService.countByEvent(eventData.eventId);
      const response = createCountByEventResponse(count);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error Fetching countByEvent:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the retrieval of abstract counts for a reviewer.
   *
   * @param req - Express request object containing the user's JWT payload.
   * @param res - Express response object for sending the response.
   * @param next - Express NextFunction for passing errors to middleware.
   */
  async abstractCountForReviewer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;

      const count = await this.dashBoardService.abstractCountForReviewer(
        userId,
        userRole
      );
      const response = createAbstractCountResponse(count);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error abstractCountForReviewer:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves the total revenue for the company associated with the logged-in user.
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function for error handling
   * @returns JSON response with company revenue
   */
  async companyRevenueCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const reqData = extractRevenueCountData(req, createRevenueCountSchema);
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const data =
        await this.dashBoardService.companyRevenueCount(userId, reqData);

      return res.status(200).json({
        status: 'success',
        message: 'Company revenue fetched successfully',
        data,
      });
    } catch (error) {
      Logger.error('Error in companyRevenueCount:', error);
      handleError(next, error);
    }
  }
}
