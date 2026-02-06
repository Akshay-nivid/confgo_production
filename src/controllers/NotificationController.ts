import { handleError } from '../utils/error_util';
import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/NotificationService';
import { extractListRequestData } from '../utils/request_util';
import { NotificationSetting } from '../models/init-models';
import { createPaginatedResponse } from '../utils/response_util';
import {
  extractContactusData,
  extractEventInvetationData,
  extractNotificationSettingUpdateData,
  extractSponsorshipInterestData,
} from '../handlers/notification/notificationRequestHandler';
import {
  contactusSchema,
  eventInviteSchema,
  sponsorshipInterestSchema,
  updateNotificationSettingSchema,
} from '../validators/notificationSettingValidator';
import {
  NotificationCreateDTO,
  NotificationSettingResponseDTO,
  updateNotificationSettingResponse,
} from '../dtos/notification/NotificationDTO';
import { JwtPayload } from 'jsonwebtoken';
import { Transaction } from 'sequelize';
import { sequelize } from './../models/index';
import { EventService } from '../services/EventService';
import { CompanyService } from '../services/CompanyService';
/**
 * @author saneeshiv
 * @class NotificationController
 * @description
 */

export class NotificationController {
  private notificationService = new NotificationService();
  private eventService = new EventService();
  private companyService = new CompanyService();
  /**
   * Handles the request to list all notification settings.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllNotificationSettings(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Extract list-related parameters from the request body
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Fetch notification with applied filters, pagination, limit, and sorting
      const { rows: notification, count: total } =
        await this.notificationService.getAllNotificationSettings(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Optionally filter the response fields
      const filteredNotification = notification.map((ns: NotificationSetting) =>
        this.filterNotificationSettingFields(ns)
      );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        filteredNotification,
        total,
        limit,
        offset
      );

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      handleError(next, error);
    }
  }

  /**
   * Handles the request to update an existing notification setting by ID.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async updateNotificationSetting(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const nsData = extractNotificationSettingUpdateData(
        req,
        updateNotificationSettingSchema
      );
      const nsId = req.params?.id;

      const [updatedCount] =
        await this.notificationService.updateNotificationSetting(
          Number(nsId),
          nsData
        );

      if (updatedCount > 0) {
        const updatedNotificationSetting =
          await this.notificationService.getNotificationSettingOrThrow(
            Number(nsId)
          );

        const response = updateNotificationSettingResponse(
          updatedNotificationSetting as NotificationSettingResponseDTO
        );

        res.status(200).json(response);
      } else {
        res
          .status(500)
          .json({ message: 'Failed to update notification setting' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Handles the contact us form submission.
   * This function extracts the form data, verifies the Google reCAPTCHA response,
   * sends an email notification to the admin with the form details, and sends an acknowledgment email to the user.
   *
   * @param req - The request object containing the form submission data.
   * @param res - The response object used to send the success or failure status back to the client.
   * @param next - The next function to pass control to the next middleware in case of an error.
   */
  async sendContactusEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction: Transaction = await sequelize.transaction();
      // Extract and validate the contact form data based on the contactusSchema.
      const notificationData = extractContactusData(req, contactusSchema);

      // Verify Google reCAPTCHA using the token provided in the form submission.
      const isRecaptchaValid =
        await this.notificationService.verifyGoogleRecaptcha(
          notificationData.gRecaptcha
        );

      // If reCAPTCHA validation fails, send an error response to the client.
      if (!isRecaptchaValid) {
        const response = {
          status: 'error',
          message: 'reCAPTCHA verification failed',
          data: null,
        };

        res.status(400).json(response);
        return;
      }

      const actionData =await this.notificationService.getNotificationSettingByActionName(
        'CONTACT_US_SUBMIT',
      );
      const mailactionData =await this.notificationService.getNotificationSettingByActionName(
        'CONTACT_US_SUBMIT_ACKNOWLEDGE',
      );

      /**
       * Send an email notification to the admin containing the contact form details.
       *  
       * */ 
      if (actionData && mailactionData) {
       
        const metaDetails = {
          year:new Date().getFullYear().toString(),
          name: notificationData.firstName + ' ' + notificationData.lastName,
          userEmail: notificationData.email,
          email: 'admin@nivid.co',
          phone: notificationData.phone,
          companyName: notificationData.companyName,
          message: notificationData.message ?? '',
        };
        //notification create request
        const req: NotificationCreateDTO = {
          templateId: actionData?.dataValues.id,
          metadata: JSON.stringify(metaDetails),
          recipient: 'admin@confgo.com',
          sendStatus: 0,
          createdBy: 1, // 1 - ADMIN
          modifiedBy: 1,
        };
        //Add email send entry to notification
        await this.notificationService.createNotification(
          null,
          req,
          transaction
        );

        //notification create request - enquiry submit mail
        const enqReq: NotificationCreateDTO = {
          templateId: mailactionData?.dataValues.id,
          metadata: JSON.stringify({
            year:new Date().getFullYear().toString(),
            email: notificationData.email,
            NAME: notificationData.firstName + ' ' + notificationData.lastName,
          }),
          recipient: notificationData.email,
          sendStatus: 0,
          createdBy: 1, // 1 - ADMIN
          modifiedBy: 1,
        };
        //Add email send entry to notification
        await this.notificationService.createNotification(
          null,
          enqReq,
          transaction
        );
      }

