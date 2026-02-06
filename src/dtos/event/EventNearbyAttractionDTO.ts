/**
 * @author saneeshiv
 * @description DTO for event nearby attraction
 */

import { EventNearbyAttraction } from '../../models/init-models';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateEventNearbyAttractionDTO
 * @description Interface for creating new event nearby attraction.
 */
export interface CreateEventNearbyAttractionDTO {
  eventId: number;
  nearbyAttractions: Array<{
    name: string;
    venueId?: number;
    assetId?: string;
    distance?: string;
    category?: string;
    description?: string;
    openingHour?: string;
  }>;
}

/**
 * @interface UpdateEventNearbyAttractionDTO
 *  @description DTO for updating an existing nearby attraction.
 */
export interface UpdateEventNearbyAttractionDTO {
  name: string;
  venueId?: number;
  assetId?: string;
  distance?: string;
  category?: string;
  description?: string;
  openingHour?: string;
}

/**
 * Data Transfer Object for the response of a nearby attraction associated with an event.
 *
 * This interface defines the structure of a nearby attraction record returned in responses,
 * including basic details such as the attraction's name, associated event, optional venue,
 * asset information, and descriptive fields like distance, category, and opening hours.
 */
export interface EventNearbyAttractionResponseDTO {
  id: number;
  name: string;
  eventId: number;
  venueId?: number;
  assetId?: string;
  distance?: string;
  category?: string;
  description?: string;
  openingHour?: string;
}

/**
 * Generates a standardized response for a newly created nearby attraction.
 *
 * This function takes an `EventNearbyAttraction` object and maps its properties to the
 * `EventNearbyAttractionResponseDTO` format. The response includes a status, message,
 * and the attraction details to confirm successful creation.
 *
 * @param {EventNearbyAttraction[]} event - The nearby attraction record to include in the response.
 *
 * @returns {ResponseDTO<EventNearbyAttractionResponseDTO>} - A structured response containing
 *          status, message, and data with attraction details.
 */
export const createEventNearbyAttractionResponse = (
  attractions: EventNearbyAttraction[]
): ResponseDTO<EventNearbyAttractionResponseDTO[]> => {
  const response: EventNearbyAttractionResponseDTO[] = attractions.map(
    (attraction) => ({
      id: attraction.id,
      name: attraction.name,
      eventId: attraction.eventId,
      venueId: attraction.venueId,
      assetId: attraction.assetId,
      distance: attraction.distance,
      category: attraction.category,
      description: attraction.description,
      openingHour: attraction.openingHour,
    })
  );

  return {
    status: 'success',
    message: 'Event nearby attraction created successfully',
    data: response,
  };
};

export const updateEventNearbyAttractionResponse = (
  attraction: EventNearbyAttraction
): ResponseDTO<EventNearbyAttractionResponseDTO> => {
  const response: EventNearbyAttractionResponseDTO = {
    id: attraction.id,
    name: attraction.name,
    eventId: attraction.eventId,
    venueId: attraction.venueId,
    assetId: attraction.assetId,
    distance: attraction.distance,
    category: attraction.category,
    description: attraction.description,
    openingHour: attraction.openingHour,
  };

  return {
    status: 'success',
    message: 'Event nearby attraction updated successfully',
    data: response,
  };
};

export interface EventAttractionFilterDTO {
  id?: number;
  name?: string;
  category?: string;
  openingHour?: string;
  description?: string;
  distance?: string;
  venueId?: number;
  eventId?: number;
  createdBy?: number;
  modifiedBy?: number;
}
