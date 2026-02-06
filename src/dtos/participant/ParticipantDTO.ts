import { EventParticipant } from '../../models/EventParticipant';
import { Participant } from '../../models/Participant';
import { Payment } from '../../models/Payment';
import { ResponseDTO } from '../ResponseDTO';
import { Event } from '../../models/Event';
import { EventAddon } from '../../models/EventAddon';
import { EventAddonProperty } from '../../models/EventAddonProperty';
import { Attendee } from '../../models/Attendee';
import { Addon } from '../../models/Addon';
import { User } from '../../models/User';
import { Cart } from '../../models/Cart';

/**
 * @interface CreateParticipantDTO
 * @description Interface for creating a new participant.
 */
export interface CreateParticipantRequestDTO {
  registrationType: string;
  orderId: number;
}

export interface CreateParticipantDTO {
  registrationType: string;
  orderId: number;
  parentEventId: number;
  participantTypeId?: number;
  finalPrice: number;
}

/**
 * @interface participantRequestDTO
 * @description Interface for formatting participant data in responses.
 */
export interface participantRequestDTO {
  userId: number;
  registrationType: string;
  eventId: number;
  participantTypeId?: number;
  qrCode?: string;
  amountPaid?: number;
  createdBy: number;
  modifiedBy: number;
}

export const getParticipantsDetailsResponse = (
  partcipantDetails: ParticipantDetailsResponseDTO
): ResponseDTO<ParticipantDetailsResponseDTO> => {
  return {
    status: 'Success',
    data: partcipantDetails,
  };
};

/**
 * @interface ParticipantResponseDTO
 * @description Interface for formatting participant data in responses.
 */
export interface ParticipantResponseDTO {
  id: number;
  amountPaid?: number;
  eventId: number;
  qrCode?: string;
  registrationType: string;
}
export interface CheckoutResponseDTO {
  user:User;
  event:Event;
  participant:Participant;
}

export interface ParticipantDetailsResponseDTO {
  details: Participant;
  programs: EventParticipant[];
}
/**
 * @function createParticipantResponse
 * @description Formats the response data for participant creation.
 * @param user - The participant data to format.
 * @returns The formatted response data.
 */
export const createParticipantResponse = (
  participant: Participant
): ResponseDTO<ParticipantResponseDTO> => {
  const response: ParticipantResponseDTO = {
    id: participant.id,
    amountPaid: participant.amountPaid,
    qrCode: participant.qrCode,
    eventId: participant.eventId,
    registrationType: participant.registrationType,
  };

  return {
    status: 'success',
    message: 'Participant created successfully',
    data: response,
  };
};

/**
 * Creates a response object for a successful checkout operation.
 *
 * @returns An object containing the status and message of the checkout operation.
 */
export const createCheckoutResponse = (
  event: Event | null,
  user: User | null,
  participant:Participant|null
): ResponseDTO<CheckoutResponseDTO | null> => {
  if (user && event && participant) {
    const response: CheckoutResponseDTO = {
      event,
      user,
      participant
    };

    return {
      status: 'success',
      message: 'Checkout completed successfully',
      data: response,
    };
  }

  return {
    status: 'error',
    message: 'Invalid user or event data',
    data: null,
  };
};


/**
 * @function getParticipantResponse
 * @description Formats the response data for retrieving a participant.
 * @param user - The participant data to format.
 * @returns The formatted response data.
 */
export const getParticipantResponse = (
  participant: ParticipantResponseDTO
): ResponseDTO<ParticipantResponseDTO> => {
  return {
    status: 'success',
    data: participant,
  };
};

export interface ParticipantListFilterDTO {
  id?: number;
  name?: string;
  eventId?: number;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ParticipantByEventResponse {
  participant: Participant[];
  participantCount: number;
}

export interface ExistingParticipantCheckDTO {
  eventId: number;
}

export interface QrParticipantRequestDTO {
  qrCode?: string;
  participantId?: number;
}

/**
 * Response for get participant and payment details of a user in a event.
 */
export interface createParticipantPaymentResponseDTO {
  ParticipantDetails: Participant | null;
  PaymentDetails: Payment | null;
}
export interface ParticipantReminderResponseDTO {
  id: number;
  registrationType: string;
  eventId: number;
  amountPaid?: number;
  qrCode?: string;
  userId: number;
  participantTypeId?: number;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;

  // Foreign key details
  users: User[]; // Array of related User objects
}
export const createParticipantPaymentResponse = (
  eventParticipant: Participant | null,
  participantPayment: Payment | null,
): ResponseDTO<createParticipantPaymentResponseDTO> => {
  const response: createParticipantPaymentResponseDTO = {
    ParticipantDetails: eventParticipant ?? null,
    PaymentDetails: participantPayment,
  };
  return {
    status: 'success',
    message: 'Participant & Payment Details.',
    data: response,
  };
};

export interface registeredEventResponseDTO {
  Events: Event[];
}

export const createRegisteredEventsResponse = (
  event: Event[]
): ResponseDTO<registeredEventResponseDTO> => {
  const response: registeredEventResponseDTO = {
    Events: event,
  };
  return {
    status: 'success',
    message: 'Registered Events Details.',
    data: response,
  };
};

// Type DTO for attended Addons Response
export interface AddonData {
  addon: EventAddon | null;
  addonProperties: EventAddonProperty[];
}
export interface QrParticipantDetails {
  participant: Participant;
  event: Event | null;
  eventPrograms: Event[] | [];
  eventAddons: EventAddon[] | [];
  attendedPrograms?: Event[] | [];
  attendedAddons?: AddonData[] | [];
  checkedIn?: Attendee[] | [];
}

export const createQrParticipantDetails = (
  result: QrParticipantDetails | null
): ResponseDTO<QrParticipantDetails> => {
  if (result) {
    return {
      status: 'success',
      message: 'success',
      data: result,
    };
  } else {
    return {
      status: 'error',
      message: 'Participant details not found',
    };
  }
};

export interface AttendanceDetailsDTO {
  attendedPrograms: AttendedProgramsDTO[];
  upcomingPrograms: Event[];
  absentPrograms: Event[];
}

export interface AttendedProgramsDTO {
  program: Event,
  attendeeData: Attendee
}