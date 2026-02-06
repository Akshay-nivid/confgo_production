import Joi from "joi";
import { GetAllEventImagesDTO, UploadEventImagesDTO } from "../../dtos/eventImages/EventImagesDTO";
import { AppError } from "../../utils/AppError";
import { validateEventImages } from "../../validators/eventImagesValidator";
import { Request } from "express";

export const extractUploadImagesData = (
  req: Request,
  schema: Joi.ObjectSchema
): UploadEventImagesDTO => {
  const { eventId, assetIds } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateEventImages(
    {
      eventId,
      assetIds
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as UploadEventImagesDTO;
};

export const extractAllEventImages = (
  req: Request,
  schema: Joi.ObjectSchema
): GetAllEventImagesDTO => {
  const { eventId } = req.body;

  // Validate the extracted data against the provided schema
  const { error, value } = validateEventImages(
    {
      eventId,
    },
    schema
  );
  if (error) {
    throw new AppError(error[0], 400);
  }

  return value as GetAllEventImagesDTO;
};
