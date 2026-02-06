/**
 * @class SpecialtyService
 * @description Service class for handling CRUD operations related to the Specialty model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  Specialty,
} from '../models/init-models';

export class SpecialtyService {
  private specialtyBaseService: BaseService<Specialty>;

  constructor() {
    this.specialtyBaseService = new BaseService(
      Specialty as unknown as { new (): Specialty } & typeof Specialty
    );
  }

  /**
   * Retrieves a list of active plans with optional filtering, sorting, and pagination.
   * @param filters - Optional filters to apply to the query.
   * @param limit - The maximum number of records to return.
   * @param offset - The number of records to skip before returning results.
   * @param sortBy - The column to sort the results by.
   * @param sortDirection - The direction to sort the results (ASC or DESC).
   * @returns A promise that resolves to a list of plans.
   */
  async getAllSpecialties(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Specialty[]; count: number }> {
    try {
     
      const { rows, count } = await this.specialtyBaseService.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllSpecialties:', error);
      throw error;
    }
  }

}
