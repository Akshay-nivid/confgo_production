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
} from '../validators/participant/participantValidator';
import {
  extractParticipantCheckData,
  extractParticipantData,
} from '../handlers/participant/participantRequestHandler';
import {
  createParticipantPaymentResponse,
  createParticipantResponse,
  createRegisteredEventsResponse,
  getParticipantResponse,
  getParticipantsDetailsResponse,
  ParticipantDetailsResponseDTO,
  ParticipantResponseDTO,
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
import { Participant } from '../models/Participant';
import { createPaginatedResponse } from '../utils/response_util';
import { extractListRequestData } from '../utils/request_util';
import { OrderService } from '../services/OrderService';
import { enumRoll } from '../utils/enum';
import { UserService } from '../services/UserService';
import { EventService } from '../services/EventService';
import { PDFService } from '../services/PdfService';
import moment from 'moment';
import { NotificationService } from '../services/NotificationService';

export class ParticipantController {
  private participantService = new ParticipantService();
  private orderService = new OrderService();
  private userService = new UserService();
  private eventService = new EventService();
  private pdfService = new PDFService();
  private notificationService = new NotificationService();
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

      if (userRole === enumRoll.COMPANY) {
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
          participantTypeId: orderResp?.participantTypeId ?? 0,
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

      // Send an email notification for event registration
      if (userData && orderResp && eventDetails) {
        //Event details to pdf generation
        const eventPDFDetails: any = {
          eventName: eventDetails?.event?.dataValues.name,
          name:
            userData.dataValues.firstName + ' ' + userData.dataValues.lastName,
          date:
            moment(eventDetails?.event?.dataValues.startTime.toString()).format(
              'DD/MM/YYYY HH:mm'
            ) ?? '',
          id: userId,
          qrCode: participant.dataValues.qrCode ?? '',
        };
        console.log("------Step 1------");
        const pdfBuffer =
          await this.pdfService.generatePDFWithQRCode(eventPDFDetails);
        //sending email notification
      /*  await this.notificationService.sendEmailNotification(
          {
            actionName: 'EVENT_REGISTRATION',
            toAddress: userData.dataValues.email,
            mailVars: {
              CONTACTNAME:
                userData.dataValues.firstName +
                ' ' +
                userData.dataValues.lastName,
              EVENTNAME: eventDetails?.event?.dataValues.name ?? '',
              EMAIL: userData.dataValues.email,
              LOCATION: eventDetails?.venue?.address ?? '',
              DATE:
                moment(
                  eventDetails?.event?.dataValues.startTime.toString()
                ).format('DD/MM/YYYY HH:mm') ?? '',
              AMOUNT: participant?.dataValues?.amountPaid?.toString() ?? '0',
              TOKEN: 'token',
              USERID: Buffer.from(userId.toString()).toString('base64'),
            },
            attachments: [
              {
                filename:
                  userData.dataValues.firstName +
                  '-' +
                  userId +
                  '- event_details.pdf',
                content: pdfBuffer, // The buffer containing the PDF
                contentType: 'application/pdf', // MIME type for PDF
              },
            ],
          }
        );*/
      }
      transaction.commit();
      const response = createParticipantResponse(participant);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating participant Group:', err);
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

      // Optionally, filter participant fields
      const filteredParticipants = participants.map(
        (participant: Participant) => this.filterParticipantFields(participant)
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

  private filterParticipantFields(participant: Participant) {
    return participant;
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
        message: `Participant in this event is ${participant ? 'already' : 'not'} present.`,
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
        details.participantPayment
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
}

