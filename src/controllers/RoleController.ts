/**
 * @class RoleController
 * @description Controller class for handling HTTP requests related to role operations.
 * @author Neethu
 */

import { NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  extractRoleData
} from '../handlers/role/roleRequestHandler';
import {
  createRoleSchema,
} from '../validators/roleValidator';
import {
  createRoleResponse,
} from '../dtos/role/AddRoleDTO';
import { UserService } from '../services/UserService';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { RoleService } from '../services/RoleService';
import { Role } from '../models/Role';

/**
 * Controller for handling role actions
 */
export class RoleController {
  private roleService = new RoleService();
  private userService = new UserService();

  /**
   * Handles the request to add roles.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async addRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const companyId = await this.userService.getCompanyId(userId);
      const data = extractRoleData(req, createRoleSchema);

      if (!companyId) {
        throw new Error('Company information could not be verified');
      }

      const role: Role = await this.roleService.addRole(
        data,
        Number(userId)
      );
      const response = createRoleResponse(role);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error adding role:', err);
      handleError(next, err);
    }
  }

  /**
   * Handles the request to list roles
   * @param req - Express request object.
   * @param res  - Express response object.
   * @param next - Express next middleware function.
   */
  async getRoleList(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      let baseFilter;

      // Merge any additional filters from the request
      const finalFilters = {  ...filters };

      //giving limit 25
      const limit = 25;

      // Fetch filtered roles from the service
      const { rows: userData, count: total } =
        await this.roleService.getRoleList(
          finalFilters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create paginated response
      const response = createPaginatedResponse(userData, total, limit, offset);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in retrieving role list', err);
      handleError(next, err);
    }
  }
}
