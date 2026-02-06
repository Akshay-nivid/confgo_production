import { EventImages } from "../../models/EventImages";
import { ResponseDTO } from "../ResponseDTO";

export interface UploadEventImagesDTO{
    eventId: number;
    assetIds: [string];
}

// Define a DTO for the event image response
export interface EventImageResponseDTO {
    id: number;
    eventId: number;
    assetId: string;
    createdBy: number;
  }
  

export const createEventImageResponse = (
    uploads: EventImages[]
  ): ResponseDTO<EventImageResponseDTO[]> => {
    // Map each upload to the desired response structure
    const mappedUploads = uploads.map((upload) => ({
      id: upload.id,
      eventId: upload.eventId,
      assetId: upload.assetId,
      createdBy: upload.createdBy,
    }));
  
    return {
      status: 'success',
      message: 'Event images uploaded successfully.',
      data: mappedUploads,
    };
  };
  export interface GetAllEventImagesDTO{
    eventId: number;
}

export interface AllEventImageResponseDTO {
  images: EventImages[];
}

export const createAllEventImageResponse = (
  images: EventImages[]
): ResponseDTO<AllEventImageResponseDTO> => {
  return {
    status: 'success',
    message: 'Event images Fetched successfully.',
    data: { images },
  };
};
