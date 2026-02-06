import { Logger } from '../utils/logger';
import {
  EmailConfig,
  Notification,
  Event,
  NotificationSetting,
  Participant,
  User,
  Venue,
  UserRole,
  Role,
  Volunteer,
  VolunteerEvent,
  EventSpeaker,
  UserAbstract,
  Subscription,
  Plan,
  UserCompany,
  Company,
} from '../models/init-models';
import { BaseService } from './BaseService';
import { enumEventStatus, enumNotificationStatus, enumNotificationType, enumSubscriptionStatus, enumVolunteerStatus } from '../utils/enum';
import { MailVars, sendEmail } from '../helper/emailHelper';
import { Op, Transaction } from 'sequelize';
import { PDFHelper } from '../helper/PdfHelper';
import { PushNotificationService } from './PushNotificationService';
import moment from 'moment';
/**
 * Notification cron job service class
 * @author Neethu
 */
export class NotificationJob {
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
  private static eventBaseService = new BaseService(
    Event as unknown as {
      new(): Event;
    } & typeof Event
  );
  private static participantBaseService = new BaseService(
    Participant as unknown as {
      new(): Participant;
    } & typeof Participant
  );
  private static volunteerBaseService = new BaseService(
    VolunteerEvent as unknown as {
      new(): VolunteerEvent;
    } & typeof VolunteerEvent
  );
  private static eventSpeakerBaseService = new BaseService(
    EventSpeaker as unknown as {
      new(): EventSpeaker;
    } & typeof EventSpeaker
  );
  private static userAbstractBaseService = new BaseService(
    UserAbstract as unknown as {
      new(): UserAbstract;
    } & typeof UserAbstract
  );
  private static subscriptionBaseService = new BaseService(
    Subscription as unknown as {
      new(): Subscription;
    } & typeof Subscription
  );
  /**
   * Process notifications with readstatus 0.
   */
  static async processUnsentNotifications() {
    try {
      while (true) {
        const unsentNotifications = await this.notificationBaseService.findAll({
          where: { sendStatus: enumNotificationStatus.UNSEND,instantNotification:0,
            type:enumNotificationType.EMAIL,
            sendCount: { [Op.lt]: 2 } 
           },
          limit: 10,
        });
        // Exit the loop if no unsent notifications are found
        if (unsentNotifications.length === 0) break;
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
   *  Processing notification with instant notify.
   */
  static async processFrequentNotifications(){
    try{
      while(true){
        const unsentNotifications = await this.notificationBaseService.findAll({
          where: { sendStatus: enumNotificationStatus.UNSEND, instantNotification: 1,type:enumNotificationType.EMAIL },
          limit: 10,
        });

        // Exit the loop if no unsent notifications are found
        if (unsentNotifications.length === 0) break;
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
    }catch (error) {
      Logger.error('Error processing Frequent Notification:', error);
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
    pdfBuffer?: Buffer,
    transaction?: Transaction
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

      if (emailConfigData) {
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
        } else if (templateData?.actionName == 'COMPANY_FORGOT_PASSWORD' || templateData?.actionName == 'USER_FORGOT_PASSWORD') {
          //Company forgot password Email Sending
          emailSent = await this.companyUserForgotPassword(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'EVENT_SHARE') {
          //Company event share Email Sending
          emailSent = await this.shareEventInvitation(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'USER_REGISTRATION') {
          //User Registration Email Sending
          emailSent = await this.companyRegistrationEmailSending(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'EVENT_REMINDER') {
          //Company event reminder Email Sending
          emailSent = await this.reminderEmailSending(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'ROLE_EVENT_REMINDER') {
          //Role based event reminder Email Sending
          emailSent = await this.reminderEmailSending(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'CONTACT_US_SUBMIT' ||
          templateData?.actionName == 'CONTACT_US_SUBMIT_ACKNOWLEDGE'
        ) {
          //Contact us submit Email Sending
          emailSent = await this.contactEmailSending(
            notification,
            template
          );
        }
        else if (templateData?.actionName == 'SPONSORSHIP_INTEREST_SUBMIT' ||
           templateData?.actionName == 'SPONSORSHIP_INTEREST_SUBMIT_ACKNOWLEDGE') {
          //Contact us submit Email Sending
          emailSent = await this.sponsorshipInterestEmailSending(
            notification,
            template
          );
        }
        else if(templateData?.actionName == 'SUBSCRIPTION_EXPIRY') {
          emailSent = await this.subscriptionExpiryEmailSending(
            notification,
            template
          )
        }
        else if(templateData?.actionName == 'OTP_SENDING') {
          emailSent = await this.sendEmailWithOtp(
            notification,
            template
          )
        }
        //Update notification status to 1
        if (emailSent) { 
          notification.sendCount = (notification.sendCount || 0) + 1;

          await this.notificationBaseService.update(notification.id, {
            sendStatus: enumNotificationStatus.SEND,sendCount:notification.sendCount
          });
          Logger.log(`Notification ${notification.id} sent successfully.`);
        } else {
          Logger.warn(`Notification ${notification.id} failed to send.`);
        }
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
      const subject = 'Welcome to Confgo.com';
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
   * Sending reminder email for users
   * @param notification
   * @param template
   */
  static async reminderEmailSending(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = parsedMetaDetails.subject;
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
    } catch (error) {
      Logger.error('Error Reminder Email for Company :', error);
      throw error;
    }
  }
  /**
   * Sending enquiry email - contact us
   * @param notification
   * @param template
   */
    static async contactEmailSending(
      notification: Notification,
      template: string
    ) {
      try {
        const parsedMetaDetails = JSON.parse(
          notification?.dataValues.metadata ?? ''
        );
	        const subject = 'Enquiry Submission';
        return await this.sendEmailNotification(
          parsedMetaDetails,
          parsedMetaDetails.email,
          template,
          '1',
          subject
        );
        
      } catch (error) {
        Logger.error('Error Contact Email to Admin :', error);
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
//function used to remove the unwanted special charectors from location
      function cleanLocationAddress(address: any) {
        return address
          .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters
          .replace(/[^\w\s,.\/-]/g, ''); // Remove special characters except , . / -
      }

      const cleanedAddress = cleanLocationAddress(parsedMetaDetails.location);
      // Instantiate PDFHelper
      const pdfHelper = new PDFHelper();
      // Generate PDF
      const pdfBuffer = await pdfHelper.generatePDFWithQRCode({
        eventName: parsedMetaDetails.eventName,
 url: parsedMetaDetails.url,
        name: parsedMetaDetails.contactName,
        date: parsedMetaDetails.date,
        id: parsedMetaDetails.id,
        qrCode: parsedMetaDetails.qrCode, // QR Code
        location: cleanedAddress,
        phone: parsedMetaDetails.companyPhone,
        email: parsedMetaDetails.companyEmail,
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
      notification.sendCount = (notification.sendCount || 0) + 1;
      await this.notificationBaseService.update(notification.id, {
        sendStatus: enumNotificationStatus.UNSEND,sendCount:notification.sendCount
      });
      Logger.error('Error Registration Success Email for Company :', error);
      throw error;
    }
  }
  /**
   * Sending forgotpassword email for company users
   * @param notification
   * @param template
   */
  static async companyUserForgotPassword(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = 'Forgot Password';
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
    } catch (error) {
      Logger.error('Error Forgot Password Email for Company :', error);
      throw error;
    }
  }
  /**
  * Share Event invitaion to users
  * @param notification
  * @param template
  */
  static async shareEventInvitation(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = 'Event Invitation';
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
    } catch (error) {
      Logger.error('Error share event invite for user :', error);
      throw error;
    }
  }

   /**
   * Sending enquiry email - sponsorship interest
   * @param notification
   * @param template
   */
   static async sponsorshipInterestEmailSending(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = 'Enquiry Submission';
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
      
    } catch (error) {
      Logger.error('Error Sponsorship Interest email to Admin :', error);
      throw error;
    }
  }
 
  /**
   * Sends a subscription expiry reminder email to the user.
   *
   * @param {Notification} notification - The notification object containing metadata.
   * @param {string} template - The email template to be used.
   * @throws {Error} - Throws an error if email sending fails.
   */
  static async subscriptionExpiryEmailSending(
    notification: Notification,
    template: string
  ) {
    try {
      const parsedMetaDetails = JSON.parse(
        notification?.dataValues.metadata ?? ''
      );
      const subject = 'Your Subscription is Expiring Soon!';
      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
      
    } catch (error) {
      Logger.error('Error Subscription Expiry Reminder Email to user :', error);
      throw error;
    }
  }

  /**
   * Sends an email containing an OTP to the user.
   *
   * @param notification - The notification object containing metadata.
   * @param template - The email template to be used.
   * @returns A promise resolving the email sending result.
   */
  static async sendEmailWithOtp(notification: Notification, template: string) {
    try {
      if (!notification?.dataValues?.metadata) {
        throw new Error('Notification metadata is missing');
      }

      const parsedMetaDetails = JSON.parse(notification.dataValues.metadata);
      if (!parsedMetaDetails.email) {
        throw new Error('Email is missing in metadata');
      }

      const subject = 'Your One-Time Password (OTP)';

      return await this.sendEmailNotification(
        parsedMetaDetails,
        parsedMetaDetails.email,
        template,
        '1',
        subject
      );
    } catch (error) {
      Logger.error('Error in sendEmailWithOtp:', error);
      throw error;
    }
  }


  /**
   * Fetch all upcoming event notifications and create reminders
   */
  static async getAllUpcomingEvents() {
    try {
      const { startTime, endTime } = this.getTomorrowTimeRange();

      Logger.info(`Fetching events for tomorrow - ${startTime}`);

      const { rows: events, count: total } = await this.fetchEventsForTomorrow(startTime, endTime);
      if (total === 0) {
        Logger.info('No upcoming events found for tomorrow.');
        return;
      }

      const emailSettingsData = await this.fetchEmailSettings('EVENT_REMINDER');
      const emailRoleSettingsData = await this.fetchEmailSettings('ROLE_EVENT_REMINDER');
      if (emailSettingsData && events && emailRoleSettingsData) {
        //Email Notification
        await this.processEvents(events, emailSettingsData?.dataValues.id);
        await this.processEventsForRoles(events, emailRoleSettingsData?.dataValues.id);

        //Push Notification to user device token
        await this.processUserPushNotificationEvents(events, emailSettingsData?.dataValues.id);

      }
      else
      {
        return;
      }
      Logger.info(`Reminder notifications added successfully.`);
    } catch (error) {
      Logger.error('Error saving upcoming event reminders:', error);
      throw error;
    }
  }

  /**
   * Get the start and end time for tomorrow
   * @returns {Object} An object containing startTime and endTime in ISO format
   */
  static getTomorrowTimeRange() {
    const startOfTomorrow = new Date();
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    return {
      startTime: startOfTomorrow.toISOString(),
      endTime: endOfTomorrow.toISOString(),
    };
  }

  /**
   * Fetch events happening tomorrow
   * @param {string} startTime - Start time of the range
   * @param {string} endTime - End time of the range
   * @returns {Object} Object containing rows of events and total count
   */
  static async fetchEventsForTomorrow(startTime: string, endTime: string) {
    const eventCondition = {
      published: true,
      statusId: enumEventStatus.ACTIVE,
      startTime: {
        [Op.between]: [startTime, endTime],
      },
      parentId: {
        [Op.is]: null,
      },
    };

    return await this.eventBaseService.findAndCountAll({
      where: eventCondition,
      include: [{ model: Venue, as: 'venue' }],
    });
  }

  /**
   * Fetch email template settings
   * @param {string} actionName - The action name to fetch the settings for
   * @returns {Object} The email settings data
   */
  static async fetchEmailSettings(actionName: string): Promise<NotificationSetting | null> {
    return await this.notificationSettingBaseService.findOne({
      where: { actionName },
    });
  }

  /**
   * Process events and create notifications
   * @param {Array} events - Array of event data
   * @param {Object} emailSettingsData - Email template settings
   */
  static async processEvents(events: Event[], emailSettingsData: number) {
    await Promise.all(
      events.map(async (event: any) => {
        const participants = await this.fetchParticipants(event.dataValues.id);
        const notifications =await this.createNotifications('USER',event, participants, emailSettingsData);

        await this.notificationBaseService.bulkCreate(notifications);
      })
    );
  }

  /**
   * Process events and create push notifications
   * @param {Array} events - Array of event data
   * @param {Object} emailSettingsData - Email template settings
   */
  static async processUserPushNotificationEvents(events: Event[], emailSettingsData: number) {
    await Promise.all(
      events.map(async (event: any) => {
        const participants = await this.fetchParticipants(event.dataValues.id);
        
        //Creating an entry to notification table and send notification to  device token
        const notifications = this.createPushNotifications('USER',event, participants, emailSettingsData);

       
      })
    );
  }
  /**
   * Process events and create notifications for speaker ,reviewer and volunteer
   * @param {Array} events - Array of event data
   * @param {Object} emailSettingsData - Email template settings
   */
  static async processEventsForRoles(events: Event[], emailRoleSettingsData: number) {
    await Promise.all(
      events.map(async (event: any) => {
        //Volunteer
        const volunteers = await this.fetchVolunteers(event.dataValues.id);
        const notifications =await this.createNotifications('VOLUNTEER',event, volunteers, emailRoleSettingsData);
        await this.notificationBaseService.bulkCreate(notifications);

        //Speaker 
        const speakers = await this.fetchSpeakers(event.dataValues.id);
        const notificationSpeakers = await this.createNotifications('SPEAKER',event, speakers, emailRoleSettingsData);
        await this.notificationBaseService.bulkCreate(notificationSpeakers);

        //Reviewer
        const reviewers = await this.fetchReviewers(event.dataValues.id);
        const notificationReviewers =await this.createNotifications('REVIEWER',event, reviewers, emailRoleSettingsData);
        await this.notificationBaseService.bulkCreate(notificationReviewers);

      })
    );
  }
  /**
   * Fetch participants for an event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of participant data
   */
  static async fetchParticipants(eventId: number) {
    return await this.participantBaseService.findAll({
      where: { eventId },
      include: [
        { model: User, as: 'user' ,
          include: [
            { model: UserRole, as: 'userRoles' ,
              include: [
                { model: Role, as: 'role'   
                }],}],
            }
      ],
    });
  }
  /**
   * Fetch volunteers for an event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of participant data
   */
  static async fetchVolunteers(eventId: number) {
    return await this.volunteerBaseService.findAll({
      where: {
        eventId: eventId,
        statusId: enumVolunteerStatus.ACTIVE,
      },
      include: [
        { model: User, as: 'user' }
      ],
    });

  }
  /**
   * Fetch Speakers for an event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of participant data
   */
    static async fetchSpeakers(eventId: number) {
      const speakers = await this.eventSpeakerBaseService.findAll({
        where: {
          parentEventId: eventId,
          statusId: enumVolunteerStatus.ACTIVE,
        },
        include: [
          { model: User, as: 'user' }
        ],
      });

      const uniqueSpeakers = speakers.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.userId === value.userId)
      );

      return uniqueSpeakers;
    }
/**
   * Fetch Reviewers for an event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of participant data
   */
    static async fetchReviewers(eventId: number) {
      const reviewers =  await this.userAbstractBaseService.findAll({
        where: {
          eventId: eventId
        },
        include: [
          { model: User, as: 'reviewer' }
        ],
      });

      const uniqueReviewers = reviewers.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.reviewerId === value.reviewerId)
      );

      return uniqueReviewers;
    }
    /**
   * Fetch Speakers for an event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of participant data
   */
    static async fetchReviewer(eventId: number) {
      return await this.eventSpeakerBaseService.findAll({
        where: {
          parentEventId: eventId,
          statusId: enumVolunteerStatus.ACTIVE,
        },
        include: [
          { model: User, as: 'user' }
        ],
      });
  
    }
  /**
   * Create notifications for participants
   * @param {Object} event - Event data
   * @param {Array} participants - Array of participant data
   * @param {Object} emailSettingsData - Email template settings
   * @returns {Array} Array of notification objects
   */
  static createNotifications(role:string,event: any, participants: any, emailSettingsId: number) {
    const roleMessages:any = {
      REVIEWER:
        "As a <b>Reviewer</b>, please be prepared to review the submitted materials. Your feedback is valuable in ensuring the success of the event. Be sure to check your schedule for review assignments.",
      SPEAKER:
        "As a <b>Speaker</b>, please make sure to prepare your presentation materials and be ready for your session. We look forward to hearing your insights!",
      VOLUNTEER:
        "As a <b>Volunteer</b>, your support during the event is greatly appreciated. Please ensure that you check the volunteer schedule and report to your assigned area on time.",
    };
    return participants.map((participant: any) => ({
      eventId: event.dataValues.id,
      templateId: emailSettingsId,
      metadata: JSON.stringify({
        year:new Date().getFullYear().toString(),
        description:roleMessages[role],
        role:role,
        subject: `Event Reminder: '${event.dataValues.name}'`,
        userId: participant.dataValues.user.dataValues.id,
        contactName: participant.dataValues.user.dataValues.firstName,
        eventName: event.dataValues.name,
        eventStartTime: moment(event.dataValues.eventStartTime).format("MMM DD YYYY hh:mm:ss A"),
        eventEndTime: event.dataValues.eventEndTime,
        location: event.dataValues?.venue
          ? `${event.dataValues.venue.address}, ${event.dataValues.venue.city}`
          : 'Online',
        email: participant.dataValues.user.dataValues.email,
      }),
      userId: participant.dataValues.user.dataValues.id,
      recipient: participant.dataValues.user.dataValues.email,
      message: `Reminder: Your event "${event.dataValues.name}" starts at ${event.dataValues.eventStartTime}.`,
      sendStatus: 0,
      createdBy: 0,
      modifiedBy: 0,
    }));
  }
    /**
   * Create push notifications for participants
   * @param {Object} event - Event data
   * @param {Array} participants - Array of participant data
   * @param {Object} emailSettingsData - Email template settings
   * @returns {Array} Array of notification objects
   */
    static async createPushNotifications(role: string, event: any, participants: any, emailSettingsId: number) {
      const roleMessages: any = {
        REVIEWER:
          "As a <b>Reviewer</b>, please be prepared to review the submitted materials. Your feedback is valuable in ensuring the success of the event. Be sure to check your schedule for review assignments.",
        SPEAKER:
          "As a <b>Speaker</b>, please make sure to prepare your presentation materials and be ready for your session. We look forward to hearing your insights!",
        VOLUNTEER:
          "As a <b>Volunteer</b>, your support during the event is greatly appreciated. Please ensure that you check the volunteer schedule and report to your assigned area on time.",
      };
    
      // Create notification data for each participant
      const notifications = participants.map((participant: any) => ({
        eventId: event.dataValues.id,
        type: 'PUSH',
        metadata: JSON.stringify({
          title: `Event Reminder: '${event.dataValues.name}'`,
          body: `Start Time '${event.dataValues.eventStartTime}'`,
          data: {
            deviceToken:participant.dataValues.user.dataValues.deviceToken,
            eventName: event.dataValues.name,
            description: roleMessages[role],
            email: participant.dataValues.user.dataValues.email,
          },
        }),
        userId: participant.dataValues.user.dataValues.id,
        recipient: participant.dataValues.user.dataValues.email,
        message: `Reminder: Your event "${event.dataValues.name}" starts at ${event.dataValues.eventStartTime}.`,
        sendStatus: 1,
        createdBy: 0,
        modifiedBy: 0,
      }));
    
      // Send push notifications in parallel
      await Promise.all(
        participants.map(async (participant: any) => {
          const data = {
            title: `Reminder: Your event "${event.dataValues.name}" starts at ${event.dataValues.eventStartTime}.`,
            body: `Location : '${event.dataValues?.venue
              ? `${event.dataValues.venue.address}, ${event.dataValues.venue.city}`
              : 'Online'}'`,
          };
         
          const deviceToken = participant.dataValues.user.dataValues.deviceToken; // Ensure this field exists
          if (deviceToken) {
            //Here i send notification to user device
             PushNotificationService.sendToDevice(deviceToken, data);
          
          }
        })
      );
      //make an entry to notification table
      await this.notificationBaseService.bulkCreate(notifications);
      return notifications;
    }
    

  /**
   * Process subscriptions that are about to expire and send email notifications.
   */
  static async processExpiringSubscriptions() {
    try {
      while (true) {
        const templateData = await this.notificationSettingBaseService.findOne({
          where: { actionName: 'SUBSCRIPTION_EXPIRY' },
        });
        // Get today's date
        const today = new Date();

        // Get the date 7 days from now (set to start of the day)
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 7);
        futureDate.setHours(0, 0, 0, 0); // Start of the day

        // Get the end of the same future date
        const futureDateEnd = new Date(futureDate);
        futureDateEnd.setHours(23, 59, 59, 999); // End of the day

        const subscriptionCondition = {
          endDate: {
            [Op.between]: [futureDate, futureDateEnd],
          },
          extendedPlanId: { [Op.is]: null },
        };
        const expiringSubscriptions =
          await NotificationJob.subscriptionBaseService.findAll({
            where: subscriptionCondition,
            include: [
              {
                model: User,
                as: 'user',
                include: [
                  {
                    model: UserCompany,
                    as: 'userCompanies',
                    include: [
                      {
                        model: Company,
                        as: 'company',
                      },
                    ],
                  },
                ],
              },
              {
                model: Plan,
                as: 'plan',
              },
            ],
          });

        // Exit the function if no expiring subscriptions are found
        if (!expiringSubscriptions || expiringSubscriptions.length === 0)
          return;

        for (const subscription of expiringSubscriptions) {
          try {

            // breaking the loop if user company dont have data
            if (subscription.user.userCompanies.length === 0) break;

            if (
              subscription.dataValues.statusId ===
                enumSubscriptionStatus.ACTIVE &&
              subscription.dataValues.endDate
            ) {
              // formatting date to show in email
              const formattedEndDate = subscription.dataValues.endDate
                .toISOString()
                .replace('T', ' ')
                .split('.')[0];

              // creating entry in notification table
              const notificationReq = {
                templateId: templateData?.dataValues.id,
                userId: subscription.dataValues.userId,
                recipient:
                  subscription.user.userCompanies[0].company.dataValues.email,
                metadata: JSON.stringify({
                  year:new Date().getFullYear().toString(),
                  contactName:
                    subscription.user.userCompanies[0].company.dataValues
                      .companyName,
                  email:
                    subscription.user.userCompanies[0].company.dataValues.email,
                  phone:
                    subscription.user.userCompanies[0].company.dataValues.phone,
                  plan: subscription.plan.dataValues.name.replace(/_/g, ' '),
                  expiryDate: formattedEndDate,
                }),
                sendStatus: 0,
                createdBy: subscription?.dataValues.userId || 0,
                modifiedBy: 0,
              };
              await this.notificationBaseService.create(notificationReq);
            }
          } catch (error) {
            Logger.error(
              `Failed to send subscription expiry email for subscription ID: ${subscription.id}`,
              error
            );
          }
        }
      }
    } catch (error) {
      Logger.error('Error processing expiring subscriptions:', error);
    }
  }

  /**
   * Periodically processes and updates expired subscriptions.
   * This function runs in a continuous loop to check for subscriptions
   * that have passed their end date and updates their status to "EXPIRED".
   */
  static async processUpdateExpiredSubscription() {
    try {
      while (true) {
        // Fetch all subscriptions that have expired but are still marked as ACTIVE
        const expiredSubscription = await this.subscriptionBaseService.findAll({
          where: {
            endDate: { [Op.lte]: new Date() },
            statusId: enumSubscriptionStatus.ACTIVE,
          },
        });

        // If no expired subscriptions are found, exit the loop
        if (expiredSubscription.length === 0) break;

        // Iterate over each expired subscription and update its status to EXPIRED
        for (const subscription of expiredSubscription) {
          await this.subscriptionBaseService.update(
            subscription?.dataValues.id,
            { statusId: enumSubscriptionStatus.EXPIRED }
          );
        }
      }
    } catch (error) {
      // Log any errors encountered during the process
      Logger.error('Error processing Updating expired subscriptions:', error);
    }
  }

  /**
   * Processes events that have expired by updating their status to 'EXPIRED'.
   * This function checks for events where the `endDate` is in the past and
   * their `statusId` is not already marked as EXPIRED, then updates their status.
   */
  static async processExpiringEventStatus() {
    try {
      while (true) {
        // Define the condition to identify events that have expired
        const eventCondition = {
          parentId: { [Op.is]: null },
          endTime: { [Op.lt]: new Date() },
          published:true,
          statusId: enumEventStatus.ACTIVE,
        };
         
        // Fetch all events that match the condition (i.e., expired events)
        const expiredEvents = await this.eventBaseService.findAll({
          where: eventCondition,
        });

        // If no expired events are found, exit the loop
        if (expiredEvents.length === 0) break;

        // Update the status of each expired event to 'EXPIRED'
        for (const event of expiredEvents) {
          // If the event has associated programs, update their status to 'EXPIRED'.
          const programs = await this.eventBaseService.findAll({
            where: { parentId: event.dataValues.id },
          });

          if (programs) {
            for (const program of programs) {
              await this.eventBaseService.update(program?.dataValues.id, {
                statusId: enumEventStatus.EXPIRED,
              });
            }
          }

          await this.eventBaseService.update(event?.dataValues.id, {
            statusId: enumEventStatus.EXPIRED,
          });
        }
      }
    } catch (error) {
      // If an error occurs, log it to help with debugging
      Logger.error('Error processing Updating expired events:', error);
    }
  }
}