      // Check if the admin email was sent successfully and respond accordingly.
      const response = {
        status: 'success',
        message: 'Email send successfully',
        data: true,
      };
      transaction.commit();
      res.status(200).json(response);
    } catch (err) {
      handleError(next, err);
    }
  }

  /**
   * Filters the notification setting fields based on the requested fields.
   * @param notificationSetting - The notification setting object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered notificationSetting object.
   */
  private filterNotificationSettingFields(
    notificationSetting: NotificationSetting
  ) {
    return notificationSetting;
  }

  /**
   * Handles the process of inviting a user to an event via email.
   *
   * @async
   * @param {Request} req - The HTTP request object containing the event invitation data.
   * @param {Response} res - The HTTP response object used to send the response.
   * @param {NextFunction} next - The next middleware function in the Express stack.
   *
   * @throws {Error} - If an error occurs during the invitation process, it will be passed to the next error-handling middleware.
   */
  async inviteUsersByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const userCompany = await this.companyService.getCompanyDetailsByUserId(userId);

      // Extract and validate the contact form data based on the eventInviteSchema.
      const notificationData = extractEventInvetationData(
        req,
        eventInviteSchema
      );
      if (userId) {
      // Use the notification service to send the invitation email.
      this.notificationService.inviteUsersByEmail(userId, notificationData, userCompany.company,);
      }
      const response = {
        status: 'success',
        message: 'Invitation mail send successfully',
        data: true,
      };
      res.status(200).json(response);
    } catch (err) {
      handleError(next, err);
    }
  }

/**
   * Handles sponsorship interest email submissions.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   * @returns A JSON response indicating the result of the email submission process
   */
async sponsorshipInterestMail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const transaction: Transaction = await sequelize.transaction();

  try {
    // Extract and validate the form data based on the schema
    const notificationData = extractSponsorshipInterestData(
      req,
      sponsorshipInterestSchema
    );

    const eventContact = await this.eventService.getEventContactByEventId(notificationData.eventId);

    // Verify Google reCAPTCHA token
    const isRecaptchaValid = await this.notificationService.verifyGoogleRecaptcha(notificationData.gRecaptcha);

    if (!isRecaptchaValid) {
      res.status(400).json({
        status: 'error',
        message: 'reCAPTCHA verification failed',
        data: null,
      });
      return;
    }

    // Fetch notification settings for admin and acknowledgement emails
    const [adminActionData, acknowledgeActionData] = await Promise.all([
      this.notificationService.getNotificationSettingByActionName(
        'SPONSORSHIP_INTEREST_SUBMIT'
      ),
      this.notificationService.getNotificationSettingByActionName(
        'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE'
      ),
    ]);

    if (adminActionData && acknowledgeActionData) {
      const metaDetails = {
        year:new Date().getFullYear().toString(),
        name: `${notificationData.firstName} ${notificationData.lastName}`,
        userEmail: notificationData.email,
        jobTitle: notificationData?.jobTitle ?? '...',
        email: eventContact?.dataValues.email,
        phone: notificationData.phone,
        companyName: notificationData.companyName,
        message: notificationData.message ?? '',
      };

      // Create notification entry for admin email
      const adminNotification: NotificationCreateDTO = {
        templateId: adminActionData.dataValues.id,
        metadata: JSON.stringify(metaDetails),
        recipient: eventContact?.dataValues.email,
        sendStatus: 0,
        createdBy: 1, // 1 - ADMIN
        modifiedBy: 1,
      };

      await this.notificationService.createNotification(
        null,
        adminNotification,
        transaction
      );

      // Create notification entry for acknowledgement email
      const acknowledgeNotification: NotificationCreateDTO = {
        templateId: acknowledgeActionData.dataValues.id,
        metadata: JSON.stringify({
          year:new Date().getFullYear().toString(),
          email: notificationData.email,
          NAME: `${notificationData.firstName} ${notificationData.lastName}`,
        }),
        recipient: notificationData.email,
        sendStatus: 0,
        createdBy: 1, // 1 - ADMIN
        modifiedBy: 1,
      };

      await this.notificationService.createNotification(
        null,
        acknowledgeNotification,
        transaction
      );
    }

    // Commit the transaction
    await transaction.commit();

    // Respond with success
    res.status(200).json({
      status: 'success',
      message: 'Emails sent successfully',
      data: true,
    });
  } catch (err) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    handleError(next, err);
  }
}

  /**
   * Handles the request to list notifications .
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async listNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract filters, limit, offset, sortBy, and sortDirection from the request
      const { filters, limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Set a base filter for the notifications (adjust as needed)
      const finalFilters = { ...filters };
      const userId = (req.user as JwtPayload)?.id;

      // Fetch the list of notifications with pagination, sorting, and filtering
      const { rows: rows, count: total } = await this.notificationService.listNotifications(
        finalFilters,
        limit,
        offset,
        sortBy,
        sortDirection,
        userId
      );

      // Create a paginated response with the filtered notifications
      const response = createPaginatedResponse(
        rows,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
    
      handleError(next, error);
    }
  }
}
