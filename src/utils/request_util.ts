/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Request util
 * @description Generates Request object for list.
 * @author : sarathavs
 */
import { Request } from 'express';

interface ListRequestData {
  filters: any;
  limit: number;
  offset: number;
  sortBy: string;
  sortDirection: string;
  fields?: string[];
}

/**
 * Extracts and parses list-related parameters from the request body.
 * @param req - The Express request object.
 * @returns An object containing filters, pagination, sorting, and field selection.
 */
export const extractListRequestData = (req: Request): ListRequestData => {
  const {
    filters = {},
    limit = 10,
    offset = 0,
    sortBy = 'Id',
    sortDirection = 'ASC',
    fields,
  } = req.body;

  return {
    filters,
    limit: Number(limit),
    offset: Number(offset),
    sortBy: String(sortBy),
    sortDirection: String(sortDirection).toUpperCase(),
    fields: fields ? fields.map((field: string) => String(field)) : undefined,
  };
};
