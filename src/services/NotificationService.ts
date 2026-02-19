/**
 * @author saneeshiv
 * @class NotificationService
 * @description Service class for handling CRUD operations related to the Notification model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  EmailConfig,
  NotificationSetting,
  SmsConfig,
  SmsConfigStatus,
  Notification,
  Company,
  Venue,
} from '../models/init-models';
import { enumRoll, enumSMSConfig } from '../utils/enum';
import { sendTextMessage } from '../helper/smsHelper';
import {
  InviteEventDTO,
  NotificationCreateDTO,
  NotificationFilterDTO,
  NotificationSettingListRequestDTO,
  UpdateNotificationSettingDTO,
} from '../dtos/notification/NotificationDTO';
import { MailVars, sendEmail } from '../helper/emailHelper';
import { Op, Transaction, WhereOptions } from 'sequelize';
import axios from 'axios';
import { FilterDTO } from '../dtos/tax/TaxDTO';
import { Event } from '../models/init-models';

export class NotificationService {
  private notificationSettingBaseService: BaseService<NotificationSetting>;
  private notificationBaseService: BaseService<Notification>;
  private smsConfigBaseService: BaseService<SmsConfig>;
  private smsConfigStatusBaseService: BaseService<SmsConfigStatus>;
  private emailConfigBaseService: BaseService<EmailConfig>;
  private eventBaseService: BaseService<Event>;

  constructor() {
    this.smsConfigBaseService = new BaseService(
      SmsConfig as unknown as { new (): SmsConfig } & typeof SmsConfig
    );
    this.smsConfigStatusBaseService = new BaseService(
      SmsConfigStatus as unknown as {
        new (): SmsConfigStatus;
      } & typeof SmsConfigStatus
    );
    this.notificationSettingBaseService = new BaseService(
      NotificationSetting as unknown as {
        new (): NotificationSetting;
      } & typeof NotificationSetting
    );
    this.notificationBaseService = new BaseService(
      Notification as unknown as {
        new (): Notification;
      } & typeof Notification
    );
    this.emailConfigBaseService = new BaseService(
      EmailConfig as unknown as {
        new (): EmailConfig;
      } & typeof EmailConfig
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
  }

  /**
   * Fetches a list of notification settings based on filters, pagination, and sorting options.
   *
   * @param {NotificationSettingListRequestDTO} filters - The filtering criteria for fetching notification settings.
   * @param {number} limit - The number of records to fetch.
   * @param {number} offset - The number of records to skip (used for pagination).
   * @param {string} sortBy - The field name to sort the results by.
   * @param {string} sortDirection - The sorting direction ('ASC' or 'DESC').
   * @returns {Promise<{ rows: NotificationSetting[]; count: number }>} - A promise resolving to an object containing the total count and the list of notification settings.
   */
  async getAllNotificationSettings(
    filters: NotificationSettingListRequestDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: NotificationSetting[]; count: number }> {
    try {
      const { count, rows } =
        await this.notificationSettingBaseService.findAndCountAll({
          where: { ...filters },
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]], // Adding sorting to the query
        });

      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllNotificationSettings:', error);
      throw error;
    }
  }

  /**
   * Fetches a single notification setting by the action name.
   *
   * @param {string} actionName - The name of the action to fetch the notification setting for.
   * @returns {Promise<NotificationSetting | null>} - A promise that resolves to the notification setting if found, otherwise null.
   * @throws Will throw an error if the database query fails.
   */
  async getNotificationSettingByActionName(
    actionName: string,
    transaction?: Transaction
  ): Promise<NotificationSetting | null> {
    try {
      const settingData = await this.notificationSettingBaseService.findOne({
        where: { actionName: actionName },
        transaction,
      });

      return settingData;
    } catch (error) {
      Logger.error('Error getNotificationSettingByActionName:', error);
      throw error;
    }
  }

  /**
   * Retrieves the email configuration for a given configuration name.
   *
   * This method queries the email configuration based on the provided `configName`.
   * If the configuration is found, it is returned; otherwise, `null` is returned.
   * An optional transaction can be provided for database consistency.
   *
   * @param {string} configName - The name of the email configuration to retrieve.
   * @param {Transaction} [transaction] - An optional transaction for managing the query's database transaction.
   * @returns {Promise<EmailConfig | null>} - A promise that resolves to the email configuration object if found, or null if not found.
   * @throws Will throw an error if the database query fails.
   */
  async getEmailConfigByConfigName(
    configName: string,
    transaction?: Transaction
  ): Promise<EmailConfig | null> {
    try {
      const settingData = await this.emailConfigBaseService.findOne({
        where: { configName: configName },
        transaction,
      });

      return settingData;
    } catch (error) {
      Logger.error('Error getEmailConfigByConfigName:', error);
      throw error;
    }
  }

  /**
   * Updates a notification setting by its ID.
   *
   * @param {number} id - The ID of the notification setting to be updated.
   * @param {UpdateNotificationSettingDTO} updateData - The data to update the notification setting with.
   * @returns {Promise<[number, NotificationSetting[] | undefined]>} - A promise that resolves to an array where the first element is the number of affected rows and the second element is the updated notification settings (if available).
   * @throws Will throw an error if the update operation fails.
   */
  async updateNotificationSetting(
    id: number,
    updateData: UpdateNotificationSettingDTO
  ): Promise<[number, NotificationSetting[] | undefined]> {
    try {
      return this.notificationSettingBaseService.update(id, updateData);
    } catch (error) {
      Logger.error('Error updateCompany:', error);
      throw error;
    }
  }

  /**
   * Fetches a notification setting by its ID or throws an error if it is not found.
   *
   * @param {number} id - The ID of the notification setting to fetch.
   * @returns {Promise<NotificationSetting>} - A promise that resolves to the notification setting if found.
   * @throws Will throw an error if the notification setting with the given ID is not found.
   */
  async getNotificationSettingOrThrow(
    id: number
  ): Promise<NotificationSetting> {
    try {
      const ns = await this.notificationSettingBaseService.findById(id);
      if (!ns) {
        throw new Error('Notification setting not found'); // You can customize the error message or use a custom error class
      }
      return ns;
    } catch (error) {
      Logger.error('Error getNotificationSettingOrThrow:', error);
      throw error;
    }
  }

  /**
   * Sends an email based on the specified action, template, and recipient address.
   *
   * @param {Object} params - The parameters for sending the email.
   * @param {string} params.actionName - The action name to fetch the relevant notification setting.
   * @param {string} params.toAddress - The recipient's email address.
   * @param {string} [params.cc] - The email address for carbon copy (optional).
   * @param {MailVars} [params.mailVars] - The email variables (optional).
   * @returns {Promise<boolean>} - A promise that resolves to true if the email is successfully sent, otherwise false.
   */
  async sendEmailNotification(
    {
      actionName,
      toAddress,
      cc,
      mailVars,
      attachments,
    }: {
      actionName: string;
      cc?: string;
      toAddress: string;
      mailVars?: MailVars;
      attachments?: Array<{
        filename: string;
        content: Buffer;
        path?: string;
        contentType?: string;
      }>;
      message?: string; // Optional parameter
    },
    transaction?: Transaction
  ): Promise<boolean> {
    const actionData = await this.getNotificationSettingByActionName(
      actionName,
      transaction
    );

    if (
      actionData === null ||
      !actionData.dataValues ||
      actionData.dataValues.isEnabled === 0 ||
      actionData.dataValues.email === 0
    ) {
      return false;
    }

    const emailConfigData = await this.getEmailConfigByConfigName(
      actionName,
      transaction
    );

    if (!emailConfigData || !emailConfigData.dataValues.enabled) {
      return false;
    }

    await sendEmail({
      subject: emailConfigData.dataValues.subject,
      templateMail: emailConfigData.dataValues.template,
      to: toAddress,
      cc: cc,
      mailVars: mailVars,
      attachments,
    });

    return true;
  }

  /**
   * Sends an SMS notification based on the action and SMS configuration settings.
   *
   * @param {string} actionName - The name of the action for which the SMS notification is triggered.
   * @param {string} to - The recipient's phone number where the SMS should be sent.
   * @param {string} configName - The name of the SMS configuration to use (e.g., sender ID, template).
   * @param {any} smsObj - An object containing dynamic data to be populated into the SMS template.
   * @returns {Promise<boolean>} - Returns true if the SMS notification was successfully sent, otherwise false.
   */
  async sendSMSNotification(
    actionName: string,
    to: string,
    configName: string,
    smsObj: any,
    transaction?: Transaction
  ): Promise<boolean> {
    const actionData = await this.getNotificationSettingByActionName(
      actionName,
      transaction
    );
    if (
      actionData === null ||
      !actionData.dataValues ||
      actionData.dataValues.isEnabled === 0 ||
      actionData.dataValues.sms === 0
    ) {
      return false;
    }

    // Get the SMS configuration data
    const smsConfigData = await this.checkSMSConfigEnabled(configName);
    if (
      !smsConfigData ||
      !smsConfigData.dataValues ||
      !smsConfigData.dataValues.senderId
    ) {
      return false;
    }

    const newTemplate: string | undefined = await this.generateSMSTemplate(
      smsObj,
      configName,
      smsConfigData.dataValues.templateBody
    );

    if (newTemplate === undefined) {
      return false;
    }
    // Prepare the request body for adding the SMS to the message queue
    sendTextMessage(newTemplate, to, smsConfigData.dataValues.senderId);
    return true;
  }

  /**
   * Verifies the Google reCAPTCHA response provided by the client.
   * This function sends a POST request to Google's reCAPTCHA verification API
   * with the user's captcha response and the server-side secret key to check
   * if the captcha was valid.
   *
   * @param gRecaptcha - The reCAPTCHA token received from the client-side form submission.
   * @returns {Promise<boolean | null>} - Returns `true` if the verification is successful,
   *                                      `false` if verification fails, or `null` in case of an error.
   * @throws {Error} - If an error occurs during the HTTP request or the API response handling.
   */
  async verifyGoogleRecaptcha(gRecaptcha: string): Promise<boolean | null> {
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const captcha = gRecaptcha;
      // Send a POST request to Google's reCAPTCHA verification endpoint.
      const response = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        null,
        {
          params: {
            secret: secretKey,
            response: captcha,
          },
        }
      );
      // Check if the verification response indicates success.
      if (!response.data.success) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      Logger.error('Error verifyGoogleRecaptcha:', error);
      throw error;
    }
  }

  /**
   * Checks if the given SMS configuration is enabled.
   *
   * @param {string} configName - The name of the SMS configuration to check.
   * @returns {Promise<SmsConfig | undefined>} - Returns the SMS configuration if enabled, otherwise undefined.
   */
  private async checkSMSConfigEnabled(
    configName: string,
    transaction?: Transaction
  ): Promise<SmsConfig | undefined> {
    const smsStatusData = await this.getSmsConfigStatus('ENABLED', transaction);
    const configData = await this.smsConfigBaseService.findOne(
      {
        where: {
          enabled: true,
          configName: configName,
          statusId: smsStatusData?.dataValues.id,
        },
      },
      transaction
    );

    if (!configData) {
      return undefined;
    }

    return configData;
  }

  /**
   * Generates a filled SMS template based on the provided configuration name and SMS data.
   *
   * @param smsData - An object containing data for the SMS, including the OTP value.
   * @param configName - The name of the SMS configuration to determine the template behavior.
   * @param smsTemplate - The SMS template string containing placeholders to be replaced.
   * @returns A promise that resolves to the filled SMS template as a string, or undefined
   */
  private async generateSMSTemplate(
    smsData: any,
    configName: String,
    smsTemplate: string
  ): Promise<string | undefined> {
    let filledTemplate: string | undefined;

    if (configName === enumSMSConfig.USER_REGISTRATION_OTP) {
      filledTemplate = smsTemplate.replace('{otp}', smsData.otp || '');
    } else {
      return undefined;
    }
    return filledTemplate; // Return the filled template
  }

  /**
   * Retrieves the SMS configuration status by its name.
   *
   * @param statusName - The name of the SMS configuration status to retrieve.
   * @returns A promise that resolves to the SmsConfigStatus object if found, or
   *          null if no matching status is found.
   * @throws An error if the database query fails.
   */
  private async getSmsConfigStatus(
    statusName: string,
    transaction?: Transaction
  ): Promise<SmsConfigStatus | null> {
    try {
      return this.smsConfigStatusBaseService.findOne(
        {
          where: { statusName: statusName },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getSmsConfigStatus:', error);
      throw error;
    }
  }

  /**
   * Sends email invitations to a list of users for a specific event.
   *
   * @param {InviteEventDTO} invitationData - The data containing the email addresses, event name, and event URL.
   * @param {Transaction} [transaction] - Optional transaction object for database operations, if needed.
   *
   * @throws {Error} - If an error occurs during the email sending process, it will be logged and rethrown.
   */
  async inviteUsersByEmail(
    userId: number,
    invitationData: InviteEventDTO,
    company?: Company,
    transaction?: Transaction
  ) {
    try {
      const event = await this.eventBaseService.findById(
        invitationData.eventId,
        {
          include: [
            {
              model: Venue,
              as: 'venue',
            },
          ],
        }
      );
      if (!event) {
        const errorMessage = `Event with Id ${invitationData.eventId} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      const actionData = await this.getNotificationSettingByActionName(
        'EVENT_SHARE',
        transaction
      );

      // Loop through each email in the invitation data and send an email notification.
      invitationData.emails.forEach(async (email) => {
        const dateTime = event?.dataValues.startTime;
        const formattedDate = dateTime.toISOString(); // Convert to ISO string (e.g., "2026-02-14T13:00:00.000Z")
        const [date, time] = formattedDate.split('T'); // Split at 'T'
        if (actionData) {
          const metaDetails = {
            year: new Date().getFullYear().toString(),
            EVENTNAME: invitationData.eventName,
            EVENTURL: invitationData.eventUrl,
            LOCATION: event?.venue
              ? event?.venue.dataValues.name +
                ',' +
                event?.venue.dataValues.city
              : `it's a Online Event`,
            DATE: date,
            TIME: time.split('.')[0],
            email: email,
            NOTES: invitationData.notes,
            companyName: company?.dataValues.companyName,
          };
          //notification create request
          const req: NotificationCreateDTO = {
            userId: userId,
            templateId: actionData?.dataValues.id,
            metadata: JSON.stringify(metaDetails),
            recipient: email,
            sendStatus: 0,
            createdBy: userId,
            modifiedBy: userId,
          };
          //Add email send entry to notification
          await this.createNotification(userId, req, transaction);
        }
      });
    } catch (error) {
      Logger.error('Error inviteUsersByEmail:', error);
      throw error;
    }
  }

  /**
   * Sending Registration confirmation Email for registered user
   * Sending Event Tag as attachment
   */
  sendingConfirmationEmailForParticipants(
    mailData: MailVars,
    userEmail: string,
    userId: string,
    pdfBuffer: Buffer,
    transaction?: Transaction
  ) {
    try {
      this.sendEmailNotification(
        {
          actionName: 'EVENT_REGISTRATION',
          toAddress: userEmail,
          mailVars: mailData,
          attachments: [
            {
              filename: userId + '- event_details.pdf',
              content: pdfBuffer, // The buffer containing the PDF
              contentType: 'application/pdf', // MIME type for PDF
            },
          ],
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error inviteUsersByEmail:', error);
      throw error;
    }
  }

  /**
   * Create notification
   * @param userId
   * @param orderData
   * @param applyCoupon
   * @param transaction
   */
  async createNotification(
    userId: number | null,
    data: NotificationCreateDTO,
    transaction?: Transaction
  ): Promise<Notification> {
    try {
      const response = this.notificationBaseService.create(data, transaction);
      return response;
    } catch (error) {
      Logger.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * List events.
   * @param eventData - The data to list event.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the list Event.
   */
  async listNotifications(
    filters: NotificationFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: Notification[]; count: number }> {
    try {
      const condition: WhereOptions = {};

      // Apply event filters based on provided filters object
      if (filters?.type) {
        condition.type = filters.type;
      } else {
        condition.type = 'EMAIL'; //By default list Email Notifications
      }
      if (filters?.id) {
        condition.id = filters.id;
      }
      if (filters?.sendStatus) {
        condition.sendStatus = filters.sendStatus;
      } else {
        condition.sendStatus = 1;
      }
      if (filters?.userId) {
        condition.userId = filters.userId;
      }

      // Fetch parent events that match the condition
      const { count, rows } =
        await this.notificationBaseService.findAndCountAll({
          where: { ...condition },

          order: [[sortBy, sortDirection.toUpperCase()]],
        });

      return { rows: rows, count: count };
    } catch (error) {
      Logger.error('Error listing notifications:', error);
      throw error;
    }
  }
}
