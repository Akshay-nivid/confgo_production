import { CompanyPaypalConfiguration } from '../../models/CompanyPaypalConfiguration';
import { ResponseDTO } from '../ResponseDTO';

export interface CreatePaypalConfigDTO {
  companyId: number;
  eventId?: number;
  clientId: string;
  currency: string;
}

export interface PaypalConfigResponseDTO {
  id: number;
  userId: number;
  companyId: number;
  eventId?: number;
  clientId: string;
  currency: string;
  statusId: number;
  createdBy: number;
  createdOn: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

// Response for paypal config Response
export const createConfigResponse = (
  PaypalConfig: CompanyPaypalConfiguration,
  message: string
): ResponseDTO<PaypalConfigResponseDTO> => {
  const response: PaypalConfigResponseDTO = {
    id: PaypalConfig.id,
    companyId: PaypalConfig.companyId,
    userId: PaypalConfig.userId,
    clientId: PaypalConfig.clientId,
    currency: PaypalConfig.currency,
    eventId: PaypalConfig?.eventId,
    statusId: PaypalConfig.statusId,
    createdBy: PaypalConfig.createdBy,
    createdOn: PaypalConfig.createdOn || new Date(),
  };

  return {
    status: 'success',
    message: message,
    data: response,
  };
};

export interface UpdatePaypalConfigDTO {
  companyId?: number;
  clientId?: string;
  currency?: string;
  eventId?: number;
  userId?: number;
  statusId?: number;
}

export interface PaypalConfigFiltersDTO {
  companyId?: number;
  clientId?: string;
  currency?: string;
  eventId?: number;
  userId?: number;
  statusId?: number;
}
