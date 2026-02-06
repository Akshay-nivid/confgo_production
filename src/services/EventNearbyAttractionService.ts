/**
 * @author saneeshiv
 * @class EventNearbyAttractionService
 * @description Service class for handling CRUD operations related to the EventNearbyAttraction model.
 */

import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  Asset,
  Company,
  Event,
  EventNearbyAttraction,
  UserCompany,
  Venue,
} from '../models/init-models';
import { Op, Transaction } from 'sequelize';
import {
  CreateEventNearbyAttractionDTO,
  EventAttractionFilterDTO,
  UpdateEventNearbyAttractionDTO,
} from '../dtos/event/EventNearbyAttractionDTO';
import { Utils } from '../utils/Utils';

export class EventNearbyAttractionService {
  private eventNearbyAttractionBaseService: BaseService<EventNearbyAttraction>;
  private eventBaseService: BaseService<Event>;
  private venuBaseService: BaseService<Venue>;
  private companyBaseService: BaseService<Company>;

  constructor() {
    this.eventNearbyAttractionBaseService = new BaseService(
      EventNearbyAttraction as unknown as {
        new (): EventNearbyAttraction;
      } & typeof EventNearbyAttraction
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
    this.venuBaseService = new BaseService(
      Venue as unknown as {
        new (): Venue;
      } & typeof Venue
    );
    this.companyBaseService = new BaseService(
      Company as unknown as {
        new (): Company;
      } & typeof Company
    );
  }

  /**
   * Creates a new record for a nearby attraction associated with an event.
   *
   * This function validates the existence of the specified event and venue
   * (if provided) before creating a record for a nearby attraction. The
   * attraction details, including name, distance, category, opening hour,
   * description, and associated asset, are stored along with user and venue
   * references.
   *
   * @param {CreateEventNearbyAttractionDTO} nearbyAttractionData - The data required to create a nearby attraction record.
   * @param {number} userId - The ID of the user creating this record.
   * @param {Transaction} [transaction] - Optional transaction object to execute this operation in a transactional context.
   *
   * @returns {Promise<EventNearbyAttraction>} - The newly created nearby attraction record.
   *
   * @throws {Error} If the event or venue (if provided) does not exist.
   */
  async createEventNearbyAttraction(
    nearbyAttractionData: CreateEventNearbyAttractionDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<EventNearbyAttraction[]> {
    try {
      const companyResp = await this.companyBaseService.findOne(
        {
          include: {
            model: UserCompany,
            as: 'userCompanies',
            where: {
              userId: userId,
            },
          },
        },
        transaction
      );
      if (!companyResp) {
        throw new Error('Company not found');
      }
      // Verify if the event exists
      const event = await this.eventBaseService.findOne(
        {
          where: {
            id: nearbyAttractionData.eventId,
            companyId: companyResp.dataValues.id,
          },
        },
        transaction
      );
      if (!event) {
        const errorMessage = `Event ID ${nearbyAttractionData.eventId} doesn't exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const attractionsToCreate: EventNearbyAttraction[] = [];

      for (const nearbyAttraction of nearbyAttractionData.nearbyAttractions) {
        // If a venue ID is provided, verify if the venue exists
        if (nearbyAttraction.venueId) {
          const venue = await this.venuBaseService.findById(
            nearbyAttraction.venueId,
            undefined,
            transaction
          );
          if (!venue) {
            const errorMessage = `Venu ID ${nearbyAttraction.venueId} doesn't exist.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
        }

        // Prepare the attraction data for creation
        const attraction = {
          name: nearbyAttraction.name,
          distance: nearbyAttraction.distance,
          category: nearbyAttraction.category,
          openingHour: nearbyAttraction.openingHour,
          description: nearbyAttraction.description,
          eventId: nearbyAttractionData.eventId,
          venueId: nearbyAttraction.venueId,
          assetId: nearbyAttraction.assetId,
          createdBy: userId,
          modifiedBy: 0,
        } as EventNearbyAttraction;

        attractionsToCreate.push(attraction);
      }

      const newRecord = await this.eventNearbyAttractionBaseService.bulkCreate(
        attractionsToCreate,
        transaction
      );

      return newRecord;
    } catch (error) {
      Logger.error('Error in createEventNearbyAttraction', error);
      throw error;
    }
  }

  /**
   * Retrieves a list of nearby attractions for a specific event.
   *
   * This function checks if the event exists and then fetches all nearby attractions associated with the event ID.
   * It supports optional transactions for database operations.
   *
   * @param {number} eventId - The ID of the event for which to retrieve nearby attractions.
   * @param {Transaction} [transaction] - An optional transaction object to handle multiple database operations within a single transaction.
   * @returns {Promise<EventNearbyAttraction[]>} - A promise that resolves to an array of EventNearbyAttraction objects associated with the provided event ID.
   * @throws {Error} - Throws an error if the event does not exist or if an error occurs during the database query.
   */
  async listAllEventNearbyAttraction(
    filters: EventAttractionFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    transaction?: Transaction
  ): Promise<{ rows: EventNearbyAttraction[]; count: number }> {
    try {
      const filterCondition: any = {};

      if (filters?.name) {
        filterCondition.name = { [Op.like]: `%${filters.name}%` };
      }
      if (filters?.description) {
        filterCondition.description = { [Op.like]: `%${filters.description}%` };
      }
      if (filters?.openingHour) {
        filterCondition.openingHour = { [Op.like]: `%${filters.openingHour}%` };
      }
      if (filters?.distance) {
        filterCondition.distance = { [Op.like]: `%${filters.distance}%` };
      }
      if (filters?.category) {
        filterCondition.category = { [Op.like]: `%${filters.category}%` };
      }
      if (Utils.isNotUndefined(filters?.id)) {
        filterCondition.id = filters.id;
      }
      if (Utils.isNotUndefined(filters?.eventId)) {
        filterCondition.eventId = filters.eventId;
      }
      if (Utils.isNotUndefined(filters?.venueId)) {
        filterCondition.venueId = filters.venueId;
      }
      // Fetch all nearby attractions
      const nearbyAttractions =
        await this.eventNearbyAttractionBaseService.findAll(
          {
            where: filterCondition,
            include: [
              {
                model: Venue,
                as: 'venue',
              },
              {
                model: Asset,
                as: 'asset',
              },
            ],
            limit,
            offset,
            order: [[sortBy, sortDirection.toUpperCase()]],
          },
          transaction
        );

      return { rows: nearbyAttractions, count: nearbyAttractions.length };
    } catch (error) {
      Logger.error('Error in listAllEventNearbyAttraction', error);
      throw error;
    }
  }

  /**
   * Updates an existing nearby attraction based on the provided ID and data.
   *
   * @param {number} eventNearbyAttractionId - The ID of the nearby attraction to update.
   * @param {UpdateEventNearbyAttractionDTO} nearbyAttractionData - Data to update the nearby attraction with.
   * @param {number} userId - The ID of the user performing the update, used to track modifications.
   * @param {Transaction} [transaction] - Optional transaction object to ensure atomic updates.
   * @returns {Promise<EventNearbyAttraction>} - The updated nearby attraction instance.
   * @throws {Error} - Throws an error if the nearby attraction or venue does not exist.
   */
  async updateEventNearbyAttraction(
    eventNearbyAttractionId: number,
    nearbyAttractionData: UpdateEventNearbyAttractionDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<EventNearbyAttraction> {
    try {
      // Check if the nearby attraction exists by its ID
      const existingAttraction =
        await this.eventNearbyAttractionBaseService.findOne(
          {
            where: {
              id: eventNearbyAttractionId,
            },
          },
          transaction
        );

      if (!existingAttraction) {
        const errorMessage = `Nearby attraction with ID ${eventNearbyAttractionId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Validate if venue ID exists if provided
      if (nearbyAttractionData.venueId) {
        const venue = await this.venuBaseService.findById(
          nearbyAttractionData.venueId,
          undefined,
          transaction
        );
        if (!venue) {
          const errorMessage = `Venue ID ${nearbyAttractionData.venueId} doesn't exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Update the attraction with provided data
      const updatedAttraction = await existingAttraction.update(
        {
          name: nearbyAttractionData.name,
          distance: nearbyAttractionData.distance,
          category: nearbyAttractionData.category,
          openingHour: nearbyAttractionData.openingHour,
          description: nearbyAttractionData.description,
          venueId: nearbyAttractionData.venueId,
          assetId: nearbyAttractionData.assetId,
          modifiedBy: userId,
        },
        { transaction }
      );

      return updatedAttraction;
    } catch (error) {
      Logger.error('Error in updateEventNearbyAttraction', error);
      throw error;
    }
  }

  /**
   * Retrieves a nearby attraction by its unique ID.
   *
   * @param eventNearbyAttractionId - The unique ID of the nearby attraction to retrieve
   * @param transaction - Optional transaction object for database operations
   * @returns The nearby attraction record if found, otherwise throws an error
   * @throws Error if the nearby attraction is not found or if an error occurs during retrieval
   */
  async getEventNearbyAttractionById(
    eventNearbyAttractionId: number,
    transaction?: Transaction
  ): Promise<EventNearbyAttraction | null> {
    try {
      const nearbyAttraction =
        await this.eventNearbyAttractionBaseService.findOne({
          where: { id: eventNearbyAttractionId },
          transaction,
        });

      // Check if the nearby attraction exists
      if (!nearbyAttraction) {
        const errorMessage = `Nearby attraction with ID ${eventNearbyAttractionId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Return the nearby attraction record
      return nearbyAttraction;
    } catch (error) {
      Logger.error('Error in getEventNearbyAttractionById', error);
      throw error;
    }
  }
}
