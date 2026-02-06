import { ResponseDTO } from '../ResponseDTO';

/**
 * @author saneeshiv
 */

/**
 * DTO for updating notification setting.
 * This interface represents the data required to update the notification setting for a user.
 */
export interface UpdateNotificationSettingDTO {
  email?: number;
  sms?: number;
  whatsapp?: number;
  isEnabled?: number;
  actionName?: string;
  description?: string;
}

export const updateNotificationResponse = (
  coupon: UpdateNotificationSettingDTO
): ResponseDTO<UpdateNotificationSettingDTO> => {
  return {
    status: 'success',
    message: 'Notification setting updated successfully',
    data: coupon,
  };
};

export interface NotificationSettingListRequestDTO {
  email?: number;
  sms?: number;
  whatsapp?: number;
  isEnabled?: number;
  actionName?: string;
}

export interface SendContactusDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  gRecaptcha: string;
  message?: string;
}

/**
 * Interface representing the data required to invite users to an event.
 */
export interface InviteEventDTO {
  emails: string[];
  eventName: string;
  eventUrl: string;
  notes: string;
  eventId: number;
}

/**
 * Interface representing the filter
 */
export interface NotificationFilterDTO {
  id: string;
  sendStatus: string;
  userId: string;
  type: string;
}
/**
 * @function updateNotificationSettingResponse
 * @description Formats the response data for notification Setting updates.
 * @param notificationSetting - The notification Setting data to format.
 * @returns The formatted response data.
 */
export const updateNotificationSettingResponse = (
  notificationSetting: NotificationSettingResponseDTO
): ResponseDTO<NotificationSettingResponseDTO> => {
  return {
    status: 'success',
    message: 'Notification setting updated successfully',
    data: notificationSetting,
  };
};

/**
 * @interface NotificationSettingResponseDTO
 * @description Interface for formatting user data in responses.
 */
export interface NotificationSettingResponseDTO {
  id?: number;
  actionName?: string;
  description?: string;
  email?: number;
  sms?: number;
  whatsapp?: number;
  isEnabled?: number;
}

/**
 * @interface NotificationCreateDTO
 * @description Interface for formatting notification request.
 */
export interface NotificationCreateDTO {
  eventId?: number;
  userId?: number;
  templateId?: number;
  message?: string;
  metadata?: string;
  recipient?: string;
  sendStatus: number;
  createdBy: number;
  modifiedBy: number;
}

export interface UpdateNotificationDTO {
  sendStatus?: number;
}

/**
 * Interface for Sponsorship Interest form
 */
export interface SponsorshipInterestDTO {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  jobTitle?: string;
  eventId: number;
  companyName: string;
  gRecaptcha: string;
  message?: string;
}