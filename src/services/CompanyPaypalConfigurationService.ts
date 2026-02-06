/**
 * @author nihal
 * @class CompanyPaypalConfigurationService
 * @description Service class for handling CRUD operations related to the Comoany Paypal Configuration model.
 */

import { Transaction, WhereOptions } from 'sequelize';
import { CompanyPaypalConfiguration } from '../models/CompanyPaypalConfiguration';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Company } from '../models/Company';
import { Event } from '../models/Event';
import { enumPaypalConfigStatus, enumRoll } from '../utils/enum';
import {
  CreatePaypalConfigDTO,
  PaypalConfigFiltersDTO,
  UpdatePaypalConfigDTO,
} from '../dtos/companyPaypalConfiguration/CompanyPaypalConfigurationDTO';
import { UserCompany } from '../models/UserCompany';

export class CompanyPaypalConfigurationService {
  private companyPaypalConfigurationBaseService: BaseService<CompanyPaypalConfiguration>;
  private companyBaseService: BaseService<Company>;
  private eventBaseService: BaseService<Event>;
  private userCompanyBaseService: BaseService<UserCompany>;

  constructor() {
    this.companyPaypalConfigurationBaseService = new BaseService(
      CompanyPaypalConfiguration as unknown as {
        new (): CompanyPaypalConfiguration;
      } & typeof CompanyPaypalConfiguration
    );
    this.companyBaseService = new BaseService(
      Company as unknown as {
        new (): Company;
      } & typeof Company
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
    this.userCompanyBaseService = new BaseService(
      UserCompany as unknown as {
        new (): UserCompany;
      } & typeof UserCompany
    );
  }

  /**
   * Creates a PayPal configuration entry for a company.
   *
   * @param configData - The data required to create a PayPal configuration.
   * @param userId - The ID of the user creating the configuration.
   * @param transaction - Optional transaction parameter for database operations.
   * @returns The created PayPal configuration or null if creation fails.
   */
  async createPaypalConfig(
    configData: CreatePaypalConfigDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<CompanyPaypalConfiguration> {
    try {
      // Fetch the company details using the provided company ID
      const company = await this.companyBaseService.findById(
        configData.companyId,
        undefined,
        transaction
      );

      // If the company does not exist, log an error and throw an exception
      if (!company) {
        const errorMessage = `Company with ID ${configData.companyId} does not exist`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // If an event ID is provided, validate that the event exists
      if (configData.eventId) {
        const event = await this.eventBaseService.findById(
          configData.eventId,
          undefined,
          transaction
        );
        if (!event) {
          const errorMessage = `Event with ID ${configData.eventId} does not exist`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Construct the request object for creating the PayPal configuration
      const configReq = {
        companyId: company.dataValues.id,
        userId: userId,
        clientId: configData.clientId,
        currency: configData.currency,
        statusId: enumPaypalConfigStatus.ACTIVE,
        eventId: configData?.eventId ?? undefined,
        createdBy: userId,
        modifiedBy: 0,
      };

      // Create the PayPal configuration entry in the database
      const config = await this.companyPaypalConfigurationBaseService.create(
        configReq,
        transaction
      );

      // Return the created PayPal configuration
      return config;
    } catch (err) {
      // Log the error and rethrow it for further handling
      Logger.error('Error in createPaypalConfig:', err);
      throw err;
    }
  }

  /**
   * Retrieves PayPal configuration details by its ID.
   *
   * @param configId - The unique identifier of the PayPal configuration.
   * @returns A promise that resolves to the PayPal configuration data if found.
   * @throws An error if no configuration is found or if an unexpected error occurs.
   */
  async getPaypalConfigById(companyId: number) {
    try {
      // Fetch PayPal configuration details from the service using the given configId
      const data = await this.companyPaypalConfigurationBaseService.findOne({
        where: { companyId: companyId },
      });

      // If no data is found, log the information and throw an error
      if (!data) {
        Logger.info(
          'No Company PayPal Config found for Company Id:',
          companyId
        );
        throw new Error('No PayPal Config found');
      }

      // Return the retrieved PayPal configuration data
      return data;
    } catch (error) {
      // Log the error details and rethrow the error
      Logger.error('Error in getPaypalConfigById:', error);
      throw error;
    }
  }

  /**
   * Updates a PayPal configuration for a specific company.
   *
   * @param id - The ID of the PayPal configuration to update.
   * @param reqData - The data provided in the request for updating the configuration.
   * @param userId - The ID of the user who is making the update.
   * @returns A promise that resolves to an array containing the number of updated records and the updated PayPal configuration data.
   */
  async updatePaypalConfig(
    id: number,
    reqData: UpdatePaypalConfigDTO,
    userId: number
  ): Promise<[number, CompanyPaypalConfiguration[] | undefined]> {
    try {
      // Check if the PayPal configuration with the given ID exists in the database.
      const paypalConfig =
        await this.companyPaypalConfigurationBaseService.findById(id);

      // If no configuration is found, log the error and throw an exception.
      if (!paypalConfig) {
        const errorMessage = `Paypal config with ID ${id} does not exist to Update.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Prepare the updated configuration data by assigning values from the request data (reqData).
      const updateData = {
        companyId: reqData?.companyId,
        clientId: reqData?.clientId,
        userId: reqData?.userId,
        currency: reqData?.currency,
        eventId: reqData?.eventId,
        statusId: reqData?.statusId,
        modifiedBy: userId,
        modifiedOn: new Date(),
      };

      // It returns an array with the number of updated rows and the updated configuration data.
      return this.companyPaypalConfigurationBaseService.update(id, updateData);
    } catch (error) {
      // Log the error if any issue occurs during the update process.
      Logger.error('Error updating PayPal configuration:', error);
      throw error;
    }
  }

  /**
   * Retrieves a PayPal configuration by its ID. If the configuration is not found, throws an error.
   *
   * @param id - The ID of the PayPal configuration to retrieve.
   * @returns The PayPal configuration object if found.
   * @throws An error if the PayPal configuration with the given ID does not exist.
   */
  async getPaypalConfigOrThrow(
    id: number
  ): Promise<CompanyPaypalConfiguration> {
    // Retrieve the PayPal configuration using the provided ID.
    const config =
      await this.companyPaypalConfigurationBaseService.findById(id);

    // If no configuration is found, throw an error indicating it was not found.
    if (!config) {
      throw new Error('Paypal config not found');
    }
    return config;
  }

  /**
   * Retrieves a list of PayPal configurations based on filters, pagination, and sorting.
   *
   * @param filters - The filters to apply to the PayPal configuration query (e.g., companyId, eventId).
   * @param limit - The maximum number of records to retrieve (for pagination).
   * @param offset - The number of records to skip before starting to return results (for pagination).
   * @param sortBy - The field to sort the results by (e.g., 'clientId', 'currency').
   * @param sortDirection - The direction of the sort ('ASC' or 'DESC').
   * @param userId - The ID of the user making the request, used for role-based filtering.
   * @param userRole - The role of the user, used to determine access to specific data (e.g., 'COMPANYADMIN').
   * @returns An object containing the paginated list of PayPal configurations and the total count.
   */
  async paypalConfigList(
    filters: PaypalConfigFiltersDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number,
    userRole: string
  ): Promise<{ rows: CompanyPaypalConfiguration[]; count: number }> {
    try {
      // Initialize the condition object that will be used to filter PayPal configurations.
      const paypalConfigCondition: WhereOptions = {};

      // Role-based filtering: If the user is a COMPANYADMIN, only return configurations related to their company.
      if (userRole === enumRoll.COMPANYADMIN) {
        const userCompany = await this.userCompanyBaseService.findOne({
          where: { userId: userId }, 
        });

        // Set the companyId filter to limit the results to the user's company.
        paypalConfigCondition.companyId = userCompany?.dataValues.companyId;
      } else {
        // If the user is not a COMPANYADMIN, apply any companyId filter if provided.
        if (filters?.companyId) {
          paypalConfigCondition.companyId = filters.companyId;
        }
      }

      // Apply filters to the PayPal configuration query based on the provided filter parameters.
      if (filters?.eventId) {
        paypalConfigCondition.eventId = filters.eventId;
      }

      if (filters?.clientId) {
        paypalConfigCondition.clientId = filters.clientId;
      }

      if (filters?.statusId) {
        paypalConfigCondition.statusId = filters.statusId;
      }

      if (filters?.currency) {
        paypalConfigCondition.currency = filters.currency;
      }

      if (filters?.userId) {
        paypalConfigCondition.userId = filters.userId;
      }

      // Query the database for PayPal configurations that match the filter conditions, with pagination and sorting.
      const { count, rows } =
        await this.companyPaypalConfigurationBaseService.findAndCountAll({
          where: paypalConfigCondition,
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });

      // Return the list of PayPal configurations (rows) and the total count of records.
      return { rows, count };
    } catch (error) {
      // Log any errors that occur during the process.
      Logger.error('Error in paypalConfigList:', error);
      throw error;
    }
  }
}
