/**
 * @class SponsorService
 * @description Service class for handling Sponsor operations .
 * @author nihal
 */

import { Transaction, WhereOptions } from 'sequelize';
import { CreateSponsorDTO, sponsorAssignDTO, SponsorFilterDTO, UpdateSponsorDTO } from '../dtos/sponsor/SponsorDTO';
import { Sponsor } from '../models/Sponsor';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Op } from 'sequelize';
import { enumSponsorStatus } from '../utils/enum';
import { SpeakerBio } from '../models/SpeakerBio';
import { EventSponsor } from '../models/EventSponsor';
import { EventAddon } from '../models/EventAddon';

export class SponsorService {
  private sponsorBaseService: BaseService<Sponsor>;
  private eventSponsorBaseService: BaseService<EventSponsor>;
  constructor() {
    // Cast the Sponsor model explicitly to match the expected constructor signature
    this.sponsorBaseService = new BaseService(
      Sponsor as unknown as { new (): Sponsor } & typeof Sponsor
    );
     // Cast the EventSponsor model explicitly to match the expected constructor signature
     this.eventSponsorBaseService = new BaseService(
      EventSponsor as unknown as { new (): EventSponsor } & typeof EventSponsor
    );
  }

  /**
   * Creates multiple sponsors based on the provided sponsor data.
   * @param sponsorData - Array of sponsor data to create or update.
   * @param userId - ID of the user creating the sponsor(s).
   * @param transaction - Sequelize transaction for atomic operations.
   * @returns An array of created/updated sponsors.
   * @throws Error if there is an issue during creation.
   */
  async createSponsor(
    sponsorData: CreateSponsorDTO,
    userId: number,
    transaction: Transaction
  ): Promise<Sponsor> {
    try {
      const existingSponsor = await this.sponsorBaseService.findOne({
        where: {
          [Op.and]: [
            { statusId: enumSponsorStatus.ACTIVE },
            {
              [Op.or]: [
                { email: sponsorData.email },
                { phone: sponsorData.phone },
              ],
            },
          ],
        },
      });

      if (existingSponsor) {
        const errorMessage = `Can't Create Sponsor: Provided Email or Phone is already registered.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Prepare the sponsor request payload
      const sponsorPayload = {
        name: sponsorData.name,
        website: sponsorData.website,
        phone: sponsorData.phone,
        email: sponsorData.email,
        companyId: userId,
        logoAssetId: sponsorData.logoAssetId,
        bannerImgAssetId: sponsorData.bannerImgAssetId,
        statusId: 1,
        createdBy: userId,
        modifiedBy: 0,
      };

      // Create or upsert the sponsor record
      const createdSponsor = await this.sponsorBaseService.create(
        sponsorPayload,
        transaction
      );

      return createdSponsor;
    } catch (err) {
      Logger.error('Error creating sponsor:', err);
      throw err;
    }
  }

   /**
   * Assign multiple sponsors based on the provided sponsor data.
   * @param sponsorData - Array of sponsor data to create or update.
   * @param userId - ID of the user creating the sponsor(s).
   * @param transaction - Sequelize transaction for atomic operations.
   * @returns An array of created/updated sponsors.
   * @throws Error if there is an issue during creation.
   */
   async assignSponsor(
    sponsorData: sponsorAssignDTO,
    userId: number,
    transaction: Transaction
  ): Promise<EventSponsor[]> {
    try {
      const sponsorReq = sponsorData.sponsors.map((data) => ({
        eventId: data.eventId,
        createdBy: userId,
        parentEventId: data.parentEventId,
        sponsorId: data.sponsorId,
        sponsorTypeId: data.sponsorTypeId,
        eventAddonId: data.eventAddonId,
        reservedSeats: data.reservedSeats,
        eventAddonPropertyId: data?.eventAddonPropertyId,
        modifiedBy: userId,
      }));
  
      // Check for existing sponsors in a single query
      const existingSponsors = await this.eventSponsorBaseService.findAll({
        where: {
          [Op.or]: sponsorReq.filter((data) => data.eventId !== undefined || data.eventAddonId!==undefined)
          .map((data) => (
            {
            eventId: data?.eventId,
            sponsorId: data?.sponsorId,
            eventAddonId: data?.eventAddonId,
            statusId: 1, // Only check for active sponsors
          })),
        },
        transaction,
      });
  
      // Create a Set of existing sponsor keys
      const existingKeys = new Set(
        existingSponsors.map(
          (sponsor) => `${sponsor.parentEventId}-${sponsor.sponsorId}`
        )
      );
  
      // Filter out sponsors already assigned
      const newSponsorReq = sponsorReq.filter(
        (data) => !existingKeys.has(`${data.parentEventId}-${data.sponsorId}`)
      );
  
      if (newSponsorReq.length === 0) {
        Logger.info('All provided sponsors are already assigned to events.');
        throw new Error('Duplicate sponsors detected. No new sponsors assigned.');
      }
  
      // Bulk create the new sponsor records
      const createdSponsors = await this.eventSponsorBaseService.bulkCreate(
        newSponsorReq,
        transaction
      );
  
      return createdSponsors;
    } catch (err) {
      Logger.error('Error assigning sponsor:', err);
      throw err;
    }
  }

  
  
  /**
   * Updates an existing sponsor.
   * @param sponsorId - The ID of the sponsor to update.
   * @param sponsorData - The data to update the sponsor with.
   * @param userId - The ID of the user making the update.
   * @param transaction - The transaction to be used for the update.
   * @returns The updated sponsor object.
   * @throws Error if the sponsor is not found or if an error occurs during the update.
   */
  async updateSponsor(
    sponsorId: number,
    sponsorData: UpdateSponsorDTO,
    userId: number,
    transaction: Transaction
  ) {
    try {
      // Check if the sponsor exists
      const sponsor = await this.sponsorBaseService.findById(sponsorId);
      if (!sponsor) {
        const errorMessage = `Sponsor with ID ${sponsorId} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Prepare the update request
      const updateReq = {
        name: sponsorData.name,
        website: sponsorData.website,
        email: sponsorData.email,
        phone: sponsorData.phone,
        companyId: sponsorData.companyId,
        logoAssetId: sponsorData.logoAssetId,
        bannerImgAssetId: sponsorData.bannerImgAssetId,
        modifiedBy: userId,
        modifiedOn: new Date
      };

      // Perform the update
      return await this.sponsorBaseService.update(
        sponsorId,
        updateReq,
        undefined,
        transaction
      );
    } catch (error) {
      Logger.error('Error updating sponsor:', error);
      throw error; // Rethrow the error for further handling
    }
  }

  /**
   * Retrieves a sponsor by ID or throws an error if not found.
   * @param id - The ID of the sponsor to retrieve.
   * @param transaction - The Sequelize transaction object for database operations.
   * @returns The sponsor object if found.
   * @throws {Error} If no sponsor is found with the given ID.
   */
  async getSponsorOrThrow(
    id: number,
    transaction: Transaction
  ): Promise<Sponsor> {
    const sponsor = await this.sponsorBaseService.findById(
      id,
      undefined,
      transaction
    );
    if (!sponsor) {
      throw new Error('Sponsor not found');
    }
    return sponsor;
  }

  /**
   * Fetches all sponsor with optional filters, pagination, sorting, and limit.
   * @param filters - Object containing filters to apply to the query.
   * @param limit - Number of sponsor to return.
   * @param offset - Number of sponsor to skip for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns A list of sponsor and the total count of sponsor matching the criteria.
   */
  async getAllSponsors(
    filters: SponsorFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: Sponsor[]; count: number }> {
    try {
      const sponsorCondition: WhereOptions = {};
      sponsorCondition.statusId = enumSponsorStatus.ACTIVE;

      if (filters.name) {
        sponsorCondition.name = { [Op.like]: `%${filters.name}%` };
      }
      // if (filters.eventId) {
      //   where.eventId = filters.eventId;
      // }
      if (userId) {
        sponsorCondition.companyId = userId;
      }
      // Exclude other details from fetching data
      const exclude = ['modifiedOn', 'modifiedBy', 'createdBy', 'createdOn'];
      const rows = await this.sponsorBaseService.findAll({
        where: sponsorCondition,
        include: [
          {
            model: EventSponsor,
            as: 'eventSponsors',
            required: !!(filters.eventId || filters.parentEventId),
            where: {
              ...(filters.eventId && { eventId: filters.eventId }),
              ...(filters.parentEventId && {
                parentEventId: filters.parentEventId,
              }),
            },
            attributes: { exclude },
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      //fetching count of all sponsors
      const count = await this.sponsorBaseService.count({
        where: sponsorCondition
      });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllSponsors', error);
      throw error;
    }
  }

  /**
   * Deactivates a sponsor by updating its status to INACTIVE.
   *
   * @param id - The ID of the sponsor to be deactivated
   * @param transaction - Optional Sequelize transaction
   * @throws An error if the sponsor is not found or the operation fails
   */
  async deleteSponsor(id: number, transaction?: Transaction) {
    try {
      // Fetch the sponsor by ID
      const sponsor = await this.sponsorBaseService.findById(
        id,
        undefined,
        transaction
      );

      // If sponsor does not exist, log the error and throw an exception
      if (!sponsor) {
        const errorMessage = `Sponsor with ID ${id} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Update the sponsor status to INACTIVE
      return await this.sponsorBaseService.update(
        id,
        { statusId: enumSponsorStatus.INACTIVE },
        undefined,
        transaction
      );
    } catch (err) {
      Logger.error('Error in deleteSponsor:', err);
      throw err; // Re-throw the error for further handling
    }
  }

  /**
   * Removes a sponsor from an event by marking their status as inactive.
   *
   * @param id - The ID of the event sponsor to remove.
   * @param transaction - Optional transaction for atomic database operations.
   * @returns The result of the update operation.
   */
  async removeSponsorFromEvent(id: number, transaction?: Transaction) {
    try {
      // Check if the event sponsor exists
      const existingEventSponsor = await this.eventSponsorBaseService.findById(
        id,
        undefined,
        transaction
      );

      if (!existingEventSponsor) {
        const errorMessage = `Event Sponsor with ID ${id} was not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Update the sponsor's status to inactive
      return await this.eventSponsorBaseService.update(
        id,
        { statusId: enumSponsorStatus.INACTIVE },
        undefined,
        transaction
      );
    } catch (err) {
      Logger.error('Error in removing sponsor from event:', err);
      throw err;
    }
  }
}
