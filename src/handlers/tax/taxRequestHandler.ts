import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import { Request } from 'express';
import { CreateTaxDTO } from '../../dtos/tax/TaxDTO';
import { validateTax } from '../../validators/TaxValidator';

export const extractTaxData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateTaxDTO => {
  const {
    taxName,
    description,
    taxPercentage,
    taxInclusive,
    companyId,
    createdBy
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateTax(
    {
      taxName,
      description,
      taxPercentage,
      taxInclusive,
      companyId,
      createdBy
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateTaxDTO;
};
