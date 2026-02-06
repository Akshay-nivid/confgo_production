import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Role } from '../models/Role';
import { AddRoleDTO, RoleFilterDTO } from '../dtos/role/AddRoleDTO';
import { Op, Transaction, WhereOptions } from 'sequelize';

export class RoleService {
  private roleBaseService: BaseService<Role>;

  constructor() {
    this.roleBaseService = new BaseService(
      Role as unknown as {
        new(): Role;
      } & typeof Role
    );
  }

  /**
   * Gets role detail by name.
   * @param roleName
   * @returns A promise that resolves to role detail by name.
   */
  async getRoleByName(
    roleName: string,
    transaction?: Transaction
  ): Promise<Role | null> {
    try {
      return this.roleBaseService.findOne(
        {
          where: { roleName: roleName },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getRoleByName:', error);
      throw error;
    }
  }
  /**
   * Gets role detail by id.
   * @param roleName
   * @returns A promise that resolves to role detail by name.
   */
  async getRoleById(
    id: number,
    transaction?: Transaction
  ): Promise<Role | null> {
    try {
      return this.roleBaseService.findOne(
        {
          where: { id: id },
        },
        transaction
      );
    } catch (error) {
      Logger.error('Error getRoleById:', error);
      throw error;
    }
  }

  /**
  * Add Role.
  * @param AddRoleDTO
  * @returns A promise that resolves to role detail by name.
  */
  async addRole(
    roleData: AddRoleDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<Role> {
    try {
      // Fetch the volunroleteer data to ensure it exists
      const resp = await this.roleBaseService.findOne(
        {
          where: {
            roleName: roleData.roleName
          },
        },
        transaction
      );

      const errorMessage = `Role Already Created`;
      // If role not found, throw an error
      if (resp) {
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const req = {
        roleName: roleData.roleName,
        description: roleData.description,
        createdOn: new Date(),
        createdBy: userId,
        modifiedBy: 0,
      };

      const role = await this.roleBaseService.create(
        req,
        transaction
      );
      return role;
    } catch (error) {
      Logger.error('Error creating role:', error);
      throw error; // Re-throwing the error for higher-level handling
    }
  }
  /**
   * Retrieves a list of Roles based on the provided filters, pagination, and sorting options.
   * @param filters - Filters for querying roles (e.g., userId, statusId)
   * @param limit - Maximum number of results to return (pagination limit)
   * @param offset - Number of results to skip before returning (pagination offset)
   * @param sortBy - Field to sort by
   * @param sortDirection - Direction to sort
   * @returns An object containing the rows of roles and the total count of matching records
   */
  async getRoleList(
    filters: RoleFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Role[]; count: number }> {
    try {
      const roleCondition: WhereOptions = {};

      if (filters?.roleName) {
        roleCondition.roleName = filters.roleName;
      }

      const { count, rows } = await this.roleBaseService.findAndCountAll({
        where: roleCondition,
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




}


