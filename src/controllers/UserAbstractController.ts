/**
 * @class UserAbstractController
 * @description Controller class for handling HTTP requests related to User Abstract  operations.
 * @author nihal
 */

import { Transaction } from 'sequelize';
import { UserAbstractService } from '../services/UserAbstractService';
import { sequelize } from './../models/index';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import {
  AssignReviewerResponse,
  createAbstractFileResponse,
  createUserAbtrsactResponse,
  updateUserAbstractResponse,
} from '../dtos/userAbstract/userAbstractDTO';
import {
  extractAssignReviewerData,
  extractCreateUserAbstractData,
  extractUpdateUserAbstractData,
} from '../handlers/abstract/userAbstractRequestHandler';
import {
  assignReviewerSchema,
  createUserAbstractSchema,
  updateUserAbstractSchema,
} from '../validators/userAbstractValidator';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { UserAbstract } from '../models/UserAbstract';
import { UserAbstractStatus } from '../models/UserAbstractStatus';
import { EventService } from '../services/EventService';
import { enumRoll } from '../utils/enum';

export class UserAbstractController {
  private userAbstractService = new UserAbstractService();
  private eventService = new EventService();

  /**
   * Handles the request to add a user abstract file.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async addUserAbstract(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const { eventId, assetId } = extractCreateUserAbstractData(
        req,
        createUserAbstractSchema
      );

      //check if the abstract submission deadline has passed
      const eventDetails = await this.eventService.getEventDetailById(eventId);
      const abstractDeadline = eventDetails?.event?.dataValues?.abstractDate;
      if (abstractDeadline) {
        const deadlineDate = new Date(abstractDeadline);
        deadlineDate.setHours(23, 59, 59, 999);
        const currentDate = new Date();
        if (currentDate > deadlineDate) {
          throw new Error('The abstract submission deadline has passed.');
        }
      }

      const abstractFile = await this.userAbstractService.addUserAbstract(
        Number(eventId),
        assetId,
        userId
      );
      const response = createAbstractFileResponse(abstractFile);
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error addUserAbstract:', error);
      handleError(next, error); // Handle error and propagate it to the next middleware
    }
  }
  /**
   * Handles the update operation for a user abstract record.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns - Sends a response or passes an error to the next middleware.
   */
  async updateUserAbstract(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userAbstractId = req.params?.id;

      // Extract and validate the user abstract data from the request using a schema
      const userAbstractData = extractUpdateUserAbstractData(
        req,
        updateUserAbstractSchema
      );

      // Create a modified abstract data object with additional
      const modifiedAbstractData = {
        ...userAbstractData,
        modifiedBy: userId,
        modifiedOn: new Date(),
      };

      // Update the user abstract in the database with the modified data
      await this.userAbstractService.updateUserAbstract(
        Number(userAbstractId),
        modifiedAbstractData,
        transaction
      );
     

      // Retrieve the updated user abstract details for the response
      const updatedUserAbstract =
        await this.userAbstractService.getAbstractOrThrow(
          Number(userAbstractId)
        );
        await transaction.commit();
      // Format the response with the updated abstract details
      const response = updateUserAbstractResponse(updatedUserAbstract);
      res.status(200).json(response);
    } catch (err) {
      transaction.rollback();
      handleError(next, err);
    }
  }

  /**
   * Retrieves a paginated list of user abstracts based on provided filters, s    orting, and pagination options.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {Promise<void>} - Sends a paginated response containing the filtered and sorted list of user abstracts.
   */
  async getAbstractList(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      if (!userId) {
        throw new Error('User authentication failed.');
      }
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const finalFilters = { ...filters };

      // Fetch the list of user abstracts and the total count from the service
      const { rows: abstracts, count: total } =
        await this.userAbstractService.userAbstractList(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Filter each abstract to return only the required fields
      const filteredAbstracts = abstracts.map((abstract: UserAbstract) =>
        this.filterAbstractFields(abstract)
      );

      // Create a paginated response with the abstracts.
      const response = createPaginatedResponse(
        filteredAbstracts,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getAbstractList:', error);
      handleError(next, error);
    }
  }
  /**
   * Filters the user abstract fields based on the requested fields.
   * @param user abstract - The user abstract object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered user abstract object.
   */
  private filterAbstractFields(abstract: UserAbstract) {
    return abstract;
  }

  /**
   * Handles the request to fetch a user abstract file by id.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getUserAbstractById(req: Request, res: Response, next: NextFunction) {
    try {
      const abstractId = req.params.id;
      const abstractDetails =
        await this.userAbstractService.getUserAbstractById(Number(abstractId));
      if (abstractDetails) {
        const response = createUserAbtrsactResponse(abstractDetails);
        res.status(200).json(response);
      } else {
        res.status(400).json('Abstract file not found');
      }
    } catch (error) {
      Logger.error('Error getUserAbstractById:', error);
      handleError(next, error);
    }
  }

  /**
   * Controller to assign a reviewer to multiple abstracts.
   * @param {Request} req - The HTTP request object containing the reviewer ID and list of abstracts.
   * @param {Response} res - The HTTP response object used to send the response back to the client.
   * @param {NextFunction} next - The next middleware function in the stack to handle errors or pass control.
   */
  async assignReviewer(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      if (!userId) {
        throw new Error('User authentication failed.');
      }
      const userRole = (req.user as JwtPayload)?.userRole;
      if (userRole !== enumRoll.COMPANYADMIN) {
        throw new Error(
          "Access Denied: You don't have permission to perform this action."
        );
      }
      // Extract the list of abstracts and the reviewer ID from the request
      const { abstracts, reviewerId } = extractAssignReviewerData(
        req,
        assignReviewerSchema
      );

      // Assign the reviewer to the abstracts and get the updated abstracts
      const updatedAbstracts =
        await this.userAbstractService.assignReviewerToAbstracts(
          abstracts,
          reviewerId,
          userId,
          transaction
        );

      transaction.commit();
      const response = AssignReviewerResponse(updatedAbstracts);
      res.status(200).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error assignReviewer:', err);
      handleError(next, err);
    }
  }


   /**
     * Handles the request to list userAbstract statuses.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    async listUserAbstractStatus(req: Request, res: Response, next: NextFunction) {
      try {
        // Extract pagination and sorting data from the request
        const { limit, offset, sortBy, sortDirection } =
          extractListRequestData(req);
  
        // Fetch the list of userAbstract statuses with pagination and sorting
        const { rows: eventStatuses, count: total } =
          await this.userAbstractService.getAbstractStatusList(
            limit,
            offset,
            sortBy,
            sortDirection
          );
  
        const filteredEventStatuses = eventStatuses.map(
          (abstractStatus: UserAbstractStatus) => this.filterAbstractStatusFields(abstractStatus)
        );
  
        // Create a paginated response
        const response = createPaginatedResponse(
          filteredEventStatuses,
          total,
          limit,
          offset
        );
  
        // Send the successful response
        res.status(200).json(response);
      } catch (err) {
        Logger.error('Error listing UserAbstract Status:', err);
        handleError(next, err); // Ensure the error is passed to the error handler
      }
    }

      /**
       * Filters the abstract status fields based on the requested fields.
       * @param abstractStatus - The abstract status object to filter.
       * @param fields - Array of fields to include in the response.
       * @returns The filtered abstract status object.
       */
      private filterAbstractStatusFields(abstractStatus: UserAbstractStatus) {
        return abstractStatus;
      }
  
}
