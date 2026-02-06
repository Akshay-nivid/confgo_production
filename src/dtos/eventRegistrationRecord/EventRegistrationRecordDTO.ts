import { EventRegistrationRecord } from '../../models/EventRegistrationRecord';
import { ResponseDTO } from '../ResponseDTO';

export interface CreateEventRegistrationRecordSchemaDTO {
  eventRegistrationFormId: number;
  response?: string;
  participantId: number;
}

export interface CreateEventRegistrationRecordDTO {
  eventId: number;
  data: CreateEventRegistrationRecordSchemaDTO[];
}

export interface EventRegistrationRecordResponseDTO {
  id: number;
  eventId?: number;
  participantId?: number;
  eventRegistrationFormId?: number;
  response?: string;
  createdOn?: Date;
  modifiedOn?: Date;
}

/**
 * function to format the response data for creating a new event registration record.
 * @param registrationRecord - The newly created event registration record from the database.
 * @returns ResponseDTO with success message and formatted event registration data.
 */
export const createEventRegistrationRecordResponse = (
  registrationRecord: EventRegistrationRecord[]
): ResponseDTO<EventRegistrationRecordResponseDTO[]> => {
  const response: EventRegistrationRecordResponseDTO[] = registrationRecord.map(
    (registrationRecord) => ({
      id: registrationRecord.id,
      eventId: registrationRecord.eventId,
      participantId: registrationRecord.participantId,
      eventRegistrationFormId: registrationRecord.eventRegistrationFormId,
      response: registrationRecord.response,
      createdOn: registrationRecord.createdOn,
      modifiedOn: registrationRecord.modifiedOn,
    })
  );
  return {
    status: 'success',
    message: 'Event Registration Record Created',
    data: response,
  };
};

export interface UpdateEventRegistrationRecordDTO {
  eventId?: number;
  participantId?: number;
  eventRegistrationFormId?: number;
  response?: string;
}

export interface UpdateRegistrationRecordParticipantDTO {
  eventId: number;
}
export interface UpdateEventRegistrationRecordResponseDTO {
  id: number;
  eventId?: number;
  participantId?: number;
  eventRegistrationFormId?: number;
  response?: string;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export const updateEventRegistrationRecordResponse = (
  data: UpdateEventRegistrationRecordDTO
): ResponseDTO<UpdateEventRegistrationRecordDTO> => {
  return {
    status: 'success',
    message: 'Event registration record updated successfully',
    data: data,
  };
};

export interface EventRegistrationRecordFilterDTO {
  id?: number;
  userId?: number;
  eventId?: number;
  participantId?: number;
  eventRegistrationFormId?: number;
  response?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}
