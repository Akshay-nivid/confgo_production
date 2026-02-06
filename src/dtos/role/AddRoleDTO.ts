import { Role } from '../../models/Role';
import { ResponseDTO } from '../ResponseDTO';

export interface AddRoleDTO {
  roleName: string;
  description:string
}

export interface RoleResponseDTO {
  roleName: string;
  description: string;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}


export interface RoleFilterDTO {
  id?: number;
  roleName?: string;
  description?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}
/**
 * Creates a response DTO for the given role.
 * This function maps the `Role` object to a `RoleResponseDTO` and returns it inside a `ResponseDTO` with a success status.
 *
 * @param {Role} role - The role object to be mapped into the response DTO.
 * @returns {ResponseDTO<RoleResponseDTO>} The response object containing the mapped role data.
 */
export const createRoleResponse = (
  role: Role
): ResponseDTO<AddRoleDTO> => {
  const response: RoleResponseDTO = {
    roleName: role.roleName ??"",
    description: role.description??"",
    createdBy: role.createdBy || 0,
    createdOn: role.createdOn || new Date(),
    modifiedBy: role.modifiedBy || 0,
    modifiedOn: role.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Role added successfully',
    data: response,
  };
};
