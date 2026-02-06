import axios, { AxiosRequestConfig } from 'axios';

/**
 * @author saneeshiv
 * @description Sends a text message using the SMS API.
 */

import { smsConfig } from '../config/smsConfig';
import { Logger } from '../utils/logger';

/**
 * Sends a text message using the SMS API.
 *
 * @param template - The text message template to be sent.
 * @param phone - The recipient's phone number.
 * @param senderId - The sender ID for the SMS.
 * @returns A promise that resolves to a boolean indicating success or failure.
 */
export const sendTextMessage = async (
  template: string,
  phone: string,
  senderId: string
): Promise<boolean> => {
  try {
    const authKey: string = smsConfig.auth_key;
    const authToken: string = smsConfig.auth_token;

    // Set up the options for the SMS API request
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: smsConfig.url,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: authKey,
        password: authToken,
      },
      data: JSON.stringify({
        Text: template,
        Number: phone,
        SenderId: senderId,
        DRNotifyUrl: smsConfig.DRNotifyUrl,
        DRNotifyHttpMethod: 'POST',
        Tool: 'API',
      }),
    };

    // Send the SMS using Axios
    const response = await axios(options);
    Logger.log('sendTextMessage response:', response.data);
    return true;
  } catch (error) {
    Logger.error('sendTextMessage error:', error);
    return false;
  }
};
