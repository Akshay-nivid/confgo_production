/**
 * @author saneeshiv
 * @description Sends an email using the specified template and parameters.
 */

import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { Logger } from '../utils/logger';
import { emailConfig } from '../config/emailConfig';
import config from '../config/index';

// Interface for the mail variables used in the email template
export interface MailVars {
  [key: string]: string;
}
// Interface for the options needed to send an email
interface SendMailOptions {
  to: string;
  cc?: string;
  subject: string;
  templateMail: string;
  mailVars?: MailVars;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string; // MIME type, e.g., 'application/pdf', 'image/png'
  }>;
}

/**
 * Sends an email using the specified template and parameters.
 *
 * @param options - The options for sending the email including recipient, subject, and template details.
 * @returns A promise that resolves to a boolean indicating the success of the email sending operation.
 */
export const sendEmail = async ({
  to,
  cc,
  subject,
  templateMail,
  mailVars,
  attachments, // Add optional attachments
}: SendMailOptions): Promise<boolean> => {
  try {
    if (!to || !subject || !templateMail) {
      throw new Error(
        'Missing required parameters: to, subject, templateMail.'
      );
    }

    // Define template file path
    const template_path = path.join(
      __dirname,
      '..',
      'templates/mail_templates',
      `${templateMail}.html`
    );
    Logger.log('sendEmail template_path > ', template_path);

    // Read the template file synchronously
    const contents = fs.readFileSync(template_path, 'utf8');

    // Replace template placeholders with actual values
    let parsedContents = contents;
    const mailData: MailVars = mailVars || {};
    mailData.URL = config.clientUrl;
    for (const key in mailData) {
      const re = new RegExp(`\\{\\{${key}\\}\\}`, 'g'); // Escape braces for regex
      parsedContents = parsedContents.replace(re, mailData[key]);
    }

    const transporter = nodemailer.createTransport({
      secure: emailConfig.secure,
      host: emailConfig.host,
      port: emailConfig.port,
      auth: {
        user: emailConfig.username,
        pass: emailConfig.password,
      },
      debug: true,
      logger: true,
    });

    // Define mail options
    const mailOptions: Record<string, any> = {
      from: emailConfig.username,
      to: to,
      cc: cc,
      subject: subject,
      html: parsedContents, // Use the replaced template
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    // Send mail asynchronously
    const info = await transporter.sendMail(mailOptions);
    Logger.log('sendEmail info > ', info);

    Logger.log(`sendEmail response: ${info.messageId}`);
    // Close the transporter
    transporter.close();
    return true;
  } catch (error) {
    Logger.error('sendEmail error:', error);
    return false;
  }
};
