import {
  EmailConfig,
  Notification,
  NotificationSetting,
} from '../../models/init-models';
import { BaseService } from '../../services/BaseService';
import { Logger } from '../../utils/logger';
import { Transaction } from 'sequelize';
import { enumNotificationStatus } from '../../utils/enum';
import { MailVars, sendEmail } from '../../helper/emailHelper';
import { PDFHelper } from '../../helper/PdfHelper';

/**
 * Notification cron job service class
 * @author Neethu
 */
export class EmailNotificationJob {
  private static emailConfigBaseService = new BaseService(
    EmailConfig as unknown as {
      new(): EmailConfig;
    } & typeof EmailConfig
  );
  private static notificationBaseService = new BaseService(
    Notification as unknown as {
      new(): Notification;
    } & typeof Notification
  );
  private static notificationSettingBaseService = new BaseService(
    NotificationSetting as unknown as {
      new(): NotificationSetting;
    } & typeof NotificationSetting
  );
  /**
   * Process notifications with readstatus 0.
   */
  static async processUnsentNotifications() {
    try {
      while (true) {
        const unsentNotifications = await this.notificationBaseService.findAll({
          where: { sendStatus: enumNotificationStatus.UNSEND },
          limit: 10,
        });
        if (!unsentNotifications.length) break;
        if (unsentNotifications) {
          for (const notification of unsentNotifications) {
            try {
              // Simulate Sending logic
              await this.emailNotificationProcessing(notification);
            } catch (error) {
              Logger.error(
                `Failed to send notification ${notification.id}:`,
                error
              );
            }
          }
        }
      }
    } catch (error) {
      Logger.error('Error processing notifications:', error);
    }
  }

  /**
   * Sends a registration confirmation email to a registered user.
   *
   * This method prepares and sends an email with the specified subject, template,
   * and recipient details. It also allows attaching a PDF file (e.g., event details)
   * as part of the email. The email is sent using the `sendEmail` utility.
   *
   * @param {MailVars} mailData - The dynamic variables to be used in the email template.
   * @param {string} userEmail - The email address of the recipient.
   * @param {string} templateMail - The name or ID of the email template to use.
   * @param {string} userId - The ID of the user, used to name the PDF attachment.
   * @param {string} subject - The subject line of the email.
   * @param {Buffer} [pdfBuffer] - The PDF file content to be attached (optional).
   * @param {Transaction} [transaction] - The database transaction (optional).
   *
   * @throws {Error} Logs and rethrows any errors encountered during the email-sending process.
   */

  static async sendEmailNotification(
    mailData: MailVars,
    userEmail: string,
    templateMail: string,
    userId: string,
    subject: string,
    pdfBuffer?: Buffer
  ) {
    try {
      let attachments;
      //PDF sending attachment details
      if (pdfBuffer) {
        attachments = [
          {
            filename: userId + '- event_details.pdf',
            content: pdfBuffer, // The buffer containing the PDF
            contentType: 'application/pdf', // MIME type for PDF
          },
        ];
      }
      const emailSent = await sendEmail({
        subject: subject,
        templateMail: templateMail,
        to: userEmail,
        mailVars: mailData, // Use updated mailVars
        attachments,
      });
      return emailSent;
    } catch (error) {
      Logger.error('Error Sending Email for Participants:', error);
      throw error;
    }
  }

  /**
   * Processes email notifications based on the provided notification object.
   * Determines the notification type and sends an email with the appropriate
   * template and attachments (e.g., PDFs with QR codes for event registration).
   *
   * Handles specific notification actions such as "EVENT_REGISTRATION"
   * and "COMPANY_REGISTRATION". Updates the notification status to "SEND"
   * upon successful email delivery and logs the outcome.
   *
   * @param {Notification} notification - The notification object containing details like templateId, metadata, etc.
   * @throws Will log and rethrow errors encountered during email processing.
   */
  static async emailNotificationProcessing(notification: Notification) {
    try {
      let emailSent;
      //fetching notification settings template data
      const templateData = await this.notificationSettingBaseService.findOne({
        where: { id: notification.dataValues.templateId },
      });

      //Fetching email configuration details based on the action name from the template data
      const emailConfigData = await this.emailConfigBaseService.findOne({
        where: { configName: templateData?.actionName },
      });
      const template = emailConfigData?.dataValues.template ?? '';

      // Assume API call or email sending here -- Event Registration email
      if (templateData?.actionName == 'EVENT_REGISTRATION') {
        emailSent = await this.eventParticipantEmailSending(
          notification,
          template
        );
      } else if (templateData?.actionName == 'COMPANY_REGISTRATION') {
        //Company Registration Email Sending
        emailSent = await this.companyRegistrationEmailSending(
          notification,
          template
        );
      }
      else if (templateData?.actionName == "COMPANY_FORGOT_PASSWORD") {
        //Company Registration Email Sending
        emailSent = await this.companyUserForgotPassword(notification, template);
      }

      //Update notification status to 1
      if (emailSent) {
        await this.notificationBaseService.update(notification.id, {
          sendStatus: enumNotificationStatus.SEND,
        });
        Logger.log(`Notification ${notification.id} sent successfully.`);
      } else {
        Logger.warn(`Notification ${notification.id} failed to send.`);
      }
    } catch (error) {
      Logger.error('Error Registration Success Email for Company :', error);
      throw error;
    }
  }
  /**
   * Sending registration verify email for company users
   * @param notification
   * @param template
   */
  static async companyRegistrationEmailSending(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = 'Company Registration';
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
    } catch (error) {
      Logger.error('Error Registration Success Email for Company :', error);
      throw error;
    }
  }

  /**
   * Sending registration verify email for company users
   * @param notification
   * @param template
   */
  static async eventParticipantEmailSending(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );

      const subject =
        "Your Registration for '" +
        parsedMetaDetails.eventName +
        "' is Confirmed!";
      // Instantiate PDFHelper
      const pdfHelper = new PDFHelper();
      // Generate PDF
      const pdfBuffer = await pdfHelper.generatePDFWithQRCode({
        eventName: parsedMetaDetails.eventName,
        name: parsedMetaDetails.contactName,
        date: parsedMetaDetails.date,
        id: parsedMetaDetails.id,
 url: parsedMetaDetails?.url,
        qrCode: parsedMetaDetails.qrCode, // QR Code
      });
      //Send Email notification
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject,
        pdfBuffer
      );
    } catch (error) {
      Logger.error('Error Registration Success Email for Company :', error);
      throw error;
    }
  }

  /**
* Sending forgotpassword email for company users
* @param notification 
* @param template 
*/
  static async companyUserForgotPassword(notification: Notification, template: string) {
    try {
      const parsedMetaDetails = JSON.parse(notification?.dataValues.metadata ?? "");
      let subject = "Forgot Password";
      return await this.sendEmailNotification(parsedMetaDetails, parsedMetaDetails.email, template, "1", subject)
    } catch (error) {
      Logger.error('Error Forgot Password Email for Company :', error);
      throw error;
    }
  }

}
