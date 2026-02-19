/**
 * @author saneeshiv
 * @description email configuration
 */
// Define the structure of the email configuration
interface IEmailConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  smtp: string;
  secure: boolean;
  /** Sender/from address for outgoing emails (use real address for better deliverability vs noreply) */
  from: string;
}

// Create the email configuration object
export const emailConfig: IEmailConfig = {
  username: process.env.EMAIL_USERNAME!,
  password: process.env.EMAIL_PASSWORD!,
  host: process.env.EMAIL_HOST!,
  port: Number(process.env.EMAIL_PORT!),
  smtp: process.env.EMAIL_SMTP!,
  secure: process.env.EMAIL_SECURE === 'true', // Set to true if using 465, otherwise false
  from: process.env.EMAIL_FROM || 'confgobusiness@gmail.com',
};
