import Joi from 'joi';
import { AppError } from '../../utils/AppError';
import {
  CreateSponsorDTO,
  sponsorAssignDTO,
  UpdateSponsorDTO,
} from '../../dtos/sponsor/SponsorDTO';
import { validateSponsor } from '../../validators/sponsorValidator';
import { Request } from 'express';

export const extractSponsorData = (
  req: Request,
  schema: Joi.ObjectSchema
): CreateSponsorDTO => {
  const {
    name,
    email,
    phone,
    companyId,
    website,
    logoAssetId,
    bannerImgAssetId,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateSponsor(
    {
      name,
      email,
      phone,
      companyId,
      website,
      logoAssetId,
      bannerImgAssetId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as CreateSponsorDTO;
};

export const extractSponsorAssignData = (
  req: Request,
  schema: Joi.ObjectSchema
): sponsorAssignDTO => {
  const { sponsors } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateSponsor(
    {
      sponsors,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as sponsorAssignDTO;
};

export const extractUpdateSponsorData = (
  req: Request,
  schema: Joi.ObjectSchema
): UpdateSponsorDTO => {
  const {
    name,
    website,
    logoAssetId,
    bannerImgAssetId,
    companyId,
    email,
    phone,
  } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateSponsor(
    {
      name,
      website,
      logoAssetId,
      bannerImgAssetId,
      companyId,
      email,
      phone,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UpdateSponsorDTO;
};
