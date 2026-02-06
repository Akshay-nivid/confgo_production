import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import {
  extractEventId,
  extractEventProgramData,
  extractEventSpeakerBioData,
  extractStatusData,
  extractUpdateEventProgramData,
  extractUpdateEventSpeakerBioData,
} from '../handlers/event/eventProgramRequestHandler';
import {
  createEventProgramSchema,
  createSpeakerBioSchema,
  fetchEventIdSchema,
  statusValidatorSchema,
  updateEventProgramSchema,
  updateSpeakerBioSchema,
} from '../validators/eventProgramValidator';
import { EventProgramService } from '../services/eventProgramService';
import {
  assignEventSpeakerBioResponse,
  assignEventSpeakerResponse,
  EventSpeakerResponseDTO,
  getProgramResponse,
  updateEventProgramResponse,
} from '../dtos/event/EventProgramDTO';
import { extractListRequestData } from '../utils/request_util';
import { enumEventProgramStatus } from '../utils/enum';
import { createPaginatedResponse } from '../utils/response_util';

import { getStatusByNameResponse } from '../dtos/event/EventProgramDTO';
import { EventSpeaker } from '../models/EventSpeaker';
import { JwtPayload } from 'jsonwebtoken';

export class EventSpeakerController {
  private eventProgramService = new EventProgramService();

