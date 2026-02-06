/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author sarathavs
 * @class UserService
 * @description Service class for handling user data.
 */
import { BaseService } from './BaseService';
import { UserData } from '../models/init-models';

export class DataService {
  private baseService: BaseService<UserData>;

  constructor() {
    this.baseService = new BaseService(
      UserData as unknown as { new (): UserData } & typeof UserData
    );
  }

  /**
   * Fetches all users with optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - limit.
   * @param offset - skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of user data and the total count of matching the criteria.
   */
  async getAllData(
    filters: any,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: UserData[]; count: number }> {
    const { count, rows } = await this.baseService.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [[sortBy, sortDirection.toUpperCase()]], // Adding sorting to the query
    });

    return { rows, count };
  }
}
