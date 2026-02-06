/**
 * @class VolunteerController
 * @description Controller class for handling HTTP requests related to volunteer operations.
 * @author Maneesh
 */

import { NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { VolunteerService } from '../services/VolunteerService';
import {
  extractVolunteerData,
  extractVolunteerEventData,
} from '../handlers/volunteer/volunteerRequestHandler';
import {
  createVolunteerEventSchema,
  createVolunteerSchema,
} from '../validators/volunteerValidator';
import {
  assignEventsToVolunteerResponse,
  createVolunteerResponse,
} from '../dtos/volunteer/AddVolunteerDTO';
import { Volunteer } from '../models/Volunteer';
import { UserService } from '../services/UserService';
import { VolunteerEvent } from '../models/VolunteerEvent';
import { extractListRequestData } from '../utils/request_util';
import { Op } from 'sequelize';
import { createPaginatedResponse } from '../utils/response_util';

export class VolunteerController {
  private volunteerService = new VolunteerService();
  private userService = new UserService();

  /**
   * Handles the request to add Volunteer.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async addVolunteer(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const companyId = await this.userService.getCompanyId(userId);
      const volunteerData = extractVolunteerData(req, createVolunteerSchema);

      if (!companyId) {
        throw new Error('Company information could not be verified');
      }

      const volunteer: Volunteer = await this.volunteerService.addVolunteer(
        volunteerData,
        companyId,
        Number(userId)
      );
      const response = createVolunteerResponse(volunteer);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error adding Volunteer:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to list volunteers
   * @param req - Express request object.
   * @param res  - Express response object.
   * @param next - Express next middleware function.
   */
  async getVolunteerList(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      let baseFilter;

      // Check if user is authenticated (token is present)
      const userId = (req.user as JwtPayload)?.id;

      if (userId) {
        // Fetch companyId associated with the user
        const companyId = await this.userService.getCompanyId(userId);

        if (companyId) {
          // If companyId is found, filter by companyId
          baseFilter = {
            [Op.or]: [{ companyId: companyId }],
          };
        }
      }

      // Merge any additional filters from the request
      const finalFilters = { ...baseFilter, ...filters };

      //giving limit 25
      const limit = 25;

      // Fetch filtered volunteers from the service
      const { rows: userData, count: total } =
        await this.volunteerService.getVolunteerList(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create paginated response
      const response = createPaginatedResponse(userData, total, limit, offset);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in retrieving volunteer list', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves volunteer events for the authenticated user.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next function for error handling.
   * @returns {Promise<Response | void>} - JSON response with volunteer events or error handling.
   */
  async getVolunteerEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req.user as JwtPayload)?.id;
      if (!userId) {
        return res
          .status(400)
          .json({ status: 'error', message: 'User ID is required' });
      }

      const data = await this.volunteerService.getVolunteerEvents(userId);

      return res.status(200).json({
        status: 'success',
        message: 'Volunteer events fetched successfully',
        data,
      });
    } catch (error) {
      next(error); // Pass error to the global error handler
    }
  }
}
