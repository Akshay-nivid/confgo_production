import { handleError } from '../utils/error_util';
import { Request, Response, NextFunction } from 'express';
import { extractListRequestData } from '../utils/request_util';
import { Template } from '../models/init-models';
import { createPaginatedResponse } from '../utils/response_util';
import { TemplateService } from '../services/TemplateService';
import { extractTemplateLisFiltertData } from '../handlers/template/templateRequestHandler';
import { Logger } from '../utils/logger';
import {
  TemplateDetailResponseDTO,
  templateDetailsResponse,
} from '../dtos/template/TemplateDTO';
/**
 * @author saneeshiv
 * @class TemplateController
 * @description
 */

export class TemplateController {
  private templateService = new TemplateService();

  /**
   * Handles the request to list all template.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async getAllTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);
      const extractedFilter = extractTemplateLisFiltertData(req);

      // Fetch templates with applied filters, pagination, limit, and sorting
      const { rows: tempaltes, count: total } =
        await this.templateService.getAllTemplates(
          extractedFilter,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Optionally filter the response fields
      const filteredTempaltes = tempaltes.map((template: Template) =>
        this.filterTemplateFields(template)
      );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(
        filteredTempaltes,
        total,
        limit,
        offset
      );

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in getAllTemplates:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the tempalte fields based on the requested fields.
   * @param tempalte - The tempalte object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered tempalte object.
   */
  private filterTemplateFields(template: Template) {
    return template;
  }

  /**
   * Controller method to fetch template details by ID.
   *
   * - Extracts the `templateId` from the request parameters.
   * - Uses the template service to retrieve the template details, including asset.
   * - Sends the response with the template details if successful.
   * - In case of an error, logs the error and forwards it to the error handler.
   *
   * @param {Request} req - Express request object containing template ID in params.
   * @param {Response} res - Express response object for sending template details.
   * @param {NextFunction} next - Express next function to pass errors to the error handler.
   */
  async getTemplateById(req: Request, res: Response, next: NextFunction) {
    try {
      const templateId = req.params?.id;

      const templateResp = await this.templateService.getTemplateById(
        Number(templateId)
      );

      if (!templateResp) {
        throw new Error('Template not found');
      }
      const combinedresult: TemplateDetailResponseDTO = {
        id: templateResp?.id ?? 0,
        name: templateResp?.name ?? '',
        description: templateResp?.description ?? '',
        isDefault: templateResp?.isDefault,
        enabled: templateResp?.enabled,
        assetId: templateResp?.assetId,
        asset: templateResp?.asset ?? undefined,
      };
      const response = templateDetailsResponse(combinedresult);
      res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in getTemplateById:', err);
      handleError(next, err);
    }
  }

  /**
   * Retrieves all template colors and sends the response.
   * If an error occurs, it passes to the next middleware.
   *
   * @param req - The request object containing query, body, etc.
   * @param res - The response object to send the data back to the client.
   * @param next - The next middleware to handle errors.
   */
  async getAllTemplateColors(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract list-related parameters from the request body
      const { limit, offset, sortBy, sortDirection } =
        extractListRequestData(req);

      // Fetch colors with applied pagination, limit, and sorting
      const { rows: colors, count: total } =
        await this.templateService.getAllTemplateColors(
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Create the paginated response using the utility function
      const response = createPaginatedResponse(colors, total, limit, offset);

      // Send the paginated response
      res.status(200).json(response);
    } catch (error) {
      Logger.error('Error in getAllTemplateColors:', error);
      handleError(next, error);
    }
  }
}
