/**
 * @class ParticipantController
 * @description Controller class for handling HTTP requests related to Participant operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { ParticipantService } from '../services/ParticipantService';
import { handleError } from '../utils/error_util';
import {
  createParticipantCheckSchema,
  createParticipantSchema,
  createQrParticipantSchema,
} from '../validators/participant/participantValidator';
import {
  extractParticipantCheckData,
  extractParticipantData,
  extractQrParticipantData,
} from '../handlers/participant/participantRequestHandler';
import {
  createParticipantPaymentResponse,
  createParticipantResponse,
  createQrParticipantDetails,
  createRegisteredEventsResponse,
  getParticipantResponse,
  getParticipantsDetailsResponse,
  ParticipantDetailsResponseDTO,
  ParticipantResponseDTO,
  QrParticipantDetails,
} from '../dtos/participant/ParticipantDTO';
import {
  getParticipantTypeResponse,
  ParticipantTypeResponseDTO,
} from '../dtos/participant/ParticipantTypeDTO';
import { JwtPayload } from 'jsonwebtoken';
import { extractParticipantGroupData } from '../handlers/participant/participantGroupRequestHandler';
import { createParticipantGroupSchema } from '../validators/participant/participantGroupValidator';
import { createParticipantGroupResponse } from '../dtos/participant/ParticipantGroupDTO';
import { Logger } from '../utils/logger';
import { Transaction } from 'sequelize';
import { sequelize } from './../models/index';
import { createParticipantRoleResponse } from '../dtos/participant/ParticipantRoleDTO';
import { createParticipantRoleSchema } from '../validators/participant/participantRoleValidator';
import { extractParticipantRoleData } from '../handlers/participant/participantRoleRequestHandler';
import { createPaginatedResponse } from '../utils/response_util';
import { extractListRequestData } from '../utils/request_util';
import { OrderService } from '../services/OrderService';
import { enumRoll } from '../utils/enum';
import { UserService } from '../services/UserService';
import { EventService } from '../services/EventService';
import moment from 'moment';
import { NotificationService } from '../services/NotificationService';
import { AttendeeService } from '../services/AttendeeService';
import { UpdatedParticipantDTO } from '../dtos/attendee/AddAttendeeDTO';

export class ParticipantController {
  private participantService = new ParticipantService();
  private orderService = new OrderService();
  private userService = new UserService();
  private eventService = new EventService();
  private notificationService = new NotificationService();
  private attendeeService = new AttendeeService();
  /**
   * Handles the request to create a new Participant.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createParticipant(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;

      if (userRole === enumRoll.COMPANYADMIN) {
        throw new Error('You do not have permission to join events.');
      }

      const participantData = extractParticipantData(
        req,
        createParticipantSchema
      );
      const orderResp = await this.orderService.getOrderById(
        Number(participantData.orderId),
        Number(userId),
        transaction
      );
      if (!orderResp) {
        throw new Error('Order not found');
      }
      const participant = await this.participantService.createParticipant(
        {
          orderId: Number(participantData.orderId),
          parentEventId: orderResp?.parentEventId ?? 0,
          participantTypeId: orderResp?.participantTypeId,
          finalPrice: orderResp?.finalPrice,
          registrationType: participantData.registrationType,
        },
        Number(userId),
        transaction
      );
      //fetch Event Details
      const eventDetails = await this.eventService.getEventDetailById(
        Number(orderResp.parentEventId),
        transaction
      );
      //fetch user Details
      const userData = await this.userService.getUserById(Number(userId));

      transaction.commit();
      const response = createParticipantResponse(participant);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating participant:', err);
      transaction.rollback();
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles the request to get a participant by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getParticipantById(req: Request, res: Response, next: NextFunction) {
    try {
      const participantId = (req.user as JwtPayload)?.id;
      const user = await this.participantService.getParticipantById(
        Number(participantId)
      );
      if (user) {
        const response = getParticipantResponse(user as ParticipantResponseDTO); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Participant not found' });
      }
    } catch (error) {
      Logger.error('Error creating participant Group:', error);
      handleError(next, error);
    }
  }

  /**
   * Handles the request to get a participant type by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getParticipantTypeById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const participantId = (req.user as JwtPayload)?.id;
      const user = await this.participantService.getParticipantTypeById(
        Number(participantId)
      );
      if (user) {
        const response = getParticipantTypeResponse(
          user as ParticipantTypeResponseDTO
        ); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Participant Type not found' });
      }
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Handles the request to create Participants group.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createParticipantGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //Fetching user id with token
      const userId = (req.user as JwtPayload)?.id;
      const participantGroupData = extractParticipantGroupData(
        req,
        createParticipantGroupSchema
      );
      //Passing req data and user id to create participant group function
      const participantGroup =
        await this.participantService.createParticipantGroup(
          participantGroupData,
          Number(userId)
        );
      const response = createParticipantGroupResponse(participantGroup);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating participant Group:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles the request to create Participants role.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createParticipantRole(req: Request, res: Response, next: NextFunction) {
    try {
      //Fetching USer id from token
      const userId = (req.user as JwtPayload)?.id;
      const participantRoleData = extractParticipantRoleData(
        req,
        createParticipantRoleSchema
      );
      //Passing req data and userId
      const participantRole =
        await this.participantService.createParticipantRole(
          participantRoleData,
          Number(userId)
        );
      const response = createParticipantRoleResponse(participantRole);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating participant Role:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handles fetching a list of event participants with optional filters, pagination, and sorting.
   * Responds with a paginated list of participants and associated user details.
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  async getParticipantList(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      // Fetch the list of events with pagination, sorting, and filtering
      const { rows: participants, count: total } =
        await this.participantService.getParticipantList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );
      // Checking the participants are checked in or not
      const updatedParticipants =
        await this.attendeeService.checkAttendanceStatus(participants);

      // Optionally, filter participant fields
      const filteredParticipants = updatedParticipants.map(
        (updatedParticipants: UpdatedParticipantDTO) =>
          this.filterParticipantFields(updatedParticipants)
      );
      // Create a paginated response with the filtered events
      const response = createPaginatedResponse(
        filteredParticipants,
        total,
        limit,
        offset
      );
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error getEventParticipantList', error);
      handleError(next, error);
    }
  }

  /**
   * Handles the request to get Participants details by id.
   * @param req
   * @param res
   * @param next
   */
  async getParticipantDetailsById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      //fetching participant id from params
      const partcpntId = Number(req.params.id);
      const details = await this.participantService.getParticipantDetailsById(
        Number(partcpntId)
      );
      if (details) {
        const response = getParticipantsDetailsResponse(
          details as ParticipantDetailsResponseDTO
        ); // Convert to DTO for consistent response
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Participant not found' });
      }
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error getParticipantDetailsById', error);
      handleError(next, error);
    }
  }

  private filterParticipantFields(updatedParticipant: UpdatedParticipantDTO) {
    return updatedParticipant;
  }

  /**
   * Handles the request to verify whether the user is already a participant in the specified event.
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   */
  async existingParticipantOrNot(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const data = extractParticipantCheckData(
        req,
        createParticipantCheckSchema
      );

      const participant =
        await this.participantService.existingParticipantOrNot(
          Number(userId),
          data.eventId
        );
      // Create the response object
      const response = {
        status: 'success',
        message: `The participant is ${participant ? 'already registered for this event' : 'not registered for this event'}.`,
        data: { participant },
      };

      // Return the response
      return res.json(response);
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error existingParticipantOrNot', error);
      handleError(next, error);
    }
  }

  /**
   * Fetch participant and payment details for a specific event and user.
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   * @returns
   */
  async getParticipantAndPaymentDetailsByEventId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const data = extractParticipantCheckData(
        req,
        createParticipantCheckSchema
      );
      const details =
        await this.participantService.getParticipantAndPaymentDetailsByEventId(
          data.eventId,
          userId
        );
      const response = createParticipantPaymentResponse(
        details.eventParticipant,
        details.participantPayment,
      );
      return res.json(response);
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error existingParticipantOrNot', error);
      handleError(next, error);
    }
  }

  /**
   * Fetch Registered Event and program details of a user.
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   * @returns
   */
  async getRegisteredEventsAndPrograms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const eventId = Number(req.params?.id) || 0;
      const events =
        await this.participantService.getRegisteredEventsAndPrograms(
          userId,
          eventId
        );
      const response = createRegisteredEventsResponse(events);
      return res.json(response);
    } catch (error) {
      // Log the error and pass it to the error handler
      Logger.error('Error getRegisteredEventsAndPrograms', error);
      handleError(next, error);
    }
  }

  /**
   * Retrieve Participant Details Using QR Code
   *
   * @param req - The Express request object, containing query parameters for filters, sorting, and pagination.
   * @param res - The Express response object.
   * @param next - The Express next middleware function.
   * @returns
   */
  async getParticipantDetailsByQr(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userRole = (req.user as JwtPayload)?.userRole;
      const data = extractQrParticipantData(req, createQrParticipantSchema);

      // Retrieve participant details by QR code
      const participant =
        await this.participantService.getParticipantDetailsByQr(data, userId, userRole);
      if (!participant) {
        const errorMessage = `Participant not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Retrieve event details by ID
      const event = await this.eventService.getEventDetailById(
        participant.dataValues.eventId
      );

      // Retrieve attending programs for the participant
      const attendingPrograms =
        await this.participantService.getRegisteredEventsAndPrograms(
          participant.dataValues.userId,
          participant.dataValues.eventId
        );

      // Getting resgistered addons by this participant
      const attendedAddons = await this.participantService.getRegisteredAddons(
        participant.dataValues.id
      );

      const checkedInData = await this.attendeeService.getCheckedInStatus(
        participant.dataValues.id,
        participant.dataValues.eventId
      );
      // Combine results into a structured response object
      const combinedResult: QrParticipantDetails = {
        participant: participant,
        event: event.event,
        eventPrograms: event.programs,
        eventAddons: event.addons,
        attendedPrograms: attendingPrograms || [],
        attendedAddons: attendedAddons || [],
        checkedIn: checkedInData || [],
      };

      // Create and send the response
      const response = createQrParticipantDetails(combinedResult);
      res.status(201).json(response);
    }catch (error) {
      Logger.error('Error in getParticipantDetailsByQr:', error);
    
      // Check if the error is an instance of Error and matches the specific message
      if (
        error instanceof Error &&
        error.message ===
          'QR code or Participant ID not found for the given event.'
      ) {
        return handleError(next, error, 400);
      }
    
      // For all other errors, pass the error with the default status code
      return handleError(next, error);
    }    
  }
}
