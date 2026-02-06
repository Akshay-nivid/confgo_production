import { Op } from 'sequelize';
import { PaymentMethod } from '../../models/init-models';
import { ResponseDTO } from '../ResponseDTO';

export interface CreatePaymentMethodDTO {
  code: string;
  handler: string;
  enabled: number;
  name: string;
  description: string;
  logoUrl: string;
  minAmount: number;
  maxAmount: number;
  createdBy?: number;
  createdOn: Date;
}

export interface PaymentMethodResponseDTO {
  id?: number;
  code?: string;
  handler?: string;
  enabled?: number;
  name?: string;
  description?: string;
  logoUrl?: string;
  minAmount?: number;
  maxAmount?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}

export const createPaymentMethodResponse = (
  paymentMethod: PaymentMethod
): ResponseDTO<PaymentMethodResponseDTO> => {
  const response: PaymentMethodResponseDTO = {
    id: paymentMethod.id,
    code: paymentMethod.code,
    handler: paymentMethod.handler,
    enabled: paymentMethod.enabled,
    name: paymentMethod.name,
    description: paymentMethod.description,
    logoUrl: paymentMethod.logoUrl,
    minAmount: paymentMethod.minAmount,
    maxAmount: paymentMethod.maxAmount,
    createdBy: paymentMethod.createdBy || 0,
    modifiedBy: paymentMethod.modifiedBy || 0,
    createdOn: paymentMethod.createdOn || new Date(),
    modifiedOn: paymentMethod.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Payment method created successfully',
    data: response,
  };
};

export const listPaymentMethodResponse = (
  paymentMethods: PaymentMethod[]
): ResponseDTO<PaymentMethodResponseDTO[]> => {
  const responseList: PaymentMethodResponseDTO[] = paymentMethods.map(
    (paymentMethod) => ({
      id: paymentMethod.id,
      code: paymentMethod.code,
      handler: paymentMethod.handler,
      enabled: paymentMethod.enabled,
      name: paymentMethod.name,
      description: paymentMethod.description,
      logoUrl: paymentMethod.logoUrl,
      minAmount: paymentMethod.minAmount,
      maxAmount: paymentMethod.maxAmount,
      createdBy: paymentMethod.createdBy || 0,
      modifiedBy: paymentMethod.modifiedBy || 0,
      createdOn: paymentMethod.createdOn || new Date(),
      modifiedOn: paymentMethod.modifiedOn || new Date(),
    })
  );

  return {
    status: 'success',
    message: 'Payment methods retrieved successfully',
    data: responseList,
  };
};

export interface PaymentMethodFilterDTO {
  id?: number;
  handler?: string;
  enabled?: boolean;
  name?: string | { [Op.like]: string }; // Allow for both string and object with operator
  code?: string | { [Op.like]: string };
  description?: string;
  logoUrl?: string;
  minAmount?: number;
  maxAmount?: number;
  createdBy?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
}
