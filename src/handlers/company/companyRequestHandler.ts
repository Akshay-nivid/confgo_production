/**
 * @author saneeshiv
 * @description Extracts and validates company data from the request.
 */
import { Request } from 'express';
import Joi from 'joi';
import {
  CreateCompanyDTO,
  UpdateCompanyDTO,
} from '../../dtos/company/CompanyDTO';
import { validateCompany } from '../../validators/companyValidator';
import { AppError } from '../../utils/AppError';

/**
 * Extracts and validates company data from the request for company creation.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractCreateCompanyData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateCompanyDTO => {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyPhone,
    companyEmail,
    companyName,
    companyAddress,
    planId,
    statusId,
    assetId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCompany(
    {
      firstName,
      lastName,
      email,
      phone,
      companyPhone,
      companyEmail,
      companyName,
      companyAddress,
      planId,
      statusId,
      assetId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateCompanyDTO;
};

/**
 * Extracts and validates company data from the request for company update.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 */
export const extractUpdateCompanyData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateCompanyDTO => {
  const {
    companyPhone,
    companyEmail,
    companyName,
    companyAddress,
    statusId,
    assetId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateCompany(
    {
      companyPhone,
      companyEmail,
      companyName,
      companyAddress,
      statusId,
      assetId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateCompanyDTO;
};
