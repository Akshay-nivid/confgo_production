import { Attendee } from '../../models/Attendee';
import { Participant } from '../../models/Participant';
import { ResponseDTO } from '../ResponseDTO';

export interface AddAttendeeDTO {
  eventId: number;
  qrCode?: string;
  addons?: AddonReq;
  participantId?: number;
}

export interface UpdatedParticipantDTO {
  participant: Participant | null;
  checkedIn: boolean;
}

export interface AddonReq {
  addonId: number;
  addonPropertyId?: number;
}
export interface AttendeeResponseDTO {
  attendedPrograms: Attendee[];
  attendedAddons: Attendee[] | null;
}

export const createAttendeeResponse = (
  attendedPrograms: Attendee[],
  attendedAddons?: Attendee[] | null
): ResponseDTO<AttendeeResponseDTO> => {
  const response: AttendeeResponseDTO = {
    attendedPrograms: attendedPrograms,
    attendedAddons: attendedAddons ?? [],
  };

  return {
    status: 'success',
    message: 'Attendance added successfully',
    data: response,
  };
};
