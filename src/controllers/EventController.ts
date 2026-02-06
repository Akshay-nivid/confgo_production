import { Utils } from './../utils/Utils';
/**
 * @class EventController
 * @description Controller class for handling HTTP requests related to Event operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/EventService';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import {
  extractEventData,
  extractEventSlugData,
  extractUpdateEventisPublishedData,
  extractUpdateEventSlugData,
  extractEventUpdateData,
  extractProgramData,
  extractEventTemplateData,
  extractEventAddonData,
  extractUpdateEventAddonData,
} from '../handlers/event/eventRequestHandler';
import {
  EventDetailResponseDTO,
  UpdateEventIsPublishedDTO,
  UpdateEventSlugDTO,
  createEventResponse,
  eventDetailsResponse,
  updateEventIsPublishedResponse,
  updateEventSlugResponse,
  updateEventResponse,
} from '../dtos/event/EventDTO';
import {
  checkSlugnameAvailableSchema,
  createEventFormSchema,
  createEventSchema,
  generateEventSchema,
  updateEventIsPublishedSchema,
  updateEventSlugSchema,
  updateEventSchema,
  addProgramSchema,
  addEventAddonSchema,
  addEventTemplateSchema,
  updateEventAddonSchema,
} from '../validators/event/eventValidator';
import { createPaginatedResponse } from '../utils/response_util';
import { Event } from '../models/Event';
import { extractListRequestData } from '../utils/request_util';
import { EventStatus } from '../models/EventStatus';
import { JwtPayload } from 'jsonwebtoken';
import { extractEventRegistrationFormData } from '../handlers/event/eventRegistrationFormRequestHandler';
import {
  createEventRegistrationFormResponse,
  listEventRegistrationFormResponse,
} from '../dtos/event/EventRegistrationFormDTO';
import { EventRegistrationForm } from '../models/init-models';
import { Transaction } from 'sequelize';
import { sequelize } from './../models/index';
import { createEventAddonResponse, updateEventAddonResponse } from '../dtos/event/EventAddonDTO';
import { UserService } from '../services/UserService';
import { SubscriptionService } from '../services/SubscriptionService';
import { ParticipantService } from '../services/ParticipantService';
import { TemplateService } from '../services/TemplateService';
import { CompanyService } from '../services/CompanyService';
import { enumEventStatus } from '../utils/enum';

export class EventController {
  private eventService = new EventService();
  private subscriptionService = new SubscriptionService();
  private participantService = new ParticipantService();
  private userService = new UserService();
  private templateService = new TemplateService();
  private companyService = new CompanyService();

  /**
   * Handles the request to create a new Event.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const { isDraft, ...rawEventData } = req.body; 

      // Skip validation if `isDraft` is true
      const eventData = isDraft
      ? rawEventData
      : extractEventData(req, createEventSchema); // Perform validation only if not a draft
      
      //delete drafted event and create new one
      if(eventData.draftId && isDraft)
      {
        await this.eventService.deleteDraftEvent(eventData.draftId);
      }
      // If no template ID is provided, fetch the default template and assign its ID
      if (!isDraft && !Utils.isNotUndefined(eventData.templateId)) {
        const templateDetail = await this.templateService.getAllTemplates(
          { isDefault: 1 },
          1,
          0,
          'id',
          'ASC'
        );
        // If a default color exists, assign its ID to the event data
        if (templateDetail.rows.length > 0) {
          eventData.templateId = templateDetail.rows[0].id;
        }
        const templateColorDetail = await this.templateService.getAllTemplateColors(
          1,
          0,
          'id',
          'ASC'
        );
        // Returning first color to event color theme
        if (templateColorDetail.rows.length > 0) {
          eventData.colorId = templateColorDetail.rows[0].id;
        }
      }

      const event = await this.eventService.createEvent(isDraft,
        eventData,
        Number(userId)
      );
      const response = createEventResponse(event);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating Event:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles the request to list event statuses.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async listEventStatus(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract pagination and sorting data from the request
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Fetch the list of event statuses with pagination and sorting
      const { rows: eventStatuses, count: total } =
        await this.eventService.getEventStatusList(
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Optionally, process event statuses if additional transformations or field filtering are required
      const filteredEventStatuses = eventStatuses.map(
        (eventStatus: EventStatus) => this.filterEventStatusFields(eventStatus) // Adjust this method to suit your filtering needs
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
   * Handles the request to list event .
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async listEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Set a base filter for the events (adjust as needed)
      const baseFilter = { status: 'ACTIVE' };
      const finalFilters = { ...baseFilter, ...filters };
      const userId = (req.user as JwtPayload)?.id;

      // Fetch the list of events with pagination, sorting, and filtering
      const { rows: events, count: total } = await this.eventService.listEvent(
        finalFilters,
        limit,
        offset,
        sortBy,
        sortDirection,
        userId
      );

      // Optionally, filter event fields (if necessary)
      const filteredEvents = events.map((event: Event) =>
        this.filterEventFields(event)
      );

      // Create a paginated response with the filtered events
      const response = createPaginatedResponse(
        filteredEvents,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error listing Event:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the event fields based on the requested fields.
   * @param event - The event object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered event object.
   */
  private filterEventFields(event: Event) {
    return event;
  }
  /**
   * Filters the event status fields based on the requested fields.
   * @param eventStatus - The event status object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered event status object.
   */
  private filterEventStatusFields(eventStatus: EventStatus) {
    return eventStatus;
  }

  /**
   * Controller method to fetch event details by ID.
   *
   * - Extracts the `eventId` from the request parameters.
   * - Uses the event service to retrieve the event details, including its children and addons.
   * - Sends the response with the event details if successful.
   * - In case of an error, logs the error and forwards it to the error handler.
   *
   * @param {Request} req - Express request object containing event ID in params.
   * @param {Response} res - Express response object for sending event details.
   * @param {NextFunction} next - Express next function to pass errors to the error handler.
   */
  async getEventDetailById(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params?.id;

      const eventResp = await this.eventService.getEventDetailById(
        Number(eventId)
      );

      const combinedresult: EventDetailResponseDTO = {
        id: eventResp.event?.id ?? 0,
        name: eventResp.event?.name ?? '',
        parentId: eventResp.event?.parentId ?? undefined,
        description: eventResp.event?.description ?? '',
        startTime: eventResp.event?.startTime ?? null,
        endTime: eventResp.event?.endTime ?? null,
        venueId: eventResp.event?.venueId ?? 0,
        eventClass: eventResp.event?.eventClass ?? '',
        interval: eventResp.event?.interval ?? '',
        companyId: eventResp.event?.companyId ?? 0,
        company:eventResp.event?.company??undefined,
        title: eventResp.event?.title ?? '',
        amount: eventResp.event?.amount ?? 0,
        discount: eventResp.event?.discount ?? 0,
        statusId: eventResp.event?.statusId ?? 0,
        slugName: eventResp.event?.slugName ?? '',
        assetId: eventResp.event?.assetId ?? undefined,
        assetName: eventResp.assetName ?? undefined,
        published: eventResp.event?.published ?? 0,
        venue: eventResp.venue ?? null,
        status: eventResp.status ?? null,
        templateId: eventResp.event?.templateId ?? 0,
        template: eventResp?.template,
        color: eventResp.event?.color ?? null,
        availableSeats: eventResp.availableSeats,
        registeredParticipants: eventResp?.registeredParticipants,
        programCheckins: eventResp?.programCheckins,
        eventCapacity: eventResp.eventCapacity || [],
        eventPriceTiers: eventResp.eventPriceTier || [],
        eventSpeakers: eventResp.eventSpeakers ?? [],
        eventSponsors: eventResp.eventSponsors ?? [],
        addonCounts: eventResp.addonCounts ?? [],
        programs: eventResp.programs || [],
        addons: eventResp.addons || [],
        eventContacts: eventResp.eventContacts || [],
        url: eventResp.event?.url,
        specialtyId: eventResp?.event?.specialtyId ?? undefined,
        speciality: eventResp.speciality ,
        isAbstract: eventResp?.event?.isAbstract ?? 0,
        abstractDate: eventResp?.event?.abstractDate ?? '',
        eventImages: eventResp.eventImages || [],
      };
      const response = eventDetailsResponse(combinedresult);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error getEventDetailById:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves an event registration form by event ID.
   * Extracts the event ID from the request parameters and retrieves the associated registration form data.
   * Responds with the retrieved event data or passes an error to the next middleware if an error occurs.
   *
   * @param req - Express request object containing the event ID in parameters
   * @param res - Express response object used to send the response back to the client
   * @param next - NextFunction for handling errors or passing control to the next middleware
   */
  async getEventRegistrationForms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = req.params?.eventId;

      const event = await this.eventService.getEventRegistrationForms(
        Number(eventId)
      );
      const response = listEventRegistrationFormResponse(event);

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error getEventRegistrationForm:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the removal and creation of event registration forms.
   * This method first deletes all existing registration forms associated with a specific event,
   * and then creates new registration forms based on the incoming request data.
   *
   * @param req - The request object containing user information and event registration data.
   * @param res - The response object used to send the response back to the client.
   * @param next - The next middleware function in the Express.js request-response cycle.
   */
  async removeAndCreateEventRegistrationForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;

      // Extract event registration form data from the request body using the defined schema
      const eventData = extractEventRegistrationFormData(
        req,
        createEventFormSchema
      );

      const eventId = eventData.eventId;

      // Delete existing event registration forms associated with the specified event ID
      await this.eventService.deleteEventRegistrationFormsByEventId(
        Number(eventId),
        transaction
      );

      // Create new event registration forms using the provided event data and the user ID
      const eventResp = await this.eventService.createEventRegistrationForm(
        Number(userId),
        eventData,
        transaction
      );
      transaction.commit();
      const response = createEventRegistrationFormResponse(
        eventResp as EventRegistrationForm[]
      );

      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error removeAndCreateEventRegistrationForm:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the slug name of an event.
   *
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   * @returns
   */
  async updateSlugname(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractUpdateEventSlugData(req, updateEventSlugSchema);
      const eventId = data.eventId;
      const result = await this.eventService.updateSlugName(
        Number(eventId),
        data.slugName
      );
      let response;

      if (typeof result === 'string') {
        // Handle the case where the slug name is already associated with the event
        response = { status: 'success', message: result };
        res.status(200).json(response);
      } else if (Array.isArray(result) && result[0] > 0) {
        const updatedEvent = await this.eventService.getEventOrThrow(eventId);
        response = updateEventSlugResponse(
          updatedEvent as unknown as UpdateEventSlugDTO
        );

        res.status(200).json(response);
      } else {
        // Event was not found or not updated
        return res.status(404).json({
          status: 'error',
          message: 'Event not found or slug was not updated',
        });
      }
    } catch (err) {
      Logger.error('Error updateSlugName:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves event details by the provided slug name.
   *
   * This method performs the following steps:
   * 1. Extracts and validates the slug name from the request body using a validation schema.
   * 2. Checks if an event exists with the provided slug name.
   *    - If no event exists, returns a success response indicating no event was found for the given slug.
   *    - If the event exists, fetches and returns detailed information about the event.
   * 3. Handles errors and logs them appropriately.
   *
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @param next - The next middleware function for error handling.
   * @returns A JSON response with the event details if found, or a message indicating no event was found for the given slug.
   */
  async getEventDetailBySlugName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const slugName = req.params.slugName;

      // Checking if the event exists for the given slug name
      const event = await this.eventService.getEventBySlugName(slugName);

      // checking the event exist with the slugName
      if (!event) {
        const errorMessage = `Event with slugName ${slugName} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const eventResp = await this.eventService.getEventDetailById(
        event?.dataValues.id
      );

      const companyData = await this.companyService.getCompanyById(
        eventResp.event?.companyId ?? 0
      );

      const combinedresult: EventDetailResponseDTO = {
        id: eventResp.event?.id ?? 0,
        name: eventResp.event?.name ?? '',
        parentId: eventResp.event?.parentId ?? undefined,
        description: eventResp.event?.description ?? '',
        startTime: eventResp.event?.startTime ?? null,
        endTime: eventResp.event?.endTime ?? null,
        venueId: eventResp.event?.venueId ?? 0,
        eventClass: eventResp.event?.eventClass ?? '',
        interval: eventResp.event?.interval ?? '',
        companyId: eventResp.event?.companyId ?? 0,
        title: eventResp.event?.title ?? '',
        amount: eventResp.event?.amount ?? 0,
        discount: eventResp.event?.discount ?? 0,
        statusId: eventResp.event?.statusId ?? 0,
        slugName: eventResp.event?.slugName ?? '',
        assetId: eventResp.event?.assetId ?? undefined,
        assetName: eventResp.assetName ?? undefined,
        published: eventResp.event?.published ?? 0,
        venue: eventResp.venue ?? null,
        status: eventResp.status ?? null,
        templateId: eventResp.event?.templateId ?? 0,
        template: eventResp?.template,
        color: eventResp.event?.color ?? null,
        availableSeats: eventResp.availableSeats,
        registeredParticipants: eventResp?.registeredParticipants,
        programCheckins: eventResp?.programCheckins,
        companyEmail: companyData?.dataValues.email ?? '',
        companyPhone: companyData?.dataValues.phone ?? '',
        eventCapacity: eventResp.eventCapacity || [],
        eventPriceTiers: eventResp.eventPriceTier || [],
        speciality:eventResp.speciality,
        eventSpeakers: eventResp.eventSpeakers ?? [],
        eventSponsors: eventResp.eventSponsors ?? [],
        addonCounts: eventResp.addonCounts ?? [],
        programs: eventResp.programs || [],
        addons: eventResp.addons || [],
        eventContacts: eventResp.eventContacts || [],
        url: eventResp.event?.url,
        eventImages: eventResp.eventImages || [],
      };
      const response = eventDetailsResponse(combinedresult);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in getEventDetailBySlugName:', err);
      handleError(next, err);
    }
  }

  /**
   * Checks if a slug name is available for an event.
   *
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async checkSlugNameAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = extractEventSlugData(req, checkSlugnameAvailableSchema);
      const eventResp = await this.eventService.getEventBySlugName(
        data.slugName,
        data.eventId
      );
      if (!eventResp) {
        const response = {
          status: 'success',
          message: 'Slug name available',
          data: true,
        };
        res.status(200).json(response);
      } else {
        const response = {
          status: 'success',
          message: 'Slug name not available',
          data: false,
        };
        res.status(200).json(response);
      }
    } catch (err) {
      Logger.error('Error checkSlugnameAvailable:', err);
      handleError(next, err);
    }
  }

  /**
   * Generates a slug name for an event.
   *
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async genaerateEventSlugName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = extractUpdateEventisPublishedData(req, generateEventSchema);
      const slugName = await this.eventService.genaerateEventSlugName(
        data.eventId
      );
      const response = {
        status: 'success',
        message: 'Slug name available',
        data: slugName,
      };

      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error genaerateEventSlugName:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the published status to true of an event.
   *
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async publishEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const subscription =
        await this.subscriptionService.isSubscriptionExpired(userId);
      if (subscription == true) {
        {
          const errorMessage = `Event publication requires an active subscription. Please subscribe to unlock this feature.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      const data = extractUpdateEventisPublishedData(
        req,
        updateEventIsPublishedSchema
      );
      const eventId = data.eventId;
      const [updatedCount] = await this.eventService.updateIsPublished(
        Number(userId),
        Number(eventId),
        1
      );
      if (updatedCount > 0) {
        const updatedEvent = await this.eventService.getEventOrThrow(
          Number(eventId)
        );

        const response = updateEventIsPublishedResponse(
          updatedEvent as unknown as UpdateEventIsPublishedDTO
        );
        res.status(200).json(response);
      }
    } catch (err) {
      Logger.error('Error publishEvent:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the published status to false of an event.
   *
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async unpublishEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const data = extractUpdateEventisPublishedData(
        req,
        updateEventIsPublishedSchema
      );
      const eventId = data.eventId;

      const participants =
        await this.participantService.getParticipantByEventId(eventId);
      if (participants.participantCount !== 0) {
        const errorMessage = `This event cannot be unpublished because it has registered participants.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      const [updatedCount] = await this.eventService.updateIsPublished(
        Number(userId),
        Number(eventId),
        0
      );
      if (updatedCount > 0) {
        const updatedEvent = await this.eventService.getEventOrThrow(
          Number(eventId)
        );

        const response = updateEventIsPublishedResponse(
          updatedEvent as unknown as UpdateEventIsPublishedDTO
        );
        res.status(200).json(response);
      }
    } catch (err) {
      Logger.error('Error unpublishEvent:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates the information of an event.
   * @param req - The request object containing event data.
   * @param res - The response object for sending the response.
   * @param next - The next middleware function.
   */
  async updateEventDetails(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      //fetching event id from params
      const eventId = Number(req.params.id);

      //fetching user id from token
      const userId = (req.user as JwtPayload)?.id;
      const eventData = extractEventUpdateData(req, updateEventSchema);

      //updating with given details
      await this.eventService.updateEvent(
        eventData,
        Number(userId),
        eventId,
        transaction
      );

      //fetching event details with event id and giving to create response.
      const eventDetails = await this.eventService.getEventOrThrow(eventId, transaction);

      transaction.commit();
      const response = updateEventResponse(eventDetails);

      res.status(200).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error updating Event Details:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Adds a new program to an event.
   *
   * @param {Request} req - The request object containing program data.
   * @param {Response} res - The response object to send the program data back.
   * @param {NextFunction} next - The next middleware function for error handling.
   * @returns {Promise<void>} - Responds with the newly created program or passes error to next middleware.
   */

async getMeetingMetaData(req: Request, res: Response, next: NextFunction) {
    try {
     
      const meetingId = req.query.meetingId as string | undefined;
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const eventId = req.query.eventId ? Number(req.query.eventId) : undefined;

      const data = await this.eventService.getMeetingMetaData(meetingId, userId, eventId);
      res.status(200).json(data);
    } catch (err) {
      Logger.error("Error getEventRegistrationForm:", err);
      handleError(next, err);
    }
  }

async getEventDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const meetingcode = req.params.meetingcode;
      let data = await this.eventService.getEventDetails(meetingcode);
      res.status(200).json(data);
    } catch (err) {
      Logger.error("Error getEventRegistrationForm:", err);
      handleError(next, err);
    }
  }

  async addProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const programData = extractProgramData(req, addProgramSchema);
      const userId = (req.user as JwtPayload)?.id;
      const event = await this.eventService.addProgram(
        programData,
        Number(userId)
      );
      const response = createEventResponse(event);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error adding Program:', err);
      handleError(next, err);
    }
  }

  /**
   * Adds a single addon to an event.
   *
   * @param req - Express request object, containing addon data in req.body
   * @param res - Express response object
   * @param next - Express next function for handling errors
   */
  async addSingleAddon(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const addonData = extractEventAddonData(req, addEventAddonSchema);
      const userId = (req.user as JwtPayload)?.id;

      const companyId = await this.userService.getCompanyId(userId, transaction);

      if (!companyId) {
        throw new Error('Company information could not be verified');
      } else {
        addonData.companyId = companyId;
      }
      const resObj = await this.eventService.addSingleEventAddon(
        addonData,
        Number(userId),
        transaction
      );
      const response = createEventAddonResponse(resObj);
      transaction.commit();
      res.status(201).json(response);
    } catch (err) {
      transaction.rollback();
      Logger.error('Error in addSingleAddon:', err);
      handleError(next, err);
    }
  }

  /**
   * Updates a single addon for an event.
   *
   * @param req - Express request object, containing addon data in req.body and addonId in req.params
   * @param res - Express response object
   * @param next - Express next function for handling errors
   */
  async updateAddon(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Extract and validate addon data from the request body
      const addonData = extractUpdateEventAddonData(req, updateEventAddonSchema);

      // Extract eventAddonId from the request parameters
      const eventAddonId = Number(req.params.id);

      // Get the user ID from the JWT payload
      const userId = (req.user as JwtPayload)?.id;

      const companyId = await this.userService.getCompanyId(userId);

      if (!companyId) {
        throw new Error('Company information could not be verified');
      } else {
        addonData.companyId = companyId;
      }

      // Call the service layer to update the addon
      const updatedAddon = await this.eventService.updateEventAddon(
        eventAddonId,
        addonData,
        Number(userId),
        transaction
      );

      transaction.commit();

      if (updatedAddon) {
        // Generate a response object for the updated addon
        const response = updateEventAddonResponse(updatedAddon);

        // Send a success response with the updated addon details
        res.status(200).json(response);
      } else {
        res
          .status(500)
          .json({ status: 'error', message: 'Failed to update event addon' });
      }
    } catch (err) {
      Logger.error('Error in updateAddon:', err);
      transaction.rollback();
      handleError(next, err);
    }
  }

  /**
   * Controller method to update the template ID for an event.
   *
   * @param req - The HTTP request object, expected to contain the event ID and template data.
   * @param res - The HTTP response object, used to send the response back to the client.
   * @param next - The next middleware function, used to handle errors or pass execution to the next middleware.
   */
  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    // Start a new database transaction
    const transaction: Transaction = await sequelize.transaction();
    try {
      // Extract and validate template data from the request body
      const reqObj = extractEventTemplateData(req, addEventTemplateSchema);

      // Extract event ID from the request parameters
      const eventId = Number(req.params.eventId);

      // Get the user ID from the JWT payload
      const userId = (req.user as JwtPayload)?.id;

      // Verify that the user belongs to a company
      const companyId = await this.userService.getCompanyId(userId);
      if (!companyId) {
        throw new Error('Company information could not be verified');
      }

      // Call the service layer to update the template ID for the event
      const updatedEvent = await this.eventService.updateEventTemplate(
        eventId,
        reqObj,
        Number(userId),
        transaction
      );

      // Commit the transaction after successful update
      await transaction.commit();

      if (updatedEvent) {
        // Generate a response object for the updated event
        const response = {
          status: 'success',
          data: updatedEvent,
          message: 'Event template updated successfully',
        };

        // Send a success response with the updated event details
        res.status(200).json(response);
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Failed to update event template',
        });
      }
    } catch (err) {
      Logger.error('Error in updateTemplate:', err);
      await transaction.rollback();
      handleError(next, err);
    }
  }

  /**
   * Handles the request to delete a event program by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async deleteEventProgram(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = req.user as JwtPayload;
      const programId = req.params?.id;
      const deleted = await this.eventService.deleteEventProgram(
        Number(programId),
        userId
      );
      if (deleted) {
        const response = {
          status: 'success',
          data: null,
          message: 'Event Program deleted.',
        };
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Event Program not found' });
      }
    } catch (err) {
      Logger.error('Error deleteEventProgram:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to delete a event addon by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async deleteEventAddon(req: Request, res: Response, next: NextFunction) {
    try {
      const eventAddonId = req.params?.id;
      const deleted = await this.eventService.deleteEventAddon(
        Number(eventAddonId)
      );
      if (deleted) {
        const response = {
          status: 'success',
          data: null,
          message: 'Event Addon deleted.',
        };
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Event Addon not found' });
      }
    } catch (err) {
      Logger.error('Error deleteEventAddon:', err);
      handleError(next, err);
    }
  }

  /**
   * Controller to retrieve the program status for the given user.
   *
   * @param req - The request object containing query parameters for filtering, pagination, and sorting.
   * @param res - The response object to send back the result.
   * @param next - The next middleware function.
   * @returns A JSON object containing the filtered, paginated, and sorted event data.
   */
  async getRegisteredEventStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Set a base filter for the events (adjust as needed)
      const baseFilter = { statusId: enumEventStatus.ACTIVE };
      const finalFilters = { ...baseFilter, ...filters };
      const userId = (req.user as JwtPayload)?.id;

      // Fetch the list of events with pagination, sorting, and filtering
      const { rows: events, count: total } =
        await this.eventService.getRegisteredEventStatus(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection,
          userId
        );

      // Optionally, filter event fields (if necessary)
      const filteredEvents = events.map((event: Event) =>
        this.filterEventFields(event)
      );

      // Create a paginated response with the filtered events
      const response = createPaginatedResponse(
        filteredEvents,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error getRegisteredEventStatus:', error);
      handleError(next, error);
    }
  }

/**
 * API handler to fetch all created events and programs for the authenticated user.
 * 
 * This handler retrieves events associated with the user's company, applying 
 * pagination and sorting parameters passed in the request.
 *
 * @param {Request} req - The incoming request object containing user authentication details and pagination parameters.
 * @param {Response} res - The response object used to send back the event details.
 * @param {NextFunction} next - The next middleware function in the pipeline.
 * @throws {Error} - If company information or event details cannot be retrieved.
 * 
 * Steps:
 * 1. Extracts the `userId` from the authenticated JWT payload.
 * 2. Fetches the `companyId` associated with the authenticated user.
 * 3. Retrieves events and programs created by the user's company, applying pagination and sorting.
 * 4. Returns the event data in a paginated format along with metadata (total count, limit, and offset).
 * 5. Sends a successful response with event data or throws an error if any step fails.
 */

  async allCreatedEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ){ 
    try{
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
    const userId = (req.user as JwtPayload)?.id;
    const companyId = await this.userService.getCompanyId(userId); 
    if(!companyId){
      throw new Error('Company information could not be verified');
    }
       const { rows:data, count: total }= await this.eventService.eventDetails(
        filters,
        limit,
        offset,
        sortBy,
        sortDirection,
        companyId
      );
    if(!data){
      throw new Error('Failed to fetch event details for the given company ID..');
    }
    const response = createPaginatedResponse(
      data,
      total,
      limit,
      offset
    );
    res.status(200).json(response);
  }catch(error){
    Logger.error("user evenets",error);
    handleError(next, error);
  }
}
}
