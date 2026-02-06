import { EventAddon } from '../../models/init-models';
import { ResponseDTO } from '../ResponseDTO';
import { CreateAddonPropertyDTO } from '../addon/AddonPropertyDTO';
import { AddSponsorDTO, sponsorAssignDataDTO } from '../sponsor/SponsorDTO';

/**
 * @interface CreateEventAddonDTO
 * @description Interface for creating a new event Addon.
 */
export interface CreateEventAddonDTO {
  eventId: number;
  companyId: number;
  addonId: number;
  amount: number;
  startTime?: Date;
  endTime?: Date;
  tier?: string;
  description?: string;
  properties?: CreateAddonPropertyDTO[];
  sponsors?: sponsorAssignDataDTO[]; 
}

export interface EventAddonResponseDTO {
  id: number;
  eventId: number;
  companyId: number;
  addonId: number;
  amount: number;
  startTime: Date;
  endTime?: Date;
  tier?: string;
  description?: string;
}

/**
 * @interface AddAEventAddonDTO
 * @description Interface for adding an addon to an event
 */
export interface AddEventAddonDTO {
  eventId: number;
  companyId?: number;
  addons: AddonsDataDTO[];
}

export interface AddonsDataDTO {
  addonId: number;
  amount?: number;
  startTime?: Date;
  endTime?: Date;
  tier?: string;
  description?: string;
  properties?: CreateAddonPropertyDTO[];
  sponsors?: AddSponsorDTO[];
}

export const updateEventAddonResponse = (
  data: EventAddon
): ResponseDTO<EventAddonResponseDTO> => {
  const response: EventAddonResponseDTO = {
    id: data.id,
    eventId: data.dataValues.eventId,
    companyId: data.dataValues.companyId,
    addonId: data.dataValues.addonId,
    amount: data.dataValues.amount ?? 0,
    startTime: data.dataValues.startTime ?? new Date(),
    endTime: data.dataValues.endTime,
    tier: data.dataValues.tier,
    description: data.dataValues.description,
  };

  return {
    status: 'success',
    message: 'Event created successfully',
    data: response,
  };
};

export const createEventAddonResponse = (
  data: EventAddon[]
): ResponseDTO<EventAddonResponseDTO[]> => {
  const response: EventAddonResponseDTO[] = data.map((addon) => ({
    id: addon.id,
    eventId: addon.dataValues.eventId,
    companyId: addon.dataValues.companyId,
    addonId: addon.dataValues.addonId,
    amount: addon.dataValues.amount ?? 0,
    startTime: addon.dataValues.startTime ?? new Date(),
    endTime: addon.dataValues.endTime,
    tier: addon.dataValues.tier,
    description: addon.dataValues.description,
  }));

  return {
    status: 'success',
    message: 'Event addons created successfully',
    data: response,
  };
};

export interface updateAddonDTO {
  eventId: number;
  companyId?: number;
  addonId?: number;
  amount?: number;
  startTime?: Date;
  endTime?: Date;
  tier?: string;
  description?: string;
  sponsors?: AddSponsorDTO[];
  properties?: CreateAddonPropertyDTO[];
}