/**
 * @class EventImagesService
 * @description Service class for handling EventImages operations .
 * @author nihal
 */

import { Op, Transaction } from 'sequelize';
import { UploadEventImagesDTO } from '../dtos/eventImages/EventImagesDTO';
import { Event } from '../models/Event';
import { EventImages } from '../models/EventImages';
import { Logger } from '../utils/logger';
import { BaseService } from './BaseService';
import { Asset } from '../models/Asset';

export class EventImagesService {
  private eventImagesBaseService: BaseService<EventImages>;
  private eventBaseService: BaseService<Event>;

  constructor() {
    this.eventImagesBaseService = new BaseService(
      EventImages as unknown as { new (): EventImages } & typeof EventImages
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
  }

  /**
   * Uploads event images by associating asset IDs with the specified event.
   * @param uploadingData - Data required for uploading event images.
   * @param userId - user id of the login user
   */
  async uploadEventImages(uploadingData: UploadEventImagesDTO, userId: number) {
    try {
      // Check if the event exists
      const event = await this.eventBaseService.findById(uploadingData.eventId);
      if (!event) {
        const errorMessage = `Event ID ${uploadingData.eventId} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Prepare data for bulk creation
      const eventImagesData = uploadingData.assetIds.map((assetId) => ({
        eventId: uploadingData.eventId,
        assetId,
        createdBy: userId,
        modifiedBy: 0,
      }));

      // Bulk create event image records
      return await this.eventImagesBaseService.bulkCreate(eventImagesData);
    } catch (err) {
      Logger.error('Error in uploadEventImages:', err);
      throw err; // Rethrow the error for external handling
    }
  }

  /**
   * Retrieves all images associated with a given event.
   *
   * @param eventId - The ID of the event for which images are to be retrieved.
   * @param transaction - The database transaction instance to ensure atomicity.
   * @returns A promise that resolves to an array of EventImages.
   * @throws An error if the event is not found or if an unexpected issue occurs.
   */
  async getAllEventImages(
    eventId: number,
    transaction?: Transaction
  ): Promise<EventImages[]> {
    try {
      // Define event search criteria: ensure it exists and has no parentId (top-level event)
      const eventCondition = {
        id: eventId,
        parentId: { [Op.is]: null },
      };

      // Fetch the event details based on the given event ID
      const event = await this.eventBaseService.findOne(
        { where: eventCondition },
        transaction
      );

      // If the event does not exist, log and throw an error
      if (!event) {
        const errorMessage = `Event not found. Invalid Event ID: ${eventId}`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Retrieve all images linked to the event
      const exclude = [
        'createdOn',
        'createdBy',
        'modifiedOn',
        'modifiedBy',
        'assetId',
      ];
      const eventImages = await this.eventImagesBaseService.findAll(
        {
          where: { eventId: event.dataValues.id },
          attributes: { exclude },
          include: [
            {
              model: Asset,
              as: 'asset',
              attributes: ['id', 'name'],
            },
          ],
        },
        transaction
      );

      return eventImages;
    } catch (err) {
      // Log the error and rethrow it for higher-level handling
      Logger.error('Error in getAllEventImages:', err);
      throw err;
    }
  }
}
