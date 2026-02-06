import { EventRegistrationForm } from '../../models/init-models';
import { ResponseDTO } from '../ResponseDTO';

/**
 * Interface representing the schema for creating an event registration form.
 */
export interface CreateEventRegistrationFormSchemaDTO {
  eventId: number;
  name?: string;
  participantTypeId?: number;
  metadata: string;
}

export interface FormRequestDTO {
  eventId: number;
  name: string;
  participantTypeId?: number;
  metadata: string;
  createdBy: number;
  modifiedBy: number;
}
/**
 * Interface representing the schema for creating multiple event registration forms.
 */
export interface FormDataDTO {
  participantTypeId?: number;
  data: CreateEventRegistrationFormSchemaDTO[];
}

/**
 * Interface representing the request data for creating multiple event registration forms.
 */
export interface CreateEventRegistrationFormsRequestDTO {
  eventId: number;
  formData: FormDataDTO[];
}

/**
 * Represents the response structure for an event registration form.
 * This DTO is used when sending event registration form data back to the client.
 */
export interface EventRegistrationFormResponseDTO {
  id: number;
  eventId?: number;
  name?: string;
  participantTypeId?: number;
  metadata?: string;
}

/**
 * Creates a response DTO for the event registration forms created.
 *
 * @param {EventRegistrationForm[]} events - An array of event registration form objects.
 * @returns {ResponseDTO<EventRegistrationFormResponseDTO[]>} - A response object containing
 * the status, message, and data for the created event registration forms.
 */
export const createEventRegistrationFormResponse = (
  events: EventRegistrationForm[]
): ResponseDTO<EventRegistrationFormResponseDTO[]> => {
  // Map through the events array to create an array of response DTOs
  const response: EventRegistrationFormResponseDTO[] = events.map((event) => ({
    id: event.id,
    eventId: event.eventId,
    name: event.name,
    participantTypeId: event.participantTypeId,
    metadata: event.metadata,
  }));

  return {
    status: 'success',
    message: 'Event form(s) created successfully',
    data: response,
  };
};

/**
 * Generates a response for listing event registration form data.
 *
 * @param event - Array of EventRegistrationForm objects or null if no data is available
 * @returns ResponseDTO with a status, message, and an array of EventRegistrationFormResponseDTO objects
 */
export const listEventRegistrationFormResponse = (
  event: EventRegistrationForm[] | null
): ResponseDTO<EventRegistrationFormResponseDTO[]> => {
  if (!event || event.length === 0) {
    return {
      status: 'error',
      message: 'Event registration form not found',
      data: [],
    };
  }
  const response = event.map((item) => ({
    id: item.id,
    eventId: item.eventId,
    name: item.name,
    participantTypeId: item.participantTypeId,
    metadata: item.metadata,
  }));
  return {
    status: 'success',
    message: 'Event registration form',
    data: response,
  };
};

export interface EventRegistratFormFilterDTO {
  id?: number;
  addonId?: number;
  amount?: string;
  startDate?: Date;
  endDate?: Date;
  tier?: string;
  companyId?: number;
  description?: string;
  statusId?: number;
  createdBy?: number;
}
