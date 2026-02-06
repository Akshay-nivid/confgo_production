import { Request } from 'express';
import { PlanFilterRequestDTO } from '../../dtos/plan/PlanDTO';

/**
 * Extracts and validates plan data from the request for plan list.
 * @param req - The Express request object.
 * @param schema - The Joi validation schema to validate against.
 * @returns The validated user data.
 * @throws AppError if validation fails.
 * @author : sarathavs
 */
export const extractPlanLisFiltertData = (
  req: Request
): PlanFilterRequestDTO => {
  const value = req.body;
  return value.filters as PlanFilterRequestDTO;
};
