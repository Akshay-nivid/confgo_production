import { Event } from '../../models/Event';
import {
  Asset,
  Color,
  Company,
  EventAddon,
  EventContact,
  EventImages,
  EventParticipantEntry,
  EventPriceTier,
  EventSpeaker,
  EventSponsor,
  EventStatus,
  Specialty,
  Template,
  Venue,
} from '../../models/init-models';
import { CreateEventAddonDTO } from './EventAddonDTO';
import { ResponseDTO } from '../ResponseDTO';
import { CreateVenueDTO, UpdateVenueDTO } from '../venue/VenueDTO';
import { CreateSpeakerBioDTO } from './EventProgramDTO';
import { sponsorAssignDataDTO, sponsorAssignDTO } from '../sponsor/SponsorDTO';
import { AddonCountDTO } from '../addon/AddonDTO';


/**
 * @interface CreateEventDTO
 * @description Interface for creating a new event.
 */
export interface CreateEventDTO {
  name: string;
  title: string;
  amount: number;
  description: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: Date;
  startTime: Date;
  endTime: Date;
  eventStartTime:Date;
  eventEndTime:Date;
  interval?: string;
  statusId: number;
  draftId?:number;
  templateId?: number;
  colorId?: number;
  registrationDeadline?: Date;
  venue?: CreateVenueDTO;
  programs: [CreateChildEventDTO];
  addons: [CreateEventAddonDTO];
  url?: string;
  meetingUniqueId?: string;
  eventClass?: string;
  assetId?: string;
  contacts: [CreateContactDTO];
}

/**
 * @interface ListEventDTO
 * @description Interface for listing events.
 */
export interface ListEventDTO {
  name?: string;
  title?: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: Date;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  city?: string;
  state?: string;
  eventClass?: string;
}

/**
 * @interface CreateChildEventDTO
 * @description Interface for creating a new event.
 */
export interface CreateChildEventDTO {
  parentId: number;
  name: string;
  title: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: Date;
  amount: number;
  description: string;
  startTime: Date;
  endTime: Date;
  assetId?: string;
  registrationDeadline: Date;
  interval?: string;
  statusId: number;
  url?: string;
  hall?: string;
  venueId: number;
  eventClass?: string;
  totalSeat?: number;
  seatAllocated?: number;
  speaker?: [ProgramSpeakerReqDTO];
  sponsors?: [sponsorAssignDataDTO]; 
}

export interface EventFilterDTO {
  id?: number;
  name?: string;
  title?: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: Date;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  amount?: number;
  venueId?: number;
  city?: string;
  state?: string;
  published?: number;
  statusId?: number;
  statusName  ?: string;
  templateId?: number;
  createdBy?: number;
  modifiedBy?: number;
  addonName?: string;
  parentId?: number;
  eventClass?: number;
}

export interface ProgramSpeakerReqDTO{
  speakerId: number;
  speakerFileId?: number;
  isModerator?:number;
  designation:string;
}
/**
 * @interface EventResponseDTO
 * @description Interface for formatting event data in responses.
 */
export interface EventResponseDTO {
  id: number;
  name: string;
  description?: string;
  startTime: Date;
  eventClass?: string;
  endTime?: Date;
  amount?: number;
  title?: string;
  assetId?: string;
  speciality?: string;
  createdBy: number;
  modifiedBy: number;
  createdOn: Date;
  modifiedOn: Date;
}

/**
 * @function createEventResponse
 * @description Formats the response data for event creation.
 * @param user - The event data to format.
 * @returns The formatted response data.
 */
export const createEventResponse = (
  event: Event
): ResponseDTO<EventResponseDTO> => {
  const response: EventResponseDTO = {
    id: event.id,
    name: event.name,
    description: event.description,
    eventClass: event.eventClass,
    startTime: event.startTime,
    endTime: event.endTime,
    assetId: event.assetId,
    amount: event.amount || 0,
    createdBy: event.createdBy || 0,
    createdOn: event.createdOn || new Date(),
    modifiedBy: event.modifiedBy || 0,
    modifiedOn: event.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Event created successfully',
    data: response,
  };
};

/**
 * EventDetailResponseDTO defines the structure of the data returned when fetching the details of an event.
 * This includes the event's basic information, its associated venue, status, sub-events (programs), and addons.
 */
export interface EventDetailResponseDTO {
  id: number;
  parentId?: number;
  name: string;
  description?: string;
  startTime: Date | null;
  endTime?: Date | null;
  venueId?: number;
  eventClass: string;
  interval?: string;
  companyId: number;
  assetId?: string;
  title?: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: string;
  amount: number;
  discount?: number;
  statusId?: number;
  slugName?: string;
  venue: Venue | null;
  assetName?: string;
  eventPriceTiers: EventPriceTier[] | null;
  status: EventStatus | null;
  published: number;
  templateId?: number;
  template?: Template;
  color: Color | null;
  companyEmail?: string;
  companyPhone?: string;
  availableSeats?: number;
  registeredParticipants?: number;
  programCheckins?: ProgramCheckinDTO[];
  eventSpeakers: EventSpeaker[];
  eventSponsors: EventSponsor[];
  addonCounts: AddonCountDTO[];
  programs?: Event[] | [];
  addons: EventAddon[] | [];
  eventCapacity: EventParticipantEntry[] | [];
  eventContacts: EventContact[] | [];
  speciality:Specialty | null;
  url?: string;
  company?:Company;
  eventImages?: EventImages[] | [];
}

