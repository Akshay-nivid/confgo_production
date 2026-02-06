/**
 * @author saneeshiv
 * @description sms configuration
 */
// Define the structure of the sms configuration
interface ISMSConfig {
  auth_key: string;
  auth_token: string;
  url: string;
  DRNotifyUrl: string;
}

// Create the sms configuration object
export const smsConfig: ISMSConfig = {
  auth_key: process.env.SMS_AUTH_KEY!,
  auth_token: process.env.SMS_AUTH_TOKEN!,
  url: process.env.SMS_URL!,
  DRNotifyUrl: process.env.SMS_NOTIFY_URL!,
};
