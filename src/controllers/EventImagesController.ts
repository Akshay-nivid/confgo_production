/**
 * @class EventImagesController
 * @description Controller class for handling HTTP requests related to Event Images operations.
 * @author nihal
 */

import { Request, Response, NextFunction, response } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { JwtPayload } from 'jsonwebtoken';
import { EventImagesService } from '../services/EventImagesService';
import {
  extractAllEventImages,
  extractUploadImagesData,
} from '../handlers/eventImages/eventImagesRequestHansler';
import {
  getAllEventImagesSchema,
  uploadImagesSchema,
} from '../validators/eventImagesValidator';
import {
  createAllEventImageResponse,
  createEventImageResponse,
} from '../dtos/eventImages/EventImagesDTO';

export class EventImagesController {
  private eventImagesService = new EventImagesService();

  /**
   * Handles the upload of event images.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function for error handling.
   */
  async uploadEventImages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;

      const data = extractUploadImagesData(req, uploadImagesSchema);

      // Call the service to handle image uploads
      const uploads = await this.eventImagesService.uploadEventImages(
        data,
        userId
      );

      const response = createEventImageResponse(uploads);
      return res.status(201).json(response);
    } catch (err) {
      Logger.error('Error in uploadEventImages:', err);
      handleError(next, err);
    }
  }

  /**
   * Controller to fetch all images associated with a specific event.
   *
   * @param req - Express request object containing event ID in the request body.
   * @param res - Express response object to send the response.
   * @param next - Express next function for error handling.
   */
  async getAllEventImages(req: Request, res: Response, next: NextFunction) {
    try {
      const data = extractAllEventImages(req, getAllEventImagesSchema);
      const eventImages = await this.eventImagesService.getAllEventImages(
        data.eventId
      );

      const response = createAllEventImageResponse(eventImages);
      return res.status(200).json(response);
    } catch (err) {
      Logger.error('Error in getAllEventImages:', err);
      handleError(next, err);
    }
  }
}
