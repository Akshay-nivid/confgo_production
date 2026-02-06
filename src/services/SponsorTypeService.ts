/**
 * @class SponsorTypeService
 * @description Controller class for handling HTTP requests related to Sponsor Type operations.
 * @author Nihal
 */

import { WhereOptions } from 'sequelize/types/model';
import { SponsorType } from '../models/SponsorType';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { SponsorTypeFilterDTO } from '../dtos/sponsorType/SponsorTypeDTO';

export class SponsorTypeService {
  private sponsorTypeBaseService: BaseService<SponsorType>;

  constructor() {
    this.sponsorTypeBaseService = new BaseService(
      SponsorType as unknown as {
        new (): SponsorType;
      } & typeof SponsorType
    );
  }

  /**
   * Fetches a list of sponsor types based on provided filters, pagination, and sorting.
   *
   * @param filters - Filters to apply (e.g., by name).
   * @param limit - Maximum number of records to fetch.
   * @param offset - Number of records to skip for pagination.
   * @param sortBy - Column to sort by.
   * @param sortDirection - Sorting direction (ASC or DESC).
   * @returns An object containing rows of sponsor types and the total count.
   */
  async getRoleList(
    filters: SponsorTypeFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: SponsorType[]; count: number }> {
    try {
      // Build where condition based on filters
      const whereCondition: WhereOptions = {};

      if (filters?.name) {
        whereCondition.name = filters.name;
      }

      // Fetch data with filters, pagination, and sorting
      const { count, rows } = await this.sponsorTypeBaseService.findAndCountAll(
        {
          where: whereCondition,
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        }
      );

      return { rows, count };
    } catch (error) {
      Logger.error('Failed to retrieve sponsor types:', error);
      throw error;
    }
  }
}
