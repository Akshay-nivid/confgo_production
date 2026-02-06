import { CompanyTax } from '../../models/CompanyTax';
import { ResponseDTO } from '../ResponseDTO';

/**
 * @interface CreateTaxDTO
 * @description Interface for creating tax .
 */
export interface CreateTaxDTO {
  taxName: string;
  description?: string;
  taxPercentage: string;
  companyId: number;
  createdBy?: string;
  modifiedBy?: string;
  taxInclusive?: number;
}
export interface UpdateTaxDTO {
  taxName: string;
  description?: string;
  taxPercentage: string;
  modifiedBy?: string;
  taxInclusive?: number;
}
export interface FilterDTO {
  companyUserId?: number;
}
export interface CreateTaxResponseDTO {
  id:number;
  taxName: string;
  description?: string;
  taxPercentage: string;
  companyId?: number;
  taxInclusive?: number;
  createdBy: number;
  modifiedBy?: number;
  createdOn?: Date;
  modifiedOn?: Date;
}

/**
 * @function createTaxResponse
 * @description Formats the response data for tax creation.
 * @param tax - The tax data to format.
 * @returns The formatted response data.
 */
export const createTaxResponse = (
  tax: CompanyTax
): ResponseDTO<CreateTaxResponseDTO> => {
  // Map each tax object to the response DTO format
  const response = {
    id: tax.id,
    taxName: tax.taxName,
    taxInclusive: tax.taxInclusive,
    companyId: tax.companyId,
    taxPercentage: tax.taxPercentage,
    description: tax.description,
    createdBy: tax.createdBy,
    modifiedBy: tax.modifiedBy,
    createdOn: tax.createdOn || new Date(),
    modifiedOn: tax.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Tax added successfully',
    data: response,
  };
};

/**
 * @function createUpdatedTaxResponse
 * @description Formats the response data for tax creation.
 * @param companytax - The tax data to format.
 * @returns The formatted response data.
 */
export const createUpdatedTaxResponse = (
  tax: CompanyTax
): ResponseDTO<CreateTaxResponseDTO> => {
  const response: CreateTaxResponseDTO = {
    id: tax.id,
    taxName: tax.taxName,
    taxInclusive: tax.taxInclusive,
    companyId: tax.companyId,
    taxPercentage: tax.taxPercentage,
    description: tax.description,
    createdBy: tax.createdBy,
    modifiedBy: tax.modifiedBy,
    createdOn: tax.createdOn || new Date(),
    modifiedOn: tax.modifiedOn || new Date(),
  };

  return {
    status: 'success',
    message: 'Tax updated successfully',
    data: response,
  };
};