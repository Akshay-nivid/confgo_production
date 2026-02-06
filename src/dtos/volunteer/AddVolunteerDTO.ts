import { Volunteer } from '../../models/Volunteer';
import { VolunteerEvent } from '../../models/VolunteerEvent';
import { ResponseDTO } from '../ResponseDTO';

export interface AddVolunteerDTO {
  userId: number;
}

export interface AddVolunteerEventDTO {
  volunteerId: number;
  eventId: number[];
}

export interface VolunteerResponseDTO {
  userId: number;
  companyId: number;
  statusId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export interface VolunteerEventResponseDTO {
  volunteerId: number;
  eventId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number;
  modifiedOn: Date;
}

export interface VolunteerFilterDTO {
  id?: number;
  userId?: number;
  companyId?: number;
  statusId?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}
/**
 * Creates a response DTO for the given volunteer.
 * This function maps the `Volunteer` object to a `VolunteerResponseDTO` and returns it inside a `ResponseDTO` with a success status.
 *
 * @param {Volunteer} volunteer - The volunteer object to be mapped into the response DTO.
 * @returns {ResponseDTO<VolunteerResponseDTO>} The response object containing the mapped volunteer data.
 */
export const createVolunteerResponse = (
  volunteer: Volunteer
): ResponseDTO<VolunteerResponseDTO> => {
  const response: VolunteerResponseDTO = {
    userId: volunteer.userId ?? 0,
    companyId: volunteer.companyId,
    statusId: volunteer.statusId ?? 0,
    createdBy: volunteer.createdBy || 0,
    createdOn: volunteer.createdOn || new Date(),
    modifiedBy: volunteer.modifiedBy || 0,
    modifiedOn: volunteer.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Volunteer added successfully',
    data: response,
  };
};
/**
 * Assigns events to a volunteer and formats the response.
 * This function takes a single `VolunteerEvent` or an array of `VolunteerEvent` objects,
 * maps them to a response format, and returns a `ResponseDTO` containing the formatted data.
 *
 * @param {VolunteerEvent | VolunteerEvent[]} volunteers - A single volunteer event or an array of volunteer events to be assigned.
 * @returns {ResponseDTO<VolunteerEventResponseDTO | VolunteerEventResponseDTO[]>} The response object containing the success status and the mapped event data.
 */
export const assignEventsToVolunteerResponse = (
  volunteers: VolunteerEvent | VolunteerEvent[]
): ResponseDTO<VolunteerEventResponseDTO | VolunteerEventResponseDTO[]> => {
  // Convert a single Volunteer or an array of Volunteers into the response format
  const mapVolunteerToResponse = (
    volunteer: VolunteerEvent
  ): VolunteerEventResponseDTO => ({
    volunteerId: volunteer.userId ?? 0,
    eventId: volunteer.eventId ?? 0,
    createdBy: volunteer.createdBy || 0,
    createdOn: volunteer.createdOn || new Date(),
    modifiedBy: volunteer.modifiedBy || 0,
    modifiedOn: volunteer.modifiedOn || new Date(),
  });

  // Handle single or multiple volunteers
  const responseData = Array.isArray(volunteers)
    ? volunteers.map(mapVolunteerToResponse) // Map each volunteer in the array
    : mapVolunteerToResponse(volunteers); // Handle single volunteer

  return {
    status: 'success',
    message: 'Events assigned toVolunteer successfully',
    data: responseData,
  };
};
