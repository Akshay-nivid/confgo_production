import { ParticipantGroup } from '../../models/ParticipantGroup';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateParticipantGroupDTO
 * @description Interface for creating a new participant Group.
 */
export interface CreateParticipantGroupDTO {
  name: string;
  participantId: number;
  companyId?: number;
  tag?: string;
  createdBy?: number;
  modifiedBy?: number;
}

/**
 * @interface ParticipantGroupResponseDTO
 * @description Interface for formatting participant group data in responses.
 */
export interface ParticipantGroupResponseDTO {
  id: number;
  name: string;
  participantId: number;
  tag?: string;
  companyId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

/**
 * @function createParticipantGroupResponse
 * @description Formats the response data for participant group creation.
 * @param user - The participant group data to format.
 * @returns The formatted response data.
 */
export const createParticipantGroupResponse = (
  participantGroup: ParticipantGroup
): ResponseDTO<ParticipantGroupResponseDTO> => {
  const response: ParticipantGroupResponseDTO = {
    id: participantGroup.id,
    name: participantGroup.name,
    participantId: participantGroup.participantId,
    tag: participantGroup.tag,
    companyId: participantGroup.companyId,
    createdBy: participantGroup.createdBy || 0,
    createdOn: participantGroup.createdOn || new Date(),
    modifiedBy: participantGroup.modifiedBy || 0,
    modifiedOn: participantGroup.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Participant Group created successfully',
    data: response,
  };
};
