/**
 * @class UserAbstractService
 * @description Service class for handling User Abstract file operations.
 * @author nihal
 */

import { Transaction } from 'sequelize';
import { UserAbstract } from '../models/UserAbstract';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Event } from '../models/Event';
import {
  AbstractFilterDTO,
  UpdateUserAbstractDTO,
} from '../dtos/userAbstract/userAbstractDTO';
import { Asset } from '../models/Asset';
import { User } from '../models/User';
import { UserAbstractStatus } from '../models/UserAbstractStatus';
import { enumAbstractStatus } from '../utils/enum';
/**
 * @class UserAbstractService
 * @description Service class for handling CRUD operations related to the UserAbstract model.
 */
export class UserAbstractService {
  private userAbstractBaseService: BaseService<UserAbstract>;
  private eventBaseService: BaseService<Event>;
  private userAbstractStatusBaseService: BaseService<UserAbstractStatus>;

  constructor() {
    this.userAbstractBaseService = new BaseService(
      UserAbstract as unknown as { new (): UserAbstract } & typeof UserAbstract
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
    this.userAbstractStatusBaseService = new BaseService(
      UserAbstractStatus as unknown as { new (): UserAbstractStatus } & typeof UserAbstractStatus
    );
  }

  /**
   * @function addUserAbstract
   * @description Creates a new UserAbstract entry linking a user to an event's abstract asset.
   * @param eventId - The ID of the event to which the abstract belongs.
   * @param abstractAsset - The abstract asset to be linked with the user.
   * @param userId - The ID of the user associated with the abstract.
   * @param transaction - An optional transaction object for transaction management (if provided).
   * @returns {Promise<UserAbstract>} - The created UserAbstract object.
   * @throws {Error} - Throws an error if the event is not found or if there is a problem during creation.
   */
  async addUserAbstract(
    eventId: number,
    assetId: string,
    userId: number,
    transaction?: Transaction
  ): Promise<UserAbstract> {
    try {
      // Fetch the event by its ID
      const event = await this.eventBaseService.findById(eventId);

      // If the event does not exist, throw an error
      if (!event) {
        const errorMessage = `Event with ID ${eventId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Create the UserAbstract object with the provided data
      const abstractReq = {
        userId: userId,
        eventId: eventId,
        assetId: assetId, // Linking the abstract asset id to the event
        createdBy: userId, // Set the user who created the abstract
        modifiedBy: 0, // Initially set modifiedBy to 0 (can be updated later)
        statusId: enumAbstractStatus.SUBMITTED,
      };

      // Create the UserAbstract entry in the database
      const abstractDetails = await this.userAbstractBaseService.create(
        abstractReq,
        transaction
      );

      // Return the created UserAbstract object
      return abstractDetails;
    } catch (error) {
      Logger.error('Error creating user abstract:', error);
      throw error; // Re-throw the error to handle it further up the chain
    }
  }

  /**
   * Updates a user abstract record with the provided data.
   * @param {number} id - The ID of the user abstract record to update.
   * @param {UpdateUserAbstractDTO} updateData - An object containing the fields to update and their new values.
   * @param {Transaction} transaction - Optional Sequelize transaction.
   * @returns {Promise<[number, UserAbstract[] | undefined]>}
   */
  async updateUserAbstract(
    id: number,
    updateData: UpdateUserAbstractDTO,
    transaction?: Transaction
  ): Promise<[number, UserAbstract[] | undefined]> {
    try {

      const abstract = await this.userAbstractBaseService.findById(id);
      if (!abstract) {
        const errorMessage = `Abstract with Id ${id} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Checking the reviewer already took an action before un assign the reviewer
      if (
        updateData.reviewerId === null &&
        abstract.dataValues.isReviewed === 1
      ) {
        const errorMessage = `Cannot unassign reviewer; already reviewed.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      let isReviewed = 0;
      //set isReviewed true if status is approved or rejected
      if (
        updateData.statusId === enumAbstractStatus.APPROVED ||
        updateData.statusId === enumAbstractStatus.REJECTED
      ) {
        isReviewed = 1;
      }
      if(updateData.reviewerId === null) {
        updateData.statusId = enumAbstractStatus.SUBMITTED
      }
      const updatingData = {
        ...updateData,
        isReviewed: isReviewed,
      };
      return this.userAbstractBaseService.update(
        id,
        updatingData,
        undefined,
        transaction
      );
    } catch (error) {
      Logger.error('Error updateUserAbstract:', error);
      throw error;
    }
  }
  /**
   * Retrieves a user abstract record by its ID.
   * @param {number} id - The ID of the user abstract record to retrieve.
   * @returns {Promise<UserAbstract | null>} - A promise resolving to the user abstract record if found, or `null`.
   * @throws {Error} - If an error occurs during the  operation,logs the error and throws it.
   */
  async getUserAbstractById(id: number): Promise<UserAbstract | null> {
    try {
      const exclude = ['createdBy', 'modifiedBy', 'modifiedOn'];
      const abstractFile = await this.userAbstractBaseService.findById(id, {
        include: [
          {
            model: Asset,
            as: 'asset',
            attributes: { exclude },
          },
          {
            model: User,
            as: 'user',
            attributes: { exclude },
          },
          {
            required: false,
            model: UserAbstractStatus,
            as: 'status',
          },
        ],
        attributes: { exclude },
      });

      if (!abstractFile) {
        const errorMessage = `Abstract File with Id ${id} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      return abstractFile;
    } catch (error) {
      Logger.error('Error getCouponById:', error);
      throw error;
    }
  }

  /**
   * Retrieves a user abstract record by its ID or throws an error if not found.
   * @param {number} id - The ID of the user abstract record to retrieve.
   * @returns {Promise<UserAbstract>} - A promise resolving to the user abstract record if found.
   * @throws {Error} - If no record is found, an error is thrown.
   */
  async getAbstractOrThrow(id: number): Promise<UserAbstract> {
    const abstract = await this.userAbstractBaseService.findById(id);
    if (!abstract) {
      throw new Error('Abstract not found');
    }
    return abstract;
  }

  /**
   * Fetches a paginated and filtered list of user abstracts along with the total count of matching records.
   * @param {AbstractFilterDTO} filters - An object containing filter criteria for querying abstracts.
   * @param {number} limit.
   * @param {number} offset.
   * @param {string} sortBy.
   * @param {string} sortDirection.
   * @returns A list of user abstract and the total count of user abstract matching the criteria.
   */
  async userAbstractList(
    filters: AbstractFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: UserAbstract[]; count: number }> {
    try {
      const { count, rows } =
        await this.userAbstractBaseService.findAndCountAll({
          where: { ...filters },
          include: [
            {
              model: Asset,
              as: 'asset',
              required: true,
              attributes: { exclude: ['companyId', 'userId', 'sourcePath'] },
            },
            {
              model: Event,
              as: 'event',
              attributes: ['name', 'eventClass','startTime'],
            },
            {
              model: User,
              as: 'reviewer',
            },
            {
              model: User,
              as: 'user',
            },
          ],
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });

      return { rows, count };
    } catch (error) {
      Logger.error('Error userAbstractList', error);
      throw error;
    }
  }

  /**
   * Assigns a reviewer to a list of abstracts and updates their status.
   * @param {number[]} abstracts - Array of abstract IDs to update.
   * @param {number} reviewerId - The ID of the reviewer to assign.
   * @param {Transaction} transaction - The database transaction to ensure atomicity.
   * @returns {Promise<UserAbstract[]>} - Returns an array of updated abstract records.
   */
  async assignReviewerToAbstracts(
    abstracts: number[],
    reviewerId: number,
    userId: number,
    transaction: Transaction
  ): Promise<UserAbstract[]> {
    try {
      const updatedRows = [];
      for (const id of abstracts) {
        // Update the abstract with the reviewerId and statusId
        await this.userAbstractBaseService.update(
          id,
          {
            reviewerId,
            statusId: enumAbstractStatus.ASSIGNED,
            modifiedBy: userId,
          },
          undefined,
          transaction
        );
        // Retrieve the updated abstract row
        const updatedRow = await this.userAbstractBaseService.findById(
          id,
          undefined,
          transaction
        );
        if (updatedRow) {
          updatedRows.push(updatedRow);
        }
      }
      return updatedRows;
    } catch (error) {
      Logger.error('Error assigning reviewer to abstracts:', error);
      throw new Error('Failed to assign reviewer to abstracts.');
    }
  }

    /**
     * List Abstract statuses with pagination.
     * @param limit - Number of results to return.
     * @param offset - Offset for pagination.
     * @param sortBy - Field to sort by.
     * @param sortDirection - Direction of sorting (ASC or DESC).
     * @returns A promise that resolves to a paginated list of Abstract statuses.
     */
    async getAbstractStatusList(
      limit: number,
      offset: number,
      sortBy: string,
      sortDirection: string
    ): Promise<{ rows: UserAbstractStatus[]; count: number }> {
      try {
        // Fetch Abstract statuses with pagination and sorting
        const { count, rows } = await this.userAbstractStatusBaseService.findAndCountAll(
          {
            limit,
            offset,
            order: [[sortBy, sortDirection.toUpperCase()]], // Sorting based on provided parameters
          }
        );
  
        return { rows, count };
      } catch (error) {
        Logger.error('Error fetching Abstract statuses:', error);
        throw error;
      }
    }
}
