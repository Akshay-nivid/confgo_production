import { firebaseAdmin } from "../config/firebaseConfig";

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string }; // Optional custom data
}
/**
 * Service - Sending Notification to user device
 * @author Neethu
 */
export class PushNotificationService {
  /**
   * Sending Notification to User device
   * @param token 
   * @param payload 
   */
  static async sendToDevice(token: string, payload: NotificationPayload): Promise<void> {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
      token,
    };

    try {
      const response = await firebaseAdmin.messaging().send(message);
      console.log("Notification sent successfully:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }


}
