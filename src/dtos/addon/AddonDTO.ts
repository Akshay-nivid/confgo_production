import { Op } from 'sequelize';
import { Addon } from '../../models/Addon';
import { ResponseDTO } from '../ResponseDTO';

export interface AddonFilterDTO {
  id?: number;
  name?: string | { [Op.like]: string }; // Allow name to accept string or an object with Op.like
  owner?: string | { [Op.like]: string }; // Allow owner to accept string or an object with Op.like
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export interface AddonResponseDTO {
  id?: number;
  name?: string;
  description?: string;
  companyId?: number;
  owner?: string;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export const listAddonResponse = (
  addon: Addon[]
): ResponseDTO<AddonResponseDTO[]> => {
  const responseList: AddonResponseDTO[] = addon.map((addon) => ({
    id: addon.id,
    name: addon.name,
    description: addon.description,
    companyId: addon.companyId,
    owner: addon.owner,
    createdBy: addon.createdBy || 0,
    modifiedBy: addon.modifiedBy || 0,
    createdOn: addon.createdOn || new Date(),
    modifiedOn: addon.modifiedOn || new Date(),
  }));

  return {
    status: 'success',
    message: 'addon retrieved successfully',
    data: responseList,
  };
};

export interface AddonValidateDTO {
  name: string;
  description: string;
  companyId?: number;
  owner: string;
  createdBy?: number;
}

export interface CreateAddonDTO {
  name: string;
  description: string;
  companyId?: number;
  owner: string;
  createdBy: number;
  createdOn: Date;
}

export interface CreateAddonResponseDTO {
  id?: number;
  name?: string;
  description?: string;
  companyId?: number;
  owner?: string;
  createdBy?: number;
  createdOn?: Date;
}

export const createAddonResponse = (
  addon: Addon
): ResponseDTO<AddonFilterDTO> => {
  const response: CreateAddonResponseDTO = {
    id: addon.id,
    name: addon.name,
    description: addon.description,
    companyId: addon.companyId,
    owner: addon.owner,
    createdBy: addon.createdBy || 0,
    createdOn: addon.createdOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Addon method created successfully',
    data: response,
  };
};

export interface AddonCountDTO {
  id: number;
  name: string;
  registeredCount: number;
  checkinCount: number;
}
