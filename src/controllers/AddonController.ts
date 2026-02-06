import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/error_util';
import { Logger } from '../utils/logger';
import { extractListRequestData } from '../utils/request_util';
import { createPaginatedResponse } from '../utils/response_util';
import { extractAddonData } from '../handlers/addon/addonRequestHandler';
import { createAddonSchema } from '../validators/addonValidator';
import { createAddonResponse } from '../dtos/addon/AddonDTO';
import { JwtPayload } from 'jsonwebtoken';
import { Op } from 'sequelize';
import { UserService } from '../services/UserService';
import { AddonService } from '../services/AddonService';
export class AddOnController {
  private userService = new UserService();
  private addonService = new AddonService();

  /**
   * Handles the request to list addon
   * @param req - Express request object.
   * @param res  - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllAddon(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      let baseFilter;

      // Check if user is authenticated (token is present)
      const userId = (req.user as JwtPayload)?.id;

      if (userId) {
        // Fetch companyId associated with the user
        const companyId = await this.userService.getCompanyId(userId);

        if (companyId) {
          // If companyId is found, filter by companyId or 'admin'
          baseFilter = {
            [Op.and]: [
              {
                [Op.or]: [
                  { companyId: companyId }, // Match the companyId
                  { companyId: null }, // Include records where companyId is null
                ],
              },
              { owner: 'admin' },
            ],
          };
        } else {
          // If no companyId, filter only by 'admin' as owner
          baseFilter = { owner: 'admin' };
        }
      } else {
        // If no userId (no token), filter by 'admin' as owner
        baseFilter = { owner: 'admin' };
      }

      // Merge any additional filters from the request
      const finalFilters = { ...baseFilter, ...filters };

      //giving limit 25
      const limit = 25;

      // Fetch filtered addons from the service
      const { rows: userData, count: total } =
        await this.addonService.getAllAddOn(
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
      Logger.error('Error in retrieving addon', err);
      handleError(next, err);
    }
  }

  /**
   * This function handles the creation of an addon.
   * @param req - containing the data needed to create the addon.
   * @param res - used to send back the created addon.
   * @param next - The next middleware function in the chain, for error handling.
   */
  async createAddon(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractAddonData(req, createAddonSchema);
      const userId = (req.user as JwtPayload)?.id;
      const addon = await this.addonService.createAddon(data, userId);

      const response = createAddonResponse(addon);
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in creation od Addon', err);
      handleError(next, err);
    }
  }
}
