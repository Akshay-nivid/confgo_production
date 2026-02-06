import { Op, Transaction } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Addon } from '../models/Addon';
import { AddonFilterDTO, CreateAddonDTO } from '../dtos/addon/AddonDTO';
import { Company } from '../models/Company';
import { UserCompany } from '../models/UserCompany';

export class AddonService {
  private addonBaseService: BaseService<Addon>;
  private companyBaseService: BaseService<Company>;
  private userCompanyBaseService: BaseService<UserCompany>;

  constructor() {
    this.addonBaseService = new BaseService(
      Addon as unknown as {
        new (): Addon;
      } & typeof Addon
    );

    this.companyBaseService = new BaseService(
      Company as unknown as {
        new (): Company;
      } & typeof Company
    );

    this.userCompanyBaseService = new BaseService(
      UserCompany as unknown as {
        new (): UserCompany;
      } & typeof UserCompany
    );
  }

  /**
   * Retrieves a list of add-ons based on the provided filters, pagination, and sorting options.
   * @param filters - Filters for querying add-ons (e.g., name, owner)
   * @param limit - Maximum number of results to return (pagination limit)
   * @param offset - Number of results to skip before returning (pagination offset)
   * @param sortBy - Field to sort by
   * @param sortDirection - Direction to sort
   * @returns An object containing the rows of add-ons and the total count of matching records
   */
  async getAllAddOn(
    filters: AddonFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Addon[]; count: number }> {
    try {
      if (filters?.name) {
        filters.name = { [Op.like]: `%${filters.name}%` }; // Use a wildcard search for the name
      }

      if (filters?.owner) {
        filters.owner = { [Op.like]: `%${filters.owner}%` };
      }

      const { count, rows } = await this.addonBaseService.findAndCountAll({
        where: { ...filters },
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      return { rows, count };
    } catch (error) {
      Logger.error('Error to get all addon:', error);
      throw error;
    }
  }

  /**
   * Function to create an Addon entry
   * @param data data CreateAddonDTO - the data for creating an addon
   * @returns Addon
   */
  async createAddon(data: CreateAddonDTO, userId: number): Promise<Addon> {
    return this.addonBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          const userCompanies = await this.userCompanyBaseService.findAll({
            where: { userId },
            attributes: ['companyId'], // Only select the companyId column
            transaction,
          });
          // Check if user has any associated companyId
          if (!userCompanies || userCompanies.length === 0) {
            throw new Error('No associated company found for this user');
          }
          const companyId = userCompanies[0].companyId;
          const req = {
            name: data.name,
            description: data.description,
            createdBy: userId,
            companyId: companyId,
            owner: data.owner,
            createdOn: new Date(),
          };

          // Check if insertion is done by a company
          if (data.companyId) {
            req.companyId = data.companyId; // Set companyId from data
            const company = await this.companyBaseService.findById(
              data.companyId
            );
            if (!company) {
              throw new Error('Company not found'); // Handle case where company does not exist
            }
            req.owner = company.dataValues.companyName;
          } else {
            req.owner = 'admin'; // Set owner to admin
          }

          const newAddon = await this.addonBaseService.create(req, transaction);
          return newAddon;
        } catch (error) {
          Logger.error('Error creating addon', error);
          throw error;
        }
      }
    );
  }
}
