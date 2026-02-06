
import { Asset } from '../../models/Asset';
import { EventSpeaker } from '../../models/EventSpeaker';
import { SpeakerBio } from '../../models/SpeakerBio';
import { Volunteer } from '../../models/Volunteer';
import { VolunteerEvent } from '../../models/VolunteerEvent';
import { ResponseDTO } from '../ResponseDTO';

export interface CreateEventSpeakerDTO {
  userId: number;
  eventId: number;
  parentEventId?: number;
  statusId?: number;
}
export interface CreateSpeakerBioDTO {
  description?: string;
  eventSpeakerId: number;
  speakerFileId?: string;
  isModerator?:number;
  designation?: string;
  startTime?: Date;
  endTime?: Date;
  modifiedBy?:number;
}

/**
 * Interface for update Speaker Bio 
 */
export interface UpdateSpeakerBioDTO {
  description?: string;
  eventSpeakerId: number;
  fileId?: string;
  isModerator?:number;
  designation?: string;
  startTime?: Date;
  endTime?: Date;
  modifiedBy?:number;
  modifiedOn?: Date;
}
export interface EventSpeakerResponseDTO {
  id: number;
  userId: number;
  eventId: number;
  statusId?: number;
}
export interface EventSpeakerBioResponseDTO {
  id:number;
  isModerator?:number;
  designation:string;
  description?: string;
  eventSpeakerId: number;
  fileId: string;
  startTime?: Date;
  endTime?: Date;
}
export interface EventVolunteerResponseDTO {
  id: number;
  userId: number;
  eventId: string;
}

export const assignEventSpeakerResponse = (
  event: EventSpeaker
): ResponseDTO<EventSpeakerResponseDTO> => {
  const response: EventSpeakerResponseDTO = {
    id: event.id,
    userId: event.userId!,
    eventId: event.eventId,
    statusId: event.statusId,
  };
  return {
    status: 'success',
    message: 'Event Speaker assigned successfully',
    data: response,
  };
};
export const assignEventSpeakerBioResponse = (
  event: SpeakerBio
): ResponseDTO<EventSpeakerBioResponseDTO> => {
  const response: EventSpeakerBioResponseDTO = {
    id: event.id,
    eventSpeakerId: event.eventSpeakerId,
    fileId: event.fileId!,
    isModerator:event.isModerator!,
    designation: event.designation!,
    description: event.description,
    startTime:event.startTime,
    endTime:event.endTime
  };
  return {
    status: 'success',
    message: 'Event Speaker detailed added successfully',
    data: response,
  };
};
export const assignEventVolunteerResponse = (
  event: VolunteerEvent
): ResponseDTO<EventVolunteerResponseDTO> => {
  const response: EventVolunteerResponseDTO = {
    id: event.id,
    userId: event.userId,
    eventId: event.eventId ? event.eventId.toString() : ''
  };
  return {
    status: 'success',
    message: 'Assign event to Volunteer successfully',
    data: response,
  };
};

export interface StatusValidationDTO {
  name: string;
}
export interface EventProgramFilterDTO {
  id?: number;
  userId?: number;
  eventId?: number;
  speakerFileId?: number;
  parentEventId?: number;
  statusId?: number;
}

export interface StatusValidationDTO {
  statusName: string;
}
export interface StatusResponseDTO {
  id?: number;
  statusName?: string;
  description?: string;
}

export interface StatusFilterDTO {
  id?: number;
  statusName?: string;
  description?: string;
}
export const getStatusByNameResponse = (
  result: StatusResponseDTO
): ResponseDTO<StatusResponseDTO> => {
  if (result) {
    return {
      status: 'success',
      message: ' status get succefully',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Failed to retrive the status',
      data: result,
    };
  }
};

export const getProgramResponse = (
  program: EventSpeakerResponseDTO
): ResponseDTO<EventSpeakerResponseDTO> => {
  return {
    status: 'success',
    data: program,
  };
};

export interface UpdateEventProgramDTO {
  eventId?: number;
  speakerFileId?: number;
  statusId?: number;
}

export const updateEventProgramResponse = (
  data: EventSpeakerResponseDTO
): ResponseDTO<EventSpeakerResponseDTO> => {
  return {
    status: 'success',
    message: 'Program updated successfully',
    data: data,
  };
};

export interface EventIdDTO {
  eventId?: number;
}

export interface SpeakerDetailFilterDTO {
  parentEventId?: number;
}