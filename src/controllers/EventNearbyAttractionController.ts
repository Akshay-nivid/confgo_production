/**
 * @author saneeshiv
 * @class EventNearbyAttractionController
 * @description Controller class for handling HTTP requests related to EventNearbyAttraction operations.
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import {
  extractEventNearbyAttractionData,
  extractUpdateNearbyAttractionData,
} from '../handlers/event/eventNearbyAttractionHandler';
import { EventNearbyAttractionService } from '../services/EventNearbyAttractionService';
import {
  createEventNearbyAttractionResponse,
  updateEventNearbyAttractionResponse,
} from '../dtos/event/EventNearbyAttractionDTO';
import {
  createEventNearbyAttractionSchema,
  updateEventNearbyAttractionSchema,
} from '../validators/event/eventNearbyAttractionValidator';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';

export class EventNearbyAttractionController {
  private eventNearbyAttractionService = new EventNearbyAttractionService();

  /**
   * Handles the request to create a new Event Nearby Attraction.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createNearbyAttraction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const nearbyData = extractEventNearbyAttractionData(
        req,
        createEventNearbyAttractionSchema
      );
      const nearbyAttraction =
        await this.eventNearbyAttractionService.createEventNearbyAttraction(
          nearbyData,
          Number(userId)
        );
      const response = createEventNearbyAttractionResponse(nearbyAttraction);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in createNearbyAttraction:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates an existing nearby attraction for an event.
   *
   * @param req - Express request object containing the user ID, nearby attraction ID, and update data
   * @param res - Express response object for sending back the result
   * @param next - Express next function for passing errors to the error handler
   */
  async updateNearbyAttraction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const eventNearbyAttractionId = Number(req.params.id);

      // Extract and validate the update data from the request body
      const nearbyAttractionData = extractUpdateNearbyAttractionData(
        req,
        updateEventNearbyAttractionSchema
      );

      // Call the service method to update the nearby attraction
      const nearbyAttraction =
        await this.eventNearbyAttractionService.updateEventNearbyAttraction(
          eventNearbyAttractionId,
          nearbyAttractionData,
          Number(userId)
        );

      // Generate and send a success response
      const response = updateEventNearbyAttractionResponse(nearbyAttraction);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in updateNearbyAttraction:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves a list of nearby attractions for events based on specified filters.
   *
   * @param req - Express request object containing query parameters for filtering and pagination
   * @param res - Express response object for sending back the result
   * @param next - Express next function for passing errors to the error handler
   */
  async getListEventNearbyAttraction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Call the service method to get nearby attractions with filters
      const { rows: attractions, count: total } =
        await this.eventNearbyAttractionService.listAllEventNearbyAttraction(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create a paginated response with the filtered events
      const response = createPaginatedResponse(
        attractions,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in getListEventNearbyAttraction:', error);
      handleError(next, error);
    }
  }
}
