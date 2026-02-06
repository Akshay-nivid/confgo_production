import { Utils } from './../utils/Utils';
/**
 * @class EventPriceTierService
 * @description Service class for handling Event Price tier operations.
 * @author nihal
 */

import { Op, QueryTypes, Transaction, WhereOptions } from 'sequelize';
import { EventPriceTier } from '../models/EventPriceTier';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  CreateEventPriceTierDTO,
  PriceTierFilterDTO,
  UpdatePriceTierDTO,
} from '../dtos/event/EventPriceTierDTO';
import { ParticipantType } from '../models/ParticipantType';
import { Event } from '../models/Event';

export class EventPriceTierService {
  private eventPriceTierBaseService: BaseService<EventPriceTier>;
  private participantTypeBaseService: BaseService<ParticipantType>;
  private eventBaseService: BaseService<Event>;

  constructor() {
    // Cast the Event Price Tier model explicitly to match the expected constructor signature
    this.eventPriceTierBaseService = new BaseService(
      EventPriceTier as unknown as {
        new (): EventPriceTier;
      } & typeof EventPriceTier
    );
    this.participantTypeBaseService = new BaseService(
      ParticipantType as unknown as {
        new (): ParticipantType;
      } & typeof ParticipantType
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
  }

  /**
   * Creates new price tiers for a given event within a transaction.
   *
   * Steps:
   * 1. Validates the event and deletes existing price tiers for the event.
   * 2. Validates participant types and creates new price tiers based on input.
   *
   * @param data - Data containing the event ID and price tiers to create.
   * @param userId - ID of the user performing the operation.
   * @param transaction - Sequelize transaction for atomic operations.
   * @returns A promise resolving to an array of created `EventPriceTier` instances.
   * @throws If the event or participant type is not found, or on any operation failure.
   */
  async removeAndcreatePriceTier(
    data: CreateEventPriceTierDTO,
    userId: number,
    transaction: Transaction
  ): Promise<EventPriceTier[]> {
    try {
      // Validate the existence of the event
      const event = await this.eventBaseService.findById(
        data.eventId,
        undefined,
        transaction
      );
      if (!event) {
        const errorMessage = `Event with ID ${data.eventId} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Delete existing price tiers for the event
      await this.deletePriceTireByEventId(data.eventId, transaction);

      const newPriceTiers: EventPriceTier[] = [];
      // Iterate over input price tiers to validate and create them
      for (const priceTier of data.priceTiers) {
        // Checking the given Event id is exist or not.
        const participantType = await this.participantTypeBaseService.findById(
          priceTier.participantTypeId,
          undefined,
          transaction
        );
        if (!participantType) {
          const errorMessage = `participant Type with ID ${priceTier.participantTypeId} not found.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        // Prepare the new price tier data
        const reqObj = {
          name: priceTier.name,
          description: priceTier.description,
          participantTypeId: participantType.dataValues.id,
          eventId: data.eventId,
          percentage: priceTier.percentage,
          startDate: priceTier.startDate,
          endDate: priceTier.endDate,
          createdBy: userId,
          modifiedBy: 0,
        };

        // Create the new price tier
        const newPriceTier = await this.eventPriceTierBaseService.create(
          reqObj,
          transaction
        );
        newPriceTiers.push(newPriceTier);
      }
      return newPriceTiers;
    } catch (error) {
      Logger.error('Error in removeAndCreatePriceTier', error);
      throw error;
    }
  }

  /**
   * Update a event price tier.
   * @param priceTierData - The data to update the event price tier.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the updated Event Price tier.
   */
  async updatePriceTier(
    priceTierData: UpdatePriceTierDTO,
    userId: number,
    priceTierId: number
  ): Promise<[number, EventPriceTier[] | undefined]> {
    return this.eventPriceTierBaseService.executeTransaction(async () => {
      try {
        //checking the event price tier is exist or not.
        const priceTierCheck =
          await this.eventPriceTierBaseService.findById(priceTierId);
        if (!priceTierCheck) {
          const errorMessage = `Invalid Price Tier Id: ${priceTierId}`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
        const priceTierReq = {
          name: priceTierData.name,
          description: priceTierData.description,
          startDate: priceTierData.startDate,
          endDate: priceTierData.endDate,
          percentage: priceTierData.percentage,
          modifiedBy: userId,
        };
        //updating the event
        const priceTier = await this.eventPriceTierBaseService.update(
          priceTierId,
          priceTierReq
        );
        return priceTier;
      } catch (error) {
        Logger.error('Error in update Event Price Tier Details:', error);
        throw error;
      }
    });
  }

  /**
   * Deletes all price tiers associated with a specific event ID.
   *
   * This method executes a raw SQL query to delete rows from the `event_price_tier` table
   * based on the given `eventId`. It also supports an optional transaction parameter
   * for ensuring atomicity when used within a larger transactional operation.
   *
   * @param eventId - The ID of the event whose price tiers are to be deleted.
   * @param transaction - (Optional) A Sequelize transaction object to ensure
   *                      the operation is executed within a transaction context.
   * @returns A promise that resolves to the result of the deletion query, or undefined if no rows were affected.
   * @throws An error if the deletion process encounters any issues.
   */
  async deletePriceTireByEventId(
    eventId: number,
    transaction?: Transaction
  ): Promise<EventPriceTier[] | undefined> {
    try {
      const sql = 'DELETE FROM event_price_tier WHERE event_id = :eventId';
      const replacements = { eventId };
      return await this.eventPriceTierBaseService.executeCustomQuery(
        sql,
        replacements,
        QueryTypes.DELETE,
        transaction
      );
    } catch (error) {
      Logger.error('Error in deletePriceTireByEventId', error);
      throw error;
    }
  }

  /**
   * Retrieves an event price tier by its ID. Throws an error if the event price tier is not found.
   * @param id - The unique identifier of the event price tier to retrieve.
   * @returns The event price tier object if found.
   * @throws Error if the event with the given ID does not exist.
   */
  async getPriceTierOrThrow(id: number): Promise<EventPriceTier> {
    const priceTier = await this.eventPriceTierBaseService.findById(id);
    if (!priceTier) {
      throw new Error('Event Price tier not found');
    }
    return priceTier;
  }

  /**
   * Retrieves a list of price tier based on the provided filters, pagination, and sorting options.
   * @param filters - Filters for querying add-ons (e.g., name, owner)
   * @param limit - Maximum number of results to return (pagination limit)
   * @param offset - Number of results to skip before returning (pagination offset)
   * @param sortBy - Field to sort by
   * @param sortDirection - Direction to sort
   * @returns An object containing the rows of price tiers and the total count of matching records
   */
  async priceTierList(
    filters: PriceTierFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: EventPriceTier[]; count: number }> {
    try {
      const whereCondition: WhereOptions = {};
      if (filters?.name) {
        whereCondition.name = { [Op.like]: `%${filters.name}%` };
      }

      if (Utils.isNotUndefined(filters?.eventId)) {
        whereCondition.eventId = { [Op.like]: `%${filters.eventId}%` };
      }

      if (filters?.participantTypeId) {
        filters.participantTypeId = filters.participantTypeId;
      }

      if (filters?.endDate) {
        whereCondition.endDate = { [Op.lte]: filters.endDate };
      }
      if (filters?.endDate) {
        whereCondition.endDate = { [Op.lte]: filters.endDate };
      }

      if (filters?.endDate && filters?.endDate) {
        whereCondition.endDate = {
          [Op.gte]: new Date(filters.endDate),
        };
        whereCondition.endDate = {
          [Op.lte]: new Date(filters.endDate),
        };
      } else if (filters?.endDate) {
        whereCondition.endDate = { [Op.gte]: new Date(filters.endDate) };
      } else if (filters?.endDate) {
        whereCondition.endDate = { [Op.lte]: new Date(filters.endDate) };
      }

      const { count, rows } =
        await this.eventPriceTierBaseService.findAndCountAll({
          where: { ...whereCondition },
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });

      return { rows, count };
    } catch (error) {
      Logger.error('Error fetching price tiers:', error);
      throw error;
    }
  }
}
