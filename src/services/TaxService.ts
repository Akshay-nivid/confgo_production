/**
 * @class TaxService
 * @description Service class for handling tax operations .
 * @author Neethu
 */

import { Transaction, WhereOptions } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { CompanyTax } from '../models/CompanyTax';
import { CreateTaxDTO, FilterDTO, UpdateTaxDTO } from '../dtos/tax/TaxDTO';

export class TaxService {
  private taxBaseService: BaseService<CompanyTax>;
  constructor() {
    // Cast the CompanyTax model explicitly to match the expected constructor signature
    this.taxBaseService = new BaseService(
      CompanyTax as unknown as { new (): CompanyTax } & typeof CompanyTax
    );
    
  }

  /**
   * Creates tax details  based on the provided  data.
   * @param data - Array of tax data to create or update.
   * @param userId - ID of the user creating the tax(s).
   * @param transaction - Sequelize transaction for atomic operations.
   * @returns created tax.
   * @throws Error if there is an issue during creation.
   */
  async createTax(
    data: CreateTaxDTO,
    userId: number,
    transaction: Transaction
  ): Promise<CompanyTax> {
    try {

      // Prepare the tax request payload
      const taxPayload = {
        taxName:data.taxName,
        description:data.description,
        taxPercentage:data.taxPercentage,
        taxInclusive:data.taxInclusive,
        companyId: userId, //company_user_id 
        createdBy: userId,
        modifiedBy: userId,
      };

      // Create or upsert the tax record
      const result = await this.taxBaseService.create(
        taxPayload,
        transaction
      );

      return result;
    } catch (err) {
      Logger.error('Error creating company tax:', err);
      throw err;
    }
  }

  /**
   * Get Tax Details
   * @param filters 
   * @param limit 
   * @param offset 
   * @param sortBy 
   * @param sortDirection 
   * @param userId 
   * @returns 
   */
  async getList(
    filters: FilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: CompanyTax[]; count: number }> {
    try {
      const condition: WhereOptions = {};
     
      if(userId)
      {
        condition.companyId =userId;
      }
      else if (filters.companyUserId) {
        condition.companyId = filters.companyUserId;
      }

      // Exclude other details from fetching data
      const exclude = ['modifiedOn', 'modifiedBy', 'createdBy', 'createdOn'];
      const rows = await this.taxBaseService.findAll({
        where: condition,
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      //fetching count of data
      const count = await this.taxBaseService.count({
        where: condition
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error get all company tax details', error);
      throw error;
    }
  }


    /**
   * Updates an existing company tax.
   * @param id - The ID of the tax to update.
   * @param data - The data to update the tax with.
   * @param userId - The ID of the user making the update.
   * @param transaction - The transaction to be used for the update.
   * @returns The updated tax object.
   * @throws Error if the tax is not found or if an error occurs during the update.
   */
    async updateTax(
      id: number,
      data: UpdateTaxDTO,
      userId: number,
      transaction: Transaction
    ) {
      try {
        // Check if the company tax exists
        const tax = await this.taxBaseService.findById(id);
        if (!tax) {
          const errorMessage = `No Data found.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
  
        // Prepare the update request
        const updateReq = {
          taxName:data.taxName,
          description:data.description,
          taxPercentage:data.taxPercentage,
          taxInclusive:data.taxInclusive,
          modifiedBy: userId,
        };
  
        // Perform the update
        return await this.taxBaseService.update(
          id,
          updateReq,
          undefined,
          transaction
        );
      } catch (error) {
        Logger.error('Error updating company tax:', error);
        throw error; // Rethrow the error for further handling
      }
    }

  /**
   * Retrieves a tax by ID or throws an error if not found.
   * @param id - The ID of the tax to retrieve.
   * @param transaction - The Sequelize transaction object for database operations.
   * @returns The tax object if found.
   * @throws {Error} If no tax is found with the given ID.
   */
  async getTax(
    id: number,
    transaction: Transaction
  ): Promise<CompanyTax> {
    const taxData = await this.taxBaseService.findById(
      id,
      undefined,
      transaction
    );
    if (!taxData) {
      throw new Error('Tax not found');
    }
    return taxData;
  }
}