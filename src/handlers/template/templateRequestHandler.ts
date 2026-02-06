import { Request } from 'express';
import { TemplateFilterRequestDTO } from '../../dtos/template/TemplateDTO';

/**
 * Extracts and validates template data from the request for template list.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 * @author : sarathavs
 */
export const extractTemplateLisFiltertData = (
  req: Request
): TemplateFilterRequestDTO => {
  const value = req.body;
  return value.filters as TemplateFilterRequestDTO;
};
