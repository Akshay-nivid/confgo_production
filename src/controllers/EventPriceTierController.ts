/**
 * @class EventPriceTierController
 * @description Controller class for handling HTTP requests related to Event price tier operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { EventPriceTierService } from '../services/EventPriceTierService';
import {
  extractPriceTierData,
  extractPriceTierUpdateData,
} from '../handlers/event/eventPriceTierRequestHandler';
import {
  createPriceTierSchema,
  updatePriceTierSchema,
} from '../validators/event/eventPriceTierValidator';
import {
  createEventPriceTierResponse,
  updateEventPriceTierResponse,
} from '../dtos/event/EventPriceTierDTO';
import { extractListRequestData } from '../utils/request_util';
import { Transaction } from 'sequelize';
import { EventPriceTier } from '../models/EventPriceTier';
import { createPaginatedResponse } from '../utils/response_util';
import { sequelize } from '../models';

export class EventPriceTierController {
  private eventPriceTierService = new EventPriceTierService();

  /**
   * Handles the request to create a new Event Price Tier.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createPriceTier(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const priceTierData = extractPriceTierData(req, createPriceTierSchema);
      const eventPriceTier =
        await this.eventPriceTierService.removeAndcreatePriceTier(
          priceTierData,
          Number(userId),
          transaction
        );
      transaction.commit();
      const response = createEventPriceTierResponse(eventPriceTier);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in createPriceTier:', err);
      transaction.rollback();
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Controller method to handle the creation or replacement of event price tiers.
   *
   * This method performs the following:
   * 1. Starts a database transaction to ensure atomicity.
   * 2. Extracts and validates price tier data from the request using a schema.
   * 3. Calls the service to delete existing price tiers for the event and create new ones.
   * 4. Formats the response and sends it back to the client with a 201 status code.
   * 5. Rolls back the transaction and handles errors if any step fails.
   *
   * @param req - The HTTP request object containing the input data for creating or updating price tiers.
   * @param res - The HTTP response object used to send the response back to the client.
   * @param next - The next middleware function to handle errors.
   */
  async removeAndCreatePriceTier(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      //fetching eventId from params
      const eventId = Number(req.params.eventId);
      req.body.eventId = eventId;

      const priceTierData = extractPriceTierData(req, createPriceTierSchema);

      const eventPriceTier =
        await this.eventPriceTierService.removeAndcreatePriceTier(
          priceTierData,
          Number(userId),
          transaction
        );
      transaction.commit();
      const response = createEventPriceTierResponse(eventPriceTier);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in removeAndcreatePriceTier:', err);
      transaction.rollback();
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Updates the information of an event price tier.
   * @param req - The request object containing event price tier data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async updatePriceTier(req: Request, res: Response, next: NextFunction) {
    try {
      //fetching event price tier id from params
      const priceTierId = Number(req.params.id);

      //fetching user id from token
      const userId = (req.user as JwtPayload)?.id;
      const priceTierData = extractPriceTierUpdateData(
        req,
        updatePriceTierSchema
      );

      //updating with given details
      await this.eventPriceTierService.updatePriceTier(
        priceTierData,
        Number(userId),
        priceTierId
      );

      //fetching event price tier details with event price tier id and giving to create response.
      const priceTierDetails =
        await this.eventPriceTierService.getPriceTierOrThrow(priceTierId);
      const response = updateEventPriceTierResponse(priceTierDetails);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error Updating Event Price Tier:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Retrieves all event price tier based on the request data, including filters, pagination, and sorting.
   * @param req - Request object containing filters, pagination, and sorting parameters.
   * @param res -Response object used to send the response back.
   * @param next - The next middleware function for handling errors.
   */
  async priceTierList(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract request data for filtering, pagination, and sorting
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const limit = 100;
      // Fetch participant types with pagination, sorting, and filtering
      const { rows: priceTiers, count: total } =
        await this.eventPriceTierService.priceTierList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Filter the fields of each price tier
      const filteredParticipantTypes = priceTiers.map(
        (priceTier: EventPriceTier) => this.filterpriceTierFields(priceTier)
      );

      // Create a paginated response with the filtered participant types
      const response = createPaginatedResponse(
        filteredParticipantTypes,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      // Log and handle any errors
      Logger.error('Error priceTierList:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the price tier fields based on the requested fields.
   * @param priceTier - The priceTier object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered eventProgram object.
   */
  private filterpriceTierFields(priceTier: EventPriceTier) {
    return priceTier;
  }
}