/**
 * Constructs a response object for event details based on the provided result.
 * If the event details are found, it returns a successful response.
 * If the result is null, it returns an error response with an appropriate message.
 *
 * @param {EventDetailResponseDTO | null} result - The event details to be returned in the response, or null if not found.
 * @returns {ResponseDTO<EventDetailResponseDTO>} - The response object containing status, message, and optional data.
 */
export const eventDetailsResponse = (
  result: EventDetailResponseDTO | null
): ResponseDTO<EventDetailResponseDTO> => {
  if (result) {
    return {
      status: 'success',
      message: 'success',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Event details not found',
    };
  }
};

export interface UpdateEventIsPublishedDTO {
  eventId: number;
}

export const updateEventIsPublishedResponse = (
  data: UpdateEventIsPublishedDTO
): ResponseDTO<UpdateEventIsPublishedDTO> => {
  return {
    status: 'success',
    message: 'The event has been successfully published!',
    data: data,
  };
};

/**
 * @interface checkEventSlugDTO
 * @description Interface for checking the slug name of an event.
 */
export interface checkEventSlugDTO {
  slugName: string;
  eventId?: number;
}

export interface UpdateEventSlugDTO {
  eventId: number;
  slugName: string;
}

export const updateEventSlugResponse = (
  data: UpdateEventSlugDTO
): ResponseDTO<UpdateEventSlugDTO> => {
  return {
    status: 'success',
    message: 'slugName updated in event table successfully',
    data: data,
  };
};

export interface UpdateDraftDTO {
  statusId?: number;
  modifiedOn?: Date;
}
/**
 * @interface UpdateEventDTO
 * @description Interface for updating a new event.
 */
export interface UpdateEventDTO {
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  eventStartTime: string;
  eventEndTime: string;
  slugName: string;
  assetId?: string;
  eventClass: string;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: string;
  amount?: number;
  url?: string;
  hall?: string;
  venue?: UpdateVenueDTO;
  contacts?: CreateContactDTO[];
  totalSeat?: number;
  seatAllocated?: number;
  participantTypeId?: number; 
  speakers:[ProgramSpeakerReqDTO];
  sponsors?:[sponsorAssignDataDTO];
}

/**
 * @interface UpdateEventResponseDTO
 * @description Interface for formatting event data in responses.
 */
export interface UpdateEventResponseDTO {
  id: number;
  name?: string;
  createdBy: number;
  modifiedBy: number;
  specialtyId?: number;
  isAbstract?: number;
  abstractDate?: string;
  description?: string;
  eventClass?: string;
  assetId?: string;
  startTime?: Date;
  endTime?: Date;
  eventLink?: string;
}

/**
 * @function updateEventResponse
 * @description Formats the response data for event creation.
 * @param user - The event data to format.
 * @returns The formatted response data.
 */
export const updateEventResponse = (
  event: Event
): ResponseDTO<UpdateEventResponseDTO> => {
  const updateResponse: UpdateEventResponseDTO = {
    id: event.id,
    name: event.name,
    assetId: event.assetId,
    specialtyId: event.specialtyId,
    isAbstract: event.isAbstract,
    abstractDate: event.abstractDate,
    description: event.description,
    eventClass: event.eventClass,
    startTime: event.startTime,
    endTime: event.endTime,
    eventLink: event.slugName,
    createdBy: event.createdBy || 0,
    modifiedBy: event.modifiedBy || 0,
  };

  return {
    status: 'success',
    message: 'Event updated successfully',
    data: updateResponse,
  };
};

export interface AddProgramDTO {
  name: string;
  title: string;
  amount: number;
  description: string;
  startTime: Date;
  endTime: Date;
  interval?: string;
  statusId: number;
  hall?: string;
  registrationDeadline?: Date;
  venueId: number;
  // parentId: number;
  parentEventId: number;
  totalSeat?: number;
  seatAllocated?: number;
  speakers?: [ProgramSpeakerReqDTO];
  sponsors?: [sponsorAssignDataDTO]; 
}

/**
 * @interface CreateContactDTO
 * @description Interface for creating contacts of an event.
 */
export interface CreateContactDTO {
  phone: string;
  email: string;
}

export interface UpdateContactDTO {
  eventId: number;
  phone: string;
  email: string;
  createdBy: number;
  modifiedBy: number;
}

export interface RegisteredEventFilter {
  name?: string;
  id?: number;
}

export interface ProgramCheckinDTO {
  eventId: number;
  checkins: number;
}