  /**
   * Creates a new event program based on the provided request data.
   * @param req -containing event program data.
   * @param res -object used to send the response back .
   * @param next -The next middleware function in the stack, used for error handling.
   */
  async createEventSpeaker(req: Request, res: Response, next: NextFunction) {
    try {
      const programData = extractEventProgramData(
        req,
        createEventProgramSchema
      );

      const event =
        await this.eventProgramService.createEventSpeaker(programData);
      const response = assignEventSpeakerResponse(event);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating Event Program:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }
    /**
   * Creates a new event speaker bio based on the provided request data.
   * @param req -containing event program data.
   * @param res -object used to send the response back .
   * @param next -The next middleware function in the stack, used for error handling.
   */
    async createEventSpeakerBio(req: Request, res: Response, next: NextFunction) {
      try {
        const { id: userId } = req.user as JwtPayload;
        const programData = extractEventSpeakerBioData(
          req,
          createSpeakerBioSchema
        );
  
        const event =await this.eventProgramService.createEventSpeakerBio(programData,userId);
        const response = assignEventSpeakerBioResponse(event);
        res.status(201).json(response);
      } catch (err) {
        Logger.error('Error creating Event Speaker Bio:', err);
        handleError(next, err); // Ensure a valid error object is passed
      }
    }
    /**
     * Update a new event speaker bio based on the provided request data.
     * @param req -containing event program data.
     * @param res -object used to send the response back .
     * @param next -The next middleware function in the stack, used for error handling.
     */
        async updateEventSpeakerBio(req: Request, res: Response, next: NextFunction) {
          try {
            const { id: userId } = req.user as JwtPayload;
            const bioId = req.params?.id;
            const programData = extractUpdateEventSpeakerBioData(
              req,
              updateSpeakerBioSchema
            );
      
            const [updatedCount,speakerBio] =await this.eventProgramService.updateEventSpeakerBio(programData, Number(bioId),userId);
            //const response = assignEventSpeakerBioResponse(event);
            if (updatedCount > 0) {
              res.status(200).json(speakerBio);
            }
            else{
              res.status(500).json({ message: 'Failed to update details' });
            }
          } catch (err) {
            Logger.error('Error updating Event Speaker Bio:', err);
            handleError(next, err); // Ensure a valid error object is passed
          }
        }
  /**
   * Retrieves all event programs based on the request data, including filters, pagination, and sorting.
   * @param req - Request object containing filters, pagination, and sorting parameters.
   * @param res -Response object used to send the response back.
   * @param next - The next middleware function for handling errors.
   */
  async getAllEventPrograms(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const baseFilter = { statusId: enumEventProgramStatus.ACTIVE };
      const finalFilters = { ...baseFilter, ...filters };
      const { rows: eventPrograms, count: total } =
        await this.eventProgramService.getAllEventProgram(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      const filteredEventProgram = eventPrograms.map(
        (eventProgram: EventSpeaker) =>
          this.filterEventProgramFields(eventProgram)
      );
      const response = createPaginatedResponse(
        filteredEventProgram,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getAllEventProgram:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the event program fields based on the requested fields.
   * @param eventProgram - The eventProgram object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered eventProgram object.
   */
  private filterEventProgramFields(eventProgram: EventSpeaker) {
    return eventProgram;
  }

  /**
   * Handles the request to list event program statuses, applying filters, pagination, and sorting.
   * @param req - containing query parameters for filters, pagination, and sorting.
   * @param res -used to return the filtered and paginated list of event program statuses.
   * @param next - The next middleware function in the Express.js route handler chain.
   */
  async listEventProgramStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const finalFilters = { ...filters };
      const { rows: userData, count: total } =
        await this.eventProgramService.getEventProgramStatusList(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      const response = createPaginatedResponse(userData, total, limit, offset);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error listing event program Status:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }
  /**
   * Handles fetching the event program status by name.
   * @param req - The request object containing the incoming request
   * @param res - The response object used to send the response
   * @param next - The next middleware function for error handling
   * @returns - Returns a JSON response with the event program status or an error message
   */
  async getEventProgramStatusByName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract and validate incoming request data using the provided schema
      const data = extractStatusData(req, statusValidatorSchema);
      const result =
        await this.eventProgramService.getEventProgramStatusByName(data);

      // Check if the result is null (i.e., no token status found)
      if (!result) {
        return res
          .status(404)
          .json({ status: 'error', message: 'status not found' });
      }

      const response = getStatusByNameResponse(result);

      res.status(200).json(response);
    } catch (err) {
      // Log the error and pass it to the error handler middleware
      Logger.error('Error in getTokenStatusByName:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves an event program by its ID.
   * @param req - which contains the parameters sent from the client.
   * @param res - used to send a response back to the client.
   * @param next - The next middleware function, used for error handling.
   */
  async getEventProgramById(req: Request, res: Response, next: NextFunction) {
    try {
      const programId = req.params?.id;
      const program = await this.eventProgramService.getProgramById(
        Number(programId)
      );
      if (program) {
        const response = getProgramResponse(program as EventSpeakerResponseDTO);
        res.status(200).json(response);
      } else {
        res.status(404).json({ status: 'error', message: 'Speaker not found' });
      }
    } catch (error) {
      Logger.error(' Error getEventProgramById:', error);
      handleError(next, error);
    }
  }

  /**
   * Updates an event speaker based on the provided data and ID
   * @param req - The incoming request containing the event program data to update.
   *                        It should have the program `id` in the URL parameters and the update
   *                        data in the request body.
   * @param res - The response object to send back the updated event program or an error message.
   * @param next - The next middleware to handle errors if they occur during execution.
   */
  async updateEventSpeaker(req: Request, res: Response, next: NextFunction) {
    try {
      const eventProgramData = extractUpdateEventProgramData(
        req,
        updateEventProgramSchema
      );
      const id = req.params?.id;

      const [updatedata] = await this.eventProgramService.updateEventSpeaker(
        Number(id),
        eventProgramData
      );

      if (updatedata > 0) {
        const updatedata = await this.eventProgramService.getProgramOrThrow(
          Number(id)
        );

        const response = updateEventProgramResponse(
          updatedata as unknown as EventSpeakerResponseDTO
        );
        res.status(200).json(response);
      } else {
        res.status(500).json({ message: 'Failed to update event speaker' });
      }
    } catch (err) {
      Logger.error('Error Update Event speaker:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to delete a program schedule by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async deleteProgramSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const programScheduleId = req.params?.id;
      const deleted = await this.eventProgramService.deleteProgramSchedule(
        Number(programScheduleId)
      );
      if (deleted) {
        const response = {
          status: 'success',
          data: null,
          message: 'Event Speaker deleted.',
        };
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Program Schedule not found' });
      }
    } catch (err) {
      Logger.error('Error deleteProgramSchedule:', err);
      handleError(next, err);
    }
  }

  /**
   * Controller method to handle retrieving the events assigned to a speaker.
   *
   * @param req - The request object, which contains information about the HTTP request.
   * @param res - The response object, used to send the response back to the client.
   * @param next - The next function, used for passing control to the next middleware in case of an error.
   */
  async speakerAssignedEventsList(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      const userId = (req.user as JwtPayload)?.id;

      // Fetch the list of events with pagination, sorting, and filtering
      const { rows: events, count: total } =
        await this.eventProgramService.speakerAssignedEventsList(
          limit,
          offset,
          sortBy,
          sortDirection,
          userId
        );

      // Create a paginated response with the filtered events
      const response = createPaginatedResponse(events, total, limit, offset);

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error getSpeakerAssignedEvents:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the HTTP request to fetch the list of speaker details.
   *
   * @param req - The Express request object containing the query parameters and request data.
   * @param res - The Express response object used to send the response.
   * @param next - The Express next function used to pass control to the next middleware or error handler.
   */
  async speakerDetailsList(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Call the service method to get the speaker details based on the extracted parameters
      const speakers = await this.eventProgramService.speakerDetailsList(
        filters,
        limit,
        offset,
        sortBy,
        sortDirection
      );

      // Create the paginated response with the fetched speaker details and pagination info
      const response = createPaginatedResponse(
        speakers.rows,
        speakers.count,
        limit,
        offset
      );

      // Send the paginated response back to the client with a 200 status code
      res.status(200).json(response);
    } catch (err) {
      // Log the error if something goes wrong during the process
      Logger.error('Error in speakerDetailsList:', err);
      handleError(next, err);
    }
  }
}
