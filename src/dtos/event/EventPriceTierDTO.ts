import { EventPriceTier } from '../../models/EventPriceTier';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateEventPriceTierDTO
 * @description Interface for creating a new event price tier.
 */
export interface CreateEventPriceTierDTO {
  priceTiers: PriceTier[];
  eventId: number;
}

export interface PriceTier {
  percentage?: number;
  endDate: Date;
  startDate: Date;
  name: string;
  description?: string;
  participantTypeId: number;
}

/**
 * @interface PriceTierResponse
 * @description Interface for formatting event price tier data in responses.
 */
export interface PriceTierResponseDTO {
  id: number;
  name: string;
  description?: string;
  participantTypeId: number;
  eventId: number;
  percentage?: number;
  startDate: Date;
  endDate: Date;
  createdBy: number;
  createdOn?: Date;
  modifiedBy: number;
  modifiedOn?: Date;
}

/**
 * @function createEventPriceTierResponse
 * @description Formats the response data for event price tier creation.
 * @param user - The event price tier data to format.
 * @returns The formatted response data.
 */
export const createEventPriceTierResponse = (
  priceTiers: EventPriceTier[]
): ResponseDTO<PriceTierResponseDTO[]> => {
  const response: PriceTierResponseDTO[] = priceTiers.map((priceTier) => ({
    id: priceTier.id,
    name: priceTier.name,
    description: priceTier.description || '',
    eventId: priceTier.eventId,
    percentage: priceTier.percentage || 0,
    startDate: priceTier.startDate,
    endDate: priceTier.endDate,
    participantTypeId: priceTier.participantTypeId,
    createdBy: priceTier.createdBy || 0,
    createdOn: priceTier.createdOn || new Date(),
    modifiedBy: priceTier.modifiedBy || 0,
    modifiedOn: priceTier.modifiedOn || new Date(),
  }));

  return {
    status: 'success',
    message: 'Event Price Tier created successfully',
    data: response,
  };
};

/**
 * @interface UpdatePriceTierDTO
 * @description Interface for formatting event price tier data in responses.
 */
export interface UpdatePriceTierDTO {
  name?: string;
  description?: string;
  participantTypeId?: number;
  percentage?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * @function updateEventPriceTierResponse
 * @description Formats the response data for event price tier creation.
 * @param user - The event price tier data to format.
 * @returns The formatted response data.
 */
export const updateEventPriceTierResponse = (
  priceTier: EventPriceTier
): ResponseDTO<PriceTierResponseDTO> => {
  const response: PriceTierResponseDTO = {
    id: priceTier.id,
    name: priceTier.name,
    description: priceTier.description || '',
    eventId: priceTier.eventId,
    percentage: priceTier.percentage || 0,
    startDate: priceTier.startDate,
    endDate: priceTier.endDate,
    participantTypeId: priceTier.participantTypeId,
    createdBy: priceTier.createdBy || 0,
    createdOn: priceTier.createdOn || new Date(),
    modifiedBy: priceTier.modifiedBy || 0,
    modifiedOn: priceTier.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Event Price Tier updated successfully',
    data: response,
  };
};

export interface PriceTierFilterDTO {
  name?: string;
  participantTypeId?: number;
  eventId?: number;
  startDate?: Date;
  endDate?: Date;
}
