import { ParticipantRole } from '../../models/ParticipantRole';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateParticipantRoleDTO
 * @description Interface for creating a new participant Role.
 */
export interface CreateParticipantRoleDTO {
  roleName: string;
  companyId: number;
  owner: string;
  description?: string;
}

/**
 * @interface ParticipantRoleResponseDTO
 * @description Interface for formatting participant role data in responses.
 */
export interface ParticipantRoleResponseDTO {
  id: number;
  roleName: string;
  description?: string;
  companyId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

/**
 * @function createParticipantRoleResponse
 * @description Formats the response data for participant role creation.
 * @param user - The participant role data to format.
 * @returns The formatted response data.
 */
export const createParticipantRoleResponse = (
  participantRole: ParticipantRole
): ResponseDTO<ParticipantRoleResponseDTO> => {
  const response: ParticipantRoleResponseDTO = {
    id: participantRole.id,
    roleName: participantRole.roleName,
    description: participantRole.description,
    companyId: participantRole.companyId,
    createdBy: participantRole.createdBy || 0,
    createdOn: participantRole.createdOn || new Date(),
    modifiedBy: participantRole.modifiedBy || 0,
    modifiedOn: participantRole.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Participant Role created successfully',
    data: response,
  };
};
