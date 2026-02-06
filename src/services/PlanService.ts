/**
 * @author saneeshiv
 * @class PlanService
 * @description Service class for handling CRUD operations related to the Plan model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  Plan,
  PlanProperty,
  PlanPropertyAssignment,
  PlanPropertyAssignmentStatus,
  PlanStatus,
} from '../models/init-models';
import { PlanFilterDTO } from './../dtos/plan/PlanDTO';
import { Utils } from '../utils/Utils';
import { Op, WhereOptions } from 'sequelize';

export class PlanService {
  private planBaseService: BaseService<Plan>;
  private planPropertyBaseService: BaseService<PlanProperty>;
  private planStatusBaseService: BaseService<PlanStatus>;
  private planPropertyAssignmentStatusBaseService: BaseService<PlanPropertyAssignmentStatus>;

  constructor() {
    this.planBaseService = new BaseService(
      Plan as unknown as { new (): Plan } & typeof Plan
    );
    this.planPropertyBaseService = new BaseService(
      PlanProperty as unknown as {
        new (): PlanProperty;
      } & typeof PlanProperty
    );
    this.planStatusBaseService = new BaseService(
      PlanStatus as unknown as { new (): PlanStatus } & typeof PlanStatus
    );
    this.planPropertyAssignmentStatusBaseService = new BaseService(
      PlanPropertyAssignmentStatus as unknown as {
        new (): PlanPropertyAssignmentStatus;
      } & typeof PlanPropertyAssignmentStatus
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
  async getAllPlans(
    filters: PlanFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Plan[]; count: number }> {
    try {
      const whereCondition: WhereOptions<Plan> = {};
      if (Utils.isNotUndefined(filters?.id)) {
        whereCondition.id = filters.id;
      }
      if (Utils.isNotUndefined(filters?.amount)) {
        whereCondition.amount = filters.amount;
      }
      if (Utils.isNotUndefined(filters?.validityDay)) {
        whereCondition.validityDay = filters.validityDay;
      }
      if (Utils.isNotUndefined(filters?.statusId)) {
        whereCondition.statusId = filters.statusId;
      }
      if (Utils.isNotUndefined(filters?.createdBy)) {
        whereCondition.createdBy = filters.createdBy;
      }
      if (Utils.isNotUndefined(filters?.modifiedBy)) {
        whereCondition.modifiedBy = filters.modifiedBy;
      }
      if (filters?.name) {
        whereCondition.name = { [Op.like]: `%${filters.name}%` };
      }

      const { rows, count } = await this.planBaseService.findAndCountAll({
        where: { ...filters },
        include: [
          {
            model: PlanPropertyAssignment,
            as: 'planPropertyAssignments',
            include: [{ model: PlanProperty, as: 'planProperty' }],
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllPlans:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single plan by their primary key (ID).
   * @param id - The ID of the plan to retrieve.
   * @returns A promise that resolves to the Plan record, or null if not found.
   */
  async getPlanById(id: number): Promise<Plan | null> {
    try {
      return this.planBaseService.findById(id, {
        include: [
          {
            model: PlanPropertyAssignment,
            as: 'planPropertyAssignments',
            include: [{ model: PlanProperty, as: 'planProperty' }],
          },
        ],
      });
    } catch (error) {
      Logger.error('Error getPlanById:', error);
      throw error;
    }
  }

  /**
   * Gets plan status. Find a plan status that matches the given `statusName`.
   * @param statusName The name of the status to retrieve.
   * @returns A promise that resolves to  plan status.
   */
  async getPlanStatus(statusName: string): Promise<PlanStatus | null> {
    try {
      return this.planStatusBaseService.findOne({
        where: { statusName: statusName },
      });
    } catch (error) {
      Logger.error('Error getPlanStatus:', error);
      throw error;
    }
  }

  /**
   * Gets plan property assignment status. Find a plan property assignment status that matches the given `statusName`.
   * @param statusName The name of the status to retrieve.
   * @returns A promise that resolves to  plan status.
   */
  async getPlanPropertyAssignmentStatus(
    statusName: string
  ): Promise<PlanPropertyAssignmentStatus | null> {
    try {
      return this.planPropertyAssignmentStatusBaseService.findOne({
        where: { statusName: statusName },
      });
    } catch (error) {
      Logger.error('Error getPlanPropertyAssignmentStatus:', error);
      throw error;
    }
  }
}
