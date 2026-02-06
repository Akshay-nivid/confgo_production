/**
 * @interface CreateVenueDTO
 * @description Interface for creating a new venue.
 */
export interface CreateVenueDTO {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  totalCapacity: number;
  mapUrl?: string;
}

export interface UpdateVenueDTO {
  id: number | null;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  totalCapacity: number;
  mapUrl: string;
}
