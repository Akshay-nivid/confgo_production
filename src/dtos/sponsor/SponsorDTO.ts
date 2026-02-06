import { EventSponsor } from '../../models/EventSponsor';
import { Sponsor } from '../../models/Sponsor';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateSponsorDTO
 * @description Interface for creating a new sponsor.
 */
export interface CreateSponsorDTO {
  name: string;
  email: string;
  phone: string;
  companyId?: number;
  website?: string;
  logoAssetId?: string;
  bannerImgAssetId?: string;
}

export interface sponsorAssignDTO {
  sponsors: [sponsorAssignDataDTO]
}
export interface sponsorAssignDataDTO{
  sponsorId: number;
  sponsorTypeId?: number;
  eventId?: number;
  parentEventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  reservedSeats?: number;
  createdBy: number;
}
export interface SponsorResponseDTO {
  id: number;
  name: string;
  website?: string;
  createdBy: number;
  modifiedBy?: number;
  createdOn?: Date;
  modifiedOn?: Date;
}

export interface SponsorAssignResponseDTO {
  id:number;
  sponsorId: number;
  sponsorTypeId?: number;
  eventId?: number;
  parentEventId?: number;
  eventAddonId?: number;
  eventAddonPropertyId?: number;
  reservedSeats?: number;
  createdBy: number;
  modifiedBy?: number;
  createdOn?: Date;
  modifiedOn?: Date;
}
/**
 * @function createSponsorResponse
 * @description Formats the response data for sponsor creation.
 * @param sponsor - The sponsor data to format.
 * @returns The formatted response data.
 */
export const createSponsorResponse = (
  sponsor: Sponsor
): ResponseDTO<SponsorResponseDTO> => {
  // Map each sponsor object to the response DTO format
  const response = {
    id: sponsor.id,
    name: sponsor.name,
    website: sponsor.website,
    createdBy: sponsor.createdBy,
    modifiedBy: sponsor.modifiedBy,
    createdOn: sponsor.createdOn || new Date(),
    modifiedOn: sponsor.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Sponsors created successfully',
    data: response,
  };
};

/**
 * @interface UpdateSponsorDTO
 * @description Interface for updating a sponsor.
 */
export interface UpdateSponsorDTO {
  name?: string;
  email?: string;
  phone?: string;
  companyId?: number;
  website?: string;
  logoAssetId?: string;
  bannerImgAssetId?: string;
}

/**
 * @function createSponsorResponse
 * @description Formats the response data for sponsor creation.
 * @param sponsor - The sponsor data to format.
 * @returns The formatted response data.
 */
export const createUpdatedSponsorResponse = (
  sponsor: Sponsor
): ResponseDTO<SponsorResponseDTO> => {
  const response: SponsorResponseDTO = {
    id: sponsor.id,
    name: sponsor.name,
    website: sponsor.website,
    createdBy: sponsor.createdBy,
    modifiedBy: sponsor.modifiedBy,
    createdOn: sponsor.createdOn || new Date(),
    modifiedOn: sponsor.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Sponsor updated successfully',
    data: response,
  };
};

export interface SponsorFilterDTO {
  name?: string;
  eventId?: number;
  parentEventId?: number;
  userId?: number;
}
/**
 * @function createSponsorResponse
 * @description Formats the response data for sponsor creation.
 * @param sponsor - The sponsor data to format.
 * @returns The formatted response data.
 */
export const createAssignedSponsorResponse = (
  sponsors: EventSponsor[]
): ResponseDTO<SponsorAssignResponseDTO[]> => {
  // Map each sponsor object to the response DTO format
  const responseData = sponsors.map((sponsor) => ({
    id: sponsor.id,
    sponsorId: sponsor.sponsorId,
    sponsorTypeId: sponsor.sponsorTypeId,
    eventId: sponsor.eventId,
    parentEventId: sponsor.parentEventId,
    eventAddonId: sponsor.eventAddonId,
    eventAddonPropertyId: sponsor.eventAddonPropertyId,
    reservedSeats: sponsor.reservedSeats,
    createdBy: sponsor.createdBy,
    modifiedBy: sponsor.modifiedBy,
    createdOn: sponsor.createdOn || new Date(),
    modifiedOn: sponsor.modifiedOn || new Date(),
  }));

  return {
    status: 'success',
    message: 'Sponsors created successfully',
    data: responseData,
  };
};

export interface AddSponsorDTO {
  sponsorId: number;
  sponsorTypeId?: number;
  reservedSeats?: number;
}