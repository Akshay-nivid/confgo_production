import { EventParticipantEntry } from '../../models/EventParticipantEntry';
import { ResponseDTO } from '../ResponseDTO';

export interface AddEventParticipantDTO {
  eventId: number;
  totalSeat: number;
  seatAllocated: number;
  participantTypeId?: number;
  parentEventId: number;
}

export interface EventParticipantResponseDTO {
  id: number;
  eventId: number;
  totalSeat: number;
  seatAllocated: number;
  participantTypeId?: number;
  parentEventId: number;
  createdBy: number;
  modifiedBy: number;
  createdOn: Date;
  modifiedOn: Date;
}

export const createEventParticipantResponse = (
  eventParticipant: EventParticipantEntry
): ResponseDTO<EventParticipantResponseDTO> => {
  const response: EventParticipantResponseDTO = {
    id: eventParticipant.id,
    eventId: eventParticipant.eventId,
    totalSeat: eventParticipant.totalSeat,
    seatAllocated: eventParticipant.seatAllocated,
    participantTypeId: eventParticipant.participantTypeId,
    parentEventId: eventParticipant.parentEventId,
    createdBy: eventParticipant.createdBy,
    modifiedBy: eventParticipant.modifiedBy,
    createdOn: eventParticipant.createdOn || new Date(),
    modifiedOn: eventParticipant.modifiedOn || new Date(),
  };
  return {
    status: 'success',
    message: 'EventParticipant added successfully',
    data: response,
  };
};

export interface UpdateEntryDTO {
  totalSeat?: number;
  seatAllocated?: number;
  modifiedBy?: number;
  modifiedOn?: Date;
}
export interface EntryResponseDTO {
  id: number;
  eventId: number;
  totalSeat: number;
  seatAllocated: number;
  participantTypeId?: number;
  parentEventId: number;
}

export const updateEntryResponse = (
  eventParticipant: EntryResponseDTO
): ResponseDTO<EntryResponseDTO> => {
  const response: EntryResponseDTO = {
    id: eventParticipant.id,
    eventId: eventParticipant.eventId,
    totalSeat: eventParticipant.totalSeat,
    seatAllocated: eventParticipant.seatAllocated,
    participantTypeId: eventParticipant.participantTypeId,
    parentEventId: eventParticipant.parentEventId,
  };
  return {
    status: 'success',
    message: 'EventParticipant updated successfully',
    data: response,
  };
};
