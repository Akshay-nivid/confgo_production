/**
 * @class SponsorController
 *
 * @description Controller class for handling HTTP requests related to Sponsor operations.
 * @author nihal
 */

import { Request, Response, NextFunction, response } from 'express';
import { Transaction } from 'sequelize';
import { sequelize } from '../models';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { SponsorService } from '../services/SponsorService';
import { JwtPayload } from 'jsonwebtoken';
import { enumRoll } from '../utils/enum';
import {
  extractSponsorAssignData,
  extractSponsorData,
  extractUpdateSponsorData,
} from '../handlers/sponsor/sponsorRequestHandler';
import {
  assignSponsorSchema,
  createSponsorSchema,
  updateSponsorSchema,
} from '../validators/sponsorValidator';
import {

  createAssignedSponsorResponse,
  createSponsorResponse,
  createUpdatedSponsorResponse,
} from '../dtos/sponsor/SponsorDTO';
import { extractListRequestData } from '../utils/request_util';
import { UserService } from '../services/UserService';
import { Sponsor } from '../models/Sponsor';
import { createPaginatedResponse } from '../utils/response_util';

export class SposnorController {
  private sponsorService = new SponsorService();

  /**
   * Handles the request to create a new Sponsor.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createSponsor(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      const { id: userId, userRole } = req.user as JwtPayload;
  
      // Validate user role
      if (userRole !== enumRoll.COMPANYADMIN) {
        const errorMessage = `Unauthorized Access: Only Company admin can perform this operation.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      // Extract and validate sponsor data
      const sponsorData = extractSponsorData(req, createSponsorSchema);
  
      // Create sponsor(s)
      const sponsors = await this.sponsorService.createSponsor(
        sponsorData,
        userId,
        transaction
      );
  
      // Commit transaction
      await transaction.commit();
  
      // Prepare and send response
      const response = createSponsorResponse(sponsors);
      return res.status(201).json(response);
    } catch (err) {
      // Rollback transaction and handle error
      await transaction.rollback();
      Logger.error('Error in creating sponsor:', err);
      handleError(next, err);
    }
  }
  

  /**
   * Handles the request to update a sponsor.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateSponsor(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Extract user ID and sponsor ID from the request
      const userId = (req.user as JwtPayload)?.id;
      const sponsorId = req.params?.id;

      // Extract sponsor data from the request and validate
      const sponsorData = extractUpdateSponsorData(req, updateSponsorSchema);

      // Update sponsor
      await this.sponsorService.updateSponsor(
        Number(sponsorId),
        sponsorData,
        userId,
        transaction
      );

      // Retrieve updated sponsor details
      const updatedSponsor = await this.sponsorService.getSponsorOrThrow(
        Number(sponsorId),
        transaction
      );

      const response = createUpdatedSponsorResponse(updatedSponsor);
      await transaction.commit();

      res.status(200).json(response);
    } catch (err) {
      await transaction.rollback();
      Logger.error('Error in updating sponsor:', err);
      handleError(next, err);
    }
  }

  /**
    * Handles the request to get all sponsors.
    * @param req - Express request object.
    * @param res - Express response object.
    * @param next - Express next middleware function.
    */
  async getAllSponsors(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, userRole } = req.user as JwtPayload;
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const { rows: sponsors, count: total } =
        await this.sponsorService.getAllSponsors(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection,
          userId
        );
      const response = createPaginatedResponse(sponsors, total, limit, offset);
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Filters the sponsor fields based on the requested fields.
   * @param sponsor - The sponsor object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered sponsor object.
   */
  private filterSponsorFields(sponsor: Sponsor) {
    return sponsor;
  }
    
  /**
   * Deletes a sponsor by ID and sends an appropriate response.
   *
   * @param req - The HTTP request object
   * @param res - The HTTP response object
   * @param next - The next middleware function
   */
  async deleteSponsor(req: Request, res: Response, next: NextFunction) {
    try {
      const sponsorId = Number(req.params.id);

      // Call service to delete the sponsor
      const isDeleted = await this.sponsorService.deleteSponsor(sponsorId);

      if (isDeleted) {
        res.status(200).json({
          status: 'success',
          message: 'Sponsor deleted successfully.',
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Failed to delete sponsor. Please try again.',
        });
      }
    } catch (err) {
      Logger.error('Error occurred while deleting sponsor:', err);
      handleError(next, err); // Delegate error handling to middleware
    }
  }
   /**
   * Handles the request to assign a new Sponsor to event or program or addon.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
   async assignSponsor(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
  
    try {
      const { id: userId, userRole } = req.user as JwtPayload;
  
      // Validate user role
      if (userRole !== enumRoll.COMPANYADMIN) {
        const errorMessage = `Unauthorized Access: Only Company admin can perform this operation.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      // Extract and validate sponsor data
      const sponsorData = extractSponsorAssignData(req, assignSponsorSchema);
  
      // Create sponsor(s)
      const sponsors = await this.sponsorService.assignSponsor(
        sponsorData,
        userId,
        transaction
      );
  
      // Commit transaction
      await transaction.commit();
  
      // Prepare and send response
      const response = createAssignedSponsorResponse(sponsors);
      return res.status(201).json(response);
    } catch (err) {
      // Rollback transaction and handle error
      await transaction.rollback();
      Logger.error('Error in assigning sponsor:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the removal of a sponsor from an event.
   *
   * @param req - The HTTP request object containing the sponsor ID in params.
   * @param res - The HTTP response object for sending the status and message.
   * @param next - The next middleware function in the Express chain.
   */
  async removeSponsorFromEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;

      // Attempt to remove the sponsor from the event
      const isDeleted = await this.sponsorService.removeSponsorFromEvent(
        Number(id)
      );

      // Send appropriate response based on the outcome
      if (isDeleted) {
        res.status(200).json({
          status: 'success',
          message: 'Sponsor removed successfully.',
        });
      } else {
        res.status(400).json({
          status: 'error',
          message: 'Failed to remove sponsor. Please try again.',
        });
      }
    } catch (err) {
      Logger.error('Error in removing sponsor from event:', err);
      handleError(next, err);
    }
  }
}
