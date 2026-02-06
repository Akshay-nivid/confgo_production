import { Company, User } from '../../models/init-models';
import { ResponseDTO } from '../ResponseDTO';
/**
 * @author saneeshiv
 * @description
 */

export interface CreateCompanyDTO {
  phone: string;
  email: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  state?: string;
  firstName: string;
  lastName: string;
  planId: number;
  statusId: number;
  assetId?: string;
}

export interface CompanyResponseDTO {
  id: number;
  phone: string;
  email?: string;
  companyName: string;
  companyAddress: string;
  state?: string;
  subscriptionId: number;
  assetId?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneVerified?: number;
  };
}

/**
 * Constructs the response for a successful company creation.
 *
 * This function formats the data for a newly created company, including its
 * basic information, associated user details, and subscription ID, to return
 * a standardized response object.
 *
 * @param c - The created `Company` object containing company details.
 * @param user - The `User` object associated with the company, representing the creator or administrator.
 * @param subscriptionId - The ID of the subscription associated with the company.
 *
 * @returns A response object containing the status, success message, and
 *          `CompanyResponseDTO` data with company and user information.
 */
export const createCompanyResponse = (
  c: Company,
  user: User,
  subscriptionId: number
): ResponseDTO<CompanyResponseDTO> => {
  const response: CompanyResponseDTO = {
    id: c.id,
    phone: c.phone,
    companyName: c.companyName,
    companyAddress: c.companyAddress,
    state: c.state,
    email: c.email,
    subscriptionId: subscriptionId,
    assetId: c.assetId,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
    },
  };

  return {
    status: 'success',
    message: 'Company created successfully',
    data: response,
  };
};

/**
 * DTO for updating company details.
 */
export interface UpdateCompanyDTO {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  statusId: number;
  assetId?: string;
}

/**
 * DTO for the response after updating a company's details.
 */
export interface UpdateCompanyResponseDTO {
  id: number;
  phone: string;
  email?: string;
  companyName: string;
  companyAddress: string;
  state?: string;
  assetId?: string;
}

/**
 * Formats the response for a successful company update.
 *
 * This function takes in the updated `Company` object and extracts key details
 * to return a structured response in a consistent format.
 *
 * @param c - The updated `Company` object containing company details.
 *
 * @returns A response object containing the status, message, and company details
 *          formatted as `UpdateCompanyResponseDTO`.
 */
export const updateCompanyResponse = (
  c: Company
): ResponseDTO<UpdateCompanyResponseDTO> => {
  const response: UpdateCompanyResponseDTO = {
    id: c.id,
    phone: c.phone,
    companyName: c.companyName,
    companyAddress: c.companyAddress,
    state: c.state,
    email: c.email,
    assetId: c.assetId,
  };

  return {
    status: 'success',
    message: 'Company details updated',
    data: response,
  };
};

/**
 * DTO for user and company details response
 */
export interface CompanyDetailsDTO {
  id: number;
  phone: string;
  email?: string;
  companyName: string;
  companyAddress: string;
  state?: string;
  assetId?: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneVerified?: number;
    assetId?: string;
  };
}

/**
 *
 * @param company - The `Company` object containing company details.
 * @param user - The `User` object associated with the company, representing the creator or administrator.
 *
 * @returns A response object containing the status, success message, and
 *          `CompanyDetailsDTO` data with company and user information.
 */
export const CompanyDetailsResponse = (
  company: Company,
  user: User
): ResponseDTO<CompanyDetailsDTO> => {
  const response: CompanyDetailsDTO = {
    id: company.id,
    phone: company.phone,
    companyName: company.companyName,
    companyAddress: company.companyAddress,
    state: company.state,
    email: company.email,
    assetId: company.assetId,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      assetId: user.assetId,
    },
  };

  return {
    status: 'success',
    message: 'Details fetched successfully',
    data: response,
  };
};
