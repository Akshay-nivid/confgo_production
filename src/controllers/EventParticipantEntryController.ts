/**
 * @class EventParticipantEntryController
 * @description Controller class for handling HTTP requests related to Event Participant Entry operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { EventParticipantEntryService } from '../services/EventParticipantEntryService';
import {
  createEventParticipantResponse,
  EntryResponseDTO,
  updateEntryResponse,
} from '../dtos/event/EventParticipantEntryDTO';
import {
  extractEventParticipantData,
  extractUpdateEventParticipantData,
} from '../handlers/event/eventParticipantEntryRequestHandler';
import {
  addEventParticipantSchema,
  updateEventParticipantSchema,
} from '../validators/event/eventParticipantEntryValidator';
import { JwtPayload } from 'jsonwebtoken';
import { extractListRequestData } from '../utils/request_util';
import { EventParticipantEntry } from '../models/EventParticipantEntry';
import { createPaginatedResponse } from '../utils/response_util';

export class EventParticipantEntryController {
  private eventParticipantEntryService = new EventParticipantEntryService();

  /**
   * Handles the request to add Event Participant Entry.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async addEventParticipantEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const eventParticipantData = extractEventParticipantData(
        req,
        addEventParticipantSchema
      );
      const event = await this.eventParticipantEntryService.addEventParticipant(
        eventParticipantData,
        Number(userId)
      );
      const response = createEventParticipantResponse(event);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error adding Event Participant:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles the request to update an existing Event Participant Entry.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateParticipantEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const eventParticipantData = extractUpdateEventParticipantData(
        req,
        updateEventParticipantSchema
      );
      const participantEntryId = req.params?.id;

      const [updatedCount] =
        await this.eventParticipantEntryService.updateEventParticipant(
          Number(participantEntryId),
          eventParticipantData,
          Number(userId)
        );

      if (updatedCount > 0) {
        const updatedEntry =
          await this.eventParticipantEntryService.getParticipantEntryOrThrow(
            Number(participantEntryId)
          );

        const response = updateEntryResponse(updatedEntry as EntryResponseDTO);

        res.status(200).json(response);
      } else {
        res.status(500).json({ message: 'Failed to update Participant Entry' });
      }
    } catch (err) {
      Logger.error('Error updateParticipantEntry:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to list event participant entry list.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async listEventParticipantEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract pagination and sorting data from the request
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Fetch the list of event participant entry with pagination and sorting
      const { rows: eventStatuses, count: total } =
        await this.eventParticipantEntryService.getEventParticipantEntryList(
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Optionally, process event participant entry if additional transformations or field filtering are required
      const filteredEventStatuses = eventStatuses.map(
        (participantEntry: EventParticipantEntry) =>
          this.filterParticipantEntryFields(participantEntry) // Adjust this method to suit your filtering needs
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
      Logger.error('Error listing Event Status:', err);
      handleError(next, err); // Ensure the error is passed to the error handler
    }
  }

  /**
   * Filters the event participant entry fields based on the requested fields.
   * @param participantEntry - The participant entry object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered event participant entry object.
   */
  private filterParticipantEntryFields(
    participantEntry: EventParticipantEntry
  ) {
    return participantEntry;
  }
}
