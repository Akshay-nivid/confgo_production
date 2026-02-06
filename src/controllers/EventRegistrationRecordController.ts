import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { EventRegistrationRecordService } from '../services/EventRegistrationRecordService';
import {
  extractRegistrationRecordData,
  extractUpdateParticipantRecordData,
} from '../handlers/eventRegistrationRecord/eventRegistrationRecordRequestHandler';
import { createRegistrationRecordSchema } from '../validators/eventRegistrationRecordValidator';
import { createEventRegistrationRecordResponse } from '../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';
import { JwtPayload } from 'jsonwebtoken';
import { extractUpdateRecordData } from '../handlers/eventRegistrationRecord/eventRegistrationRecordRequestHandler';
import {
  updateEventRegistrationRecordSchema,
  updateRegistrationRecordParticipantSchema,
} from '../validators/event/eventRegistrationRecordValidator';
import {
  updateEventRegistrationRecordResponse,
  UpdateEventRegistrationRecordResponseDTO,
} from '../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';
import { extractListRequestData } from '../utils/request_util';
import { EventRegistrationRecord } from '../models/EventRegistrationRecord';
import { createPaginatedResponse } from '../utils/response_util';

export class EventRegistrationRecordController {
  private eventRegistrationRecordService = new EventRegistrationRecordService();

  /**
   * Handles the creation of an event registration record.
   * @param req - Express Request object, expects JWT token with user information.
   * @param res - Express Response object for sending JSON response.
   * @param next - Express NextFunction for error handling middleware.
   */
  async createEventRegistrationRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Retrieve user ID from JWT payload attached to request
      const userId = (req.user as JwtPayload)?.id;

      // Extract and validate registration data from request body using Joi schema
      const RegistrationRecordData = extractRegistrationRecordData(
        req,
        createRegistrationRecordSchema
      );

      // Create registration record via service method, passing validated data and user ID
      const registrationRecord =
        await this.eventRegistrationRecordService.createEventRegistrationRecord(
          RegistrationRecordData,
          Number(userId)
        );

      // Format response data and send response
      const response = createEventRegistrationRecordResponse(
        registrationRecord as EventRegistrationRecord[]
      );
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating Event Registration Record:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates an event registration record by ID with the provided data.
   * @param req - containing parameters and body data.
   * @param res - used to send back the JSON response.
   * @param next - for passing control to error handling middleware.
   *
   */
  async updateEventRegistrationRecord(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const recordData = extractUpdateRecordData(
        req,
        updateEventRegistrationRecordSchema
      );
      const id = req.params?.id;

      const [updatedCount] =
        await this.eventRegistrationRecordService.updateEventRegistrationRecord(
          Number(id),
          recordData
        );

      if (updatedCount > 0) {
        const updatedData =
          await this.eventRegistrationRecordService.getRecordOrThrow(
            Number(id)
          );

        const response = updateEventRegistrationRecordResponse(
          updatedData as UpdateEventRegistrationRecordResponseDTO
        );

        res.status(200).json(response);
      } else {
        res.status(500).json({ message: 'Failed to update coupon' });
      }
    } catch (err) {
      Logger.error('Error updateEventRegistrationRecord:', err);
      handleError(next, err);
    }
  }

  /**
   * To update the participandid coloumn in event registration record.
   * @param req - The HTTP request object, containing user data and request parameters.
   * @param res - The HTTP response object, used to send the response back to the client.
   * @param next - The middleware next function for handling errors.
   */

  async updateEventRegistrationRecordParticipantId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const recordData = extractUpdateParticipantRecordData(
        req,
        updateRegistrationRecordParticipantSchema
      );

      const id = Number(req.params?.id);
      const [updatedCount] =
        await this.eventRegistrationRecordService.updateRegistrationRecordParticipant(
          userId,
          id,
          recordData
        );

      if (updatedCount > 0) {
        const updatedData =
          await this.eventRegistrationRecordService.getRecordOrThrow(
            Number(id)
          );

        const response = updateEventRegistrationRecordResponse(
          updatedData as UpdateEventRegistrationRecordResponseDTO
        );

        res.status(200).json(response);
      } else {
        res.status(500).json({
          message: 'Failed to update participant in event registration record',
        });
      }
    } catch (err) {
      Logger.error('Error updateEventRegistrationRecord:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves all event registration records with optional filters, pagination, and sorting.
   * @param req - containing query parameters such as filters, limit, offset, sortBy, and sortDirection.
   * @param res - used to send the JSON response with paginated event registration records.
   * @param next  - The next middleware function in the Express pipeline, used for error handling.
   */
  async getAllRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const finalFilters = { ...filters };
      const { rows: records, count: total } =
        await this.eventRegistrationRecordService.getAllRecords(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredCoupons = records.map((record: EventRegistrationRecord) =>
        this.filterRecordFields(record)
      );
      const response = createPaginatedResponse(
        filteredCoupons,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getAllRecords:', error);
      handleError(next, error);
    }
  }

  private filterRecordFields(record: EventRegistrationRecord) {
    return record;
  }
}
