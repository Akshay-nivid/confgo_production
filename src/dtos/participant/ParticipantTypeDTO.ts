import { ParticipantType } from '../../models/ParticipantType';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateParticipantTypeDTO
 * @description Interface for creating a new participant type.
 */
export interface CreateParticipantTypeDTO {
  name: string;
  eventId: number;
  description?: string;
  isContributor?: number;
}
export interface UpdateParticipantTypeDTO {
  id: number;
  name?: string;
  eventId: number;
  description?: string;
  isContributor?: number;
}

export interface ParticipantTypeResponseDTO {
  id: number;
  name: string;
  eventId: number;
  description?: string;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export interface ParticipantTypeFilterDTO {
  eventId?: number;
  name?: string;
  isContributor?: number;
  exceptName?: string;
}

/**
 * @interface ParticipantTypeResponseDTO
 * @description Interface for formatting participant type data in responses.
 */
export interface ParticipantTypeResponseDTO {
  id: number;
  name: string;
  eventId: number;
  isContributor: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

/**
 * @function createParticipantTypeResponse
 * @description Formats the response data for participant type creation.
 * @param user - The participant type data to format.
 * @returns The formatted response data.
 */
export const createParticipantTypeResponse = (
  participantType: ParticipantType
): ResponseDTO<ParticipantTypeResponseDTO> => {
  const response: ParticipantTypeResponseDTO = {
    id: participantType.id,
    name: participantType.name,
    eventId: participantType.eventId,
    isContributor: participantType.isContributor,
    createdBy: participantType.createdBy || 0,
    createdOn: participantType.createdOn || new Date(),
    modifiedBy: participantType.modifiedBy || 0,
    modifiedOn: participantType.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Participant Type created successfully',
    data: response,
  };
};

/**
 * @function getParticipantTyprResponse
 * @description Formats the response data for retrieving a participant type.
 * @param participantType - The participant type data to format.
 * @returns The formatted response data.
 */
export const getParticipantTypeResponse = (
  participantType: ParticipantTypeResponseDTO
): ResponseDTO<ParticipantTypeResponseDTO> => {
  return {
    status: 'success',
    data: participantType,
  };
};

export const updateParticipantTypeResponse = (
  data: ParticipantTypeResponseDTO
): ResponseDTO<ParticipantTypeResponseDTO> => {
  return {
    status: 'success',
    message: 'Participant type updated successfully',
    data: data,
  };
};
