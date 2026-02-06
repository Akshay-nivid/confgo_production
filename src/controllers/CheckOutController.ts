/**
 * CheckOut Controller
 *
 * This controller handles the entire checkout process for a user, which includes:
 * - Validating the order and ensuring its legitimacy.
 * - Creating and updating participant records based on the order details.
 * - Handling event notifications, including generating a PDF with QR codes and sending confirmation emails.
 * - Updating the order and payment records in the database.
 *
 * The controller ensures that all database operations are performed within a single transaction to maintain consistency and avoid data corruption.
 * It also manages error handling and ensures the transaction is rolled back in case of any issues during the checkout process.
 */
import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/error_util';
import { Logger } from '../utils/logger';
import { JwtPayload } from 'jsonwebtoken';
import { Transaction } from 'sequelize';
import { UserService } from '../services/UserService';
import { sequelize } from '../models';
import { extractParticipantData } from '../handlers/participant/participantRequestHandler';
import { createParticipantSchema } from '../validators/participant/participantValidator';
import { OrderService } from '../services/OrderService';
import { ParticipantService } from '../services/ParticipantService';
import { EventService } from '../services/EventService';
import moment from 'moment';
import { NotificationService } from '../services/NotificationService';
import { createCheckoutResponse } from '../dtos/participant/ParticipantDTO';
import { extractUpdateParticipantRecordData } from '../handlers/eventRegistrationRecord/eventRegistrationRecordRequestHandler';
import { updateRegistrationRecordParticipantSchema } from '../validators/event/eventRegistrationRecordValidator';
import { EventRegistrationRecordService } from '../services/EventRegistrationRecordService';
import { extractUpdateOrderData } from '../handlers/order/orderRequestHandler';
import { updateOrderSchema } from '../validators/orderValidator';
import { extractUpdatePaymentData } from '../handlers/payment/paymentRequestHandler';
import { updatdePaymentSchema } from '../validators/paymentValidator';
import { paymentService } from '../services/PaymentService';
import { NotificationCreateDTO } from '../dtos/notification/NotificationDTO';
import { LogService } from '../services/LogService';
import { enumRoll } from '../utils/enum';
import { UpdatePaymentDTO } from '../dtos/payment/paymentDTO';

export class CheckOutController {
  private orderService = new OrderService();
  private participantService = new ParticipantService();
  private eventService = new EventService();
  private userService = new UserService();
  private notificationService = new NotificationService();
  private eventRegistrationRecordService = new EventRegistrationRecordService();
  private paymentService = new paymentService();
  private logService = new LogService();

  /**
   * Handles the checkout process, which involves creating a participant record,
   * validating the order, sending event notifications, and updating relevant records.
   *
   * @param req - Express Request object, containing user and checkout details.
   * @param res - Express Response object, used to send the response.
   * @param next - Express NextFunction for error handling.
   */
  async checkOut(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    const userId = (req.user as JwtPayload)?.id;
    try {
      // Add log entry for request
      this.logService.createLogEntry(userId, req);
      const userRole = (req.user as JwtPayload)?.userRole;
      const paymentId = req.body.paymentId;
      if (userRole != enumRoll.USER) {
        throw new Error('Must be a participant.Please login using user credentials');
      }

      const participantData = this.extractParticipantData(req);
      const orderResp = await this.validateOrder(
        participantData.orderId,
        userId,
        transaction
      );

      const participant = await this.createParticipantRecord(
        orderResp,
        participantData,
        userId,
        transaction
      );
      const eventDetails = await this.eventService.getEventDetailById(
        Number(orderResp.parentEventId),
        transaction
      );
      const userData = await this.userService.getUserById(userId);

      if (userData && eventDetails) {
        await this.handleEventNotification(
          userData,
          eventDetails,
          participant,
          transaction
        );
      }

      await this.updateParticipantRecords(
        req,
        userId,
        participant.id,
        transaction
      );
      await this.updateOrder(req, transaction);
       //Dont need to update payment for free events
      if (paymentId) { 
        const data = extractUpdatePaymentData(req, updatdePaymentSchema);
          // Update payment only if paymentId is valid (not null or undefined)
          await this.updatePayment(data, userId, paymentId, transaction);
      }


      //par
      await transaction.commit();
      res.status(201).json(createCheckoutResponse(eventDetails.event,userData,participant));
      this.logService.createLogEntry(userId, req, {
        success: true,
        statusCode: 200,
        message: 'Request processed successfully',
      });
    } catch (err) {
      await transaction.rollback();
      Logger.error('Error in checkout process', err);
      this.logService.createLogEntry(userId, req, {
        success: false,
        statusCode: 500,
        message: err,
      });
      handleError(next, err);
    }
  }
  /**
   * Extracts participant data from the request object and validates it using a schema.
   *
   * @param req - Express Request object, containing the data to extract.
   * @returns The validated participant data.
   */

  private extractParticipantData(req: Request) {
    return extractParticipantData(req, createParticipantSchema);
  }

  /**
   * Validates the order by checking its existence for the given user and transaction.
   *
   * @param orderId - The ID of the order to validate.
   * @param userId - The ID of the user associated with the order.
   * @param transaction - The database transaction object for managing operations.
   * @returns The order response object if the order is valid.
   * @throws An error if the order is not found.
   */
  private async validateOrder(
    orderId: number,
    userId: number,
    transaction: Transaction
  ) {
    const orderResp = await this.orderService.getOrderById(
      orderId,
      userId,
      transaction
    );
    if (!orderResp) {
      throw new Error('Order not found');
    }
    return orderResp;
  }

  /**
   * Creates a participant record in the database using the provided order and participant data.
   *
   * @param orderResp - The response object containing order details.
   * @param participantData - The data related to the participant extracted from the request.
   * @param userId - The ID of the user creating the participant record.
   * @param transaction - The database transaction object for managing operations.
   * @returns A promise resolving to the created participant record.
   */
  private async createParticipantRecord(
    orderResp: any,
    participantData: any,
    userId: number,
    transaction: Transaction
  ) {
    return this.participantService.createParticipant(
      {
        orderId: participantData.orderId,
        parentEventId: orderResp.parentEventId,
        participantTypeId: orderResp?.participantTypeId,
        finalPrice: orderResp.finalPrice,
        registrationType: participantData.registrationType,
      },
      userId,
      transaction
    );
  }

  /**
   * Handles sending event notifications to the user by generating a PDF with event details
   * and sending a confirmation email with the PDF attached.
   *
   * @param userData - The user details of the participant.
   * @param eventDetails - The details of the event associated with the participant.
   * @param participant - The participant record created during the checkout process.
   * @param transaction - The database transaction object for managing operations.
   */
  private async handleEventNotification(
    userData: any,
    eventDetails: any,
    participant: any,
    transaction: Transaction
  ) {
    const actionData =
      await this.notificationService.getNotificationSettingByActionName(
        'EVENT_REGISTRATION',
        transaction
      );
    //setting meta details
    const metaDetails = {
      year:new Date().getFullYear().toString(),
      eventName: eventDetails.event.dataValues.name,
      contactName:
        userData.dataValues.firstName + ' ' + userData.dataValues.lastName,
      date: moment(eventDetails?.event?.eventStartTime).format('DD/MM/YYYY HH:mm'),
      id: eventDetails.event.dataValues.id,
      email: userData.dataValues.email,
      location: eventDetails?.venue ? (eventDetails.venue.address + ',' + eventDetails.venue.city):'...',
      qrCode: participant.dataValues.qrCode,
      phone: userData.dataValues.phone,
      companyEmail: eventDetails.event.company.dataValues.email,
      companyPhone: eventDetails.event.company.dataValues.phone,
    };

    // Convert metaDetails to JSON string for storage in metaData field
    const metaDataString = JSON.stringify(metaDetails);
    //Request for notification
    const req: NotificationCreateDTO = {
      userId: userData.dataValues.id,
      templateId: actionData?.dataValues.id,
      metadata: metaDataString,
      recipient: userData.dataValues.email,
      eventId: eventDetails.event.id,
      sendStatus: 0,
      createdBy: userData.dataValues.id,
      modifiedBy: userData.dataValues.id,
    };
    //Add notification
    await this.notificationService.createNotification(
      userData.dataValues.id,
      req
    );
  }

  /**
   * Prepares the data required for sending an event confirmation email.
   *
   * @param userData - The user details of the participant.
   * @param eventDetails - The details of the event associated with the participant.
   * @param participant - The participant record containing payment and other details.
   * @returns An object containing the necessary details for the email.
   */
  private getMailData(userData: any, eventDetails: any, participant: any) {
    return {
      contactName: `${userData.firstName} ${userData.lastName}`,
      eventName: eventDetails?.event?.name ?? '',
      email: userData.email,
      location: eventDetails?.venue?.address ?? '',
      date: moment(eventDetails?.event?.startTime).format('DD/MM/YYYY HH:mm'),
      amount: participant.amountPaid?.toString() ?? '0',
      userId: Buffer.from(userData.id.toString()).toString('base64'),
    };
  }

  /**
   * Updates the participant records in the database based on the data extracted from the request.
   *
   * @param req - Express Request object containing the data for updating participant records.
   * @param userId - The ID of the user associated with the participant record.
   * @param participantId - The ID of the participant whose record needs to be updated.
   * @param transaction - The database transaction object for managing operations.
   */
  private async updateParticipantRecords(
    req: Request,
    userId: number,
    participantId: number,
    transaction: Transaction
  ) {
    const recordData = extractUpdateParticipantRecordData(
      req,
      updateRegistrationRecordParticipantSchema
    );
    await this.eventRegistrationRecordService.updateRegistrationRecordParticipantByUser(
      userId,
      participantId,
      recordData,
      transaction
    );
  }

  /**
   * Updates the order details in the database based on the data extracted from the request.
   *
   * @param req - Express Request object containing the data for updating the order.
   * @param transaction - The database transaction object for managing operations.
   */
  private async updateOrder(req: Request, transaction: Transaction) {
    const orderData = extractUpdateOrderData(req, updateOrderSchema);
    const orderId = req.body.orderId;
    await this.orderService.updateOrder(orderId, orderData, transaction);
  }

  /**
   * Updates the payment details in the database based on the data extracted from the request.
   *
   * @param req - Express Request object containing the data for updating the payment.
   * @param userId - The ID of the user associated with the payment record.
   */
  private async updatePayment(
    data: UpdatePaymentDTO,
    userId: number,
    paymentId:number,
    transaction: Transaction
  ) {
    await this.paymentService.updatePayment(
      userId,
      paymentId,
      data,
      transaction
    );
  }
}
