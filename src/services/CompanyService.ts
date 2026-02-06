/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author saneeshiv
 * @class CompanyService
 * @description Service class for handling CRUD operations related to the Company model.
 */
import { Transaction } from 'sequelize';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  Company,
  CompanyStatus,
  User,
  UserCompany,
} from '../models/init-models';
import { CreateCompanyDTO } from '../dtos/company/CompanyDTO';

export class CompanyService {
  private companyBaseService: BaseService<Company>;
  private companyStatusBaseService: BaseService<CompanyStatus>;
  private userBaseService: BaseService<User>;

  constructor() {
    this.companyBaseService = new BaseService(
      Company as unknown as { new (): Company } & typeof Company
    );
    this.companyStatusBaseService = new BaseService(
      CompanyStatus as unknown as {
        new (): CompanyStatus;
      } & typeof CompanyStatus
    );
    this.userBaseService = new BaseService(
      User as unknown as { new (): User } & typeof User
    );
  }

  /**
   * Creates a new company.
   * @param companyData - The data to create the company.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Company.
   */
  async createCompany(
    companyData: CreateCompanyDTO,
    transaction?: Transaction
  ): Promise<Company> {
    try {
      // Prepare the company creation request object
      const cReq = {
        email: companyData.companyEmail,
        phone: companyData.companyPhone,
        companyName: companyData.companyName,
        companyAddress: companyData.companyAddress,
        statusId: companyData.statusId,
        assetId: companyData.assetId,
        createdBy: 0,
        modifiedBy: 0,
      };
      // Create a new company in the database
      const newCompanyData = await this.companyBaseService.create(
        cReq,
        transaction
      );

      // Return the newly created company data
      return newCompanyData;
    } catch (error) {
      Logger.error('Error createCompany:', error);
      throw error;
    }
  }

  /**
   * Updates an existing company.
   * @param id - The ID of the company to update.
   * @param updateData - The data to update.
   * @returns A promise that resolves to the number of affected rows and an array of the updated Company records (if { returning: true } is set).
   */
  async updateCompany(
    id: number,
    updateData: any,
    transaction?: Transaction
  ): Promise<[number, Company[] | undefined]> {
    try {
      return this.companyBaseService.update(
        id,
        updateData,
        undefined,
        transaction
      );
    } catch (error) {
      Logger.error('Error updateCompany:', error);
      throw error;
    }
  }

  /**
   * Gets a company by its ID.
   * @param id - The ID of the company.
   * @returns A promise that resolves to the Company record or null if not found.
   */
  async getCompanyById(id: number): Promise<Company | null> {
    try {
      return this.companyBaseService.findOne({ where: { id } });
    } catch (error) {
      Logger.error('Error getCompanyById:', error);
      throw error;
    }
  }

  /**
   * Gets all companies.
   * @returns A promise that resolves to a list of companies.
   */
  async getAllCompanies(): Promise<Company[]> {
    try {
      return this.companyBaseService.findAll();
    } catch (error) {
      Logger.error('Error getAllCompanies:', error);
      throw error;
    }
  }

  /**
   * Gets company status by name.
   * @param statusName
   * @returns A promise that resolves to  company status.
   */
  async getCompanyStatus(statusName: string): Promise<CompanyStatus | null> {
    try {
      return this.companyStatusBaseService.findOne({
        where: { statusName: statusName },
      });
    } catch (error) {
      Logger.error('Error getCompanyStatus:', error);
      throw error;
    }
  }

  /**
   * Gets All company status list.
   * @returns A promise that resolves to  company status.
   */
  async getAllCompanyStatus(
    filters: any,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: CompanyStatus[]; count: number }> {
    try {
      const { count, rows } =
        await this.companyStatusBaseService.findAndCountAll({
          where: filters,
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getCompanyStatus:', error);
      throw error;
    }
  }

  /**
   * Throws an error if the company does not exist.
   * @param id - The ID of the company.
   * @returns A promise that resolves to the Company record.
   * @throws An error if the company does not exist.
   */
  async getCompanyOrThrow(id: number): Promise<Company> {
    const company = await this.companyBaseService.findById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  }

  /**
   * Retrieves a single company by their user id.
   * @param userData - The User object containing user details.
   * @returns A promise that resolves to an object containing user data and the associated company, or throws an error.
   */
  async getCompanyDetailsByUserId(
    userId: number
  ): Promise<{ userData: User; company: Company }> {
    try {
      // Find the user and the associated company through the userCompany table
      const userCompany = await this.userBaseService.findOne({
        where: { id: userId },
        include: [
          {
            model: UserCompany,
            as: 'userCompanies',
            required: true,
            include: [
              {
                model: Company,
                as: 'company',
                required: true,
              },
            ],
          },
        ],
      });

      // Check if user has a company, if not, log and throw an error
      if (
        !userCompany ||
        !userCompany.userCompanies ||
        userCompany.userCompanies.length === 0
      ) {
        const errorMessage = `User with ID ${userId} does not have a company.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Extract the company associated with the user (assuming there is only one)
      const company = userCompany.userCompanies[0]?.company;

      return {
        userData: userCompany,
        company: company,
      };
    } catch (error) {
      // Log and throw errors as needed
      Logger.error('Error in getCompanyDetailsByUserId service:', error);
      throw error;
    }
  }
}
