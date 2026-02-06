import { Transaction } from 'sequelize';
/**
 * @author saneeshiv
 * @class TemplateService
 * @description Service class for handling CRUD operations related to the Template model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Asset, Color, Template } from '../models/init-models';
import { Utils } from '../utils/Utils';
import { Op, WhereOptions } from 'sequelize';
import { TemplateFilterDTO } from '../dtos/template/TemplateDTO';

export class TemplateService {
  private templateBaseService: BaseService<Template>;
  private colorBaseService: BaseService<Color>;

  constructor() {
    this.templateBaseService = new BaseService(
      Template as unknown as { new (): Template } & typeof Template
    );
    this.colorBaseService = new BaseService(
      Color as unknown as { new (): Color } & typeof Color
    );
  }

  /**
   * Retrieves a list of active templates with optional filtering, sorting, and pagination.
   * @param filters - Optional filters to apply to the query.
   * @param limit - The maximum number of records to return.
   * @param offset - The number of records to skip before returning results.
   * @param sortBy - The column to sort the results by.
   * @param sortDirection - The direction to sort the results (ASC or DESC).
   * @returns A promise that resolves to a list of templates.
   */
  async getAllTemplates(
    filters: TemplateFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Template[]; count: number }> {
    try {
      const whereCondition: WhereOptions<Template> = {};
      if (Utils.isNotUndefined(filters?.id)) {
        whereCondition.id = filters.id;
      }
      if (Utils.isNotUndefined(filters?.assetId)) {
        whereCondition.assetId = filters.assetId;
      }
      if (Utils.isNotUndefined(filters?.enabled)) {
        whereCondition.enabled = filters.enabled;
      }
      if (Utils.isNotUndefined(filters?.isDefault)) {
        whereCondition.isDefault = filters.isDefault;
      }
      if (filters?.name) {
        whereCondition.name = { [Op.like]: `%${filters.name}%` };
      }

      const { rows, count } = await this.templateBaseService.findAndCountAll({
        where: { ...whereCondition },
        include: [
          {
            model: Asset,
            as: 'asset',
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllTemplates:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single template by their primary key (ID).
   * @param id - The ID of the template to retrieve.
   * @returns A promise that resolves to the template record, or null if not found.
   */
  async getTemplateById(
    id: number,
    transaction?: Transaction
  ): Promise<Template | null> {
    try {
      return this.templateBaseService.findById(
        id,
        {
          include: [
            {
              model: Asset,
              as: 'asset',
            },
          ],
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getTemplateById:', error);
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of template colors with sorting.
   *
   * @param limit The maximum number of template colors to return.
   * @param offset The number of items to skip before starting to collect the result set.
   * @param sortBy The field to sort the result by (e.g., 'name', 'dateCreated').
   * @param sortDirection The direction to sort the result in ('ASC' for ascending, 'DESC' for descending).
   *
   * @returns An object containing an array of template colors (rows) and the total count of template colors.
   */
  async getAllTemplateColors(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Color[]; count: number }> {
    try {
      // Fetches a paginated list of template colors from the database, sorted by the specified field and direction.
      const { rows, count } = await this.colorBaseService.findAndCountAll({
        limit, // Limits the number of colors to fetch.
        offset, // Skips the specified number of items for pagination.
        order: [[sortBy, sortDirection.toUpperCase()]], // Sorts the result by the specified field and direction.
      });

      // Returns the fetched colors (rows) and the total count of colors.
      return { rows, count };
    } catch (error) {
      // Logs the error message if there is an issue during the fetch.
      Logger.error('Error getAllTemplateColors:', error);

      // Throws the error so it can be handled by the caller.
      throw error;
    }
  }
}
