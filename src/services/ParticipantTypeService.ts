/**
 * @class ParticipantTypeService
 * @description Service class for handling Participant type operations.
 * @author nihal
 */

import { ParticipantType } from '../models/ParticipantType';
import { Event } from '../models/Event';
import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import {
  CreateParticipantTypeDTO,
  ParticipantTypeFilterDTO,
  UpdateParticipantTypeDTO,
} from '../dtos/participant/ParticipantTypeDTO';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Utils } from '../utils/Utils';
import { Participant } from '../models/Participant';
import { EventPriceTier } from '../models/EventPriceTier';

export class ParticipantTypeService {
  private participantTypeBaseService: BaseService<ParticipantType>;
  private eventBaseService: BaseService<Event>;
  private participantBaseService: BaseService<Participant>;
  private eventPriceTierBaseService: BaseService<EventPriceTier>;

  constructor() {
    this.participantTypeBaseService = new BaseService(
      ParticipantType as unknown as {
        new (): ParticipantType;
      } & typeof ParticipantType
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
    this.participantBaseService = new BaseService(
      Participant as unknown as {
        new (): Participant;
      } & typeof Participant
    );
    this.eventPriceTierBaseService = new BaseService(
      EventPriceTier as unknown as {
        new (): EventPriceTier;
      } & typeof EventPriceTier
    );
  }

  /**
   * Retrieves all participant types based on the provided filters, pagination, and sorting criteria.
   * @param filters - The filters used to narrow down the participant type .
   * @param limit - The maximum number of participant type to return.
   * @param offset - The starting index for pagination.
   * @param sortBy - The column by which to sort the results.
   * @param sortDirection - The direction of sorting
   * @returns - A promise that resolves to an object containing:
   *    - `rows`: An array of `EventProgramSchedule` objects that match the filters and pagination criteria.
   *    - `count`: The total number of event programs that match the filters.
   */
  async participantTypeList(
    filters: ParticipantTypeFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: ParticipantType[]; count: number }> {
    try {
      const whereCondtiton: WhereOptions = {};

      if (filters?.name) {
        whereCondtiton.name = { [Op.like]: `%${filters.name}%` };
      }
      if (Utils.isNotUndefined(filters?.eventId)) {
        whereCondtiton.eventId = filters.eventId;
      }
      if (Utils.isNotUndefined(filters?.isContributor)) {
        whereCondtiton.isContributor = filters.isContributor;
      }
      if(filters?.exceptName){
        whereCondtiton.name = { [Op.ne]: filters.exceptName }
      }

      //fetching data and count with or without filters
      const { count, rows } =
        await this.participantTypeBaseService.findAndCountAll({
          where: { ...whereCondtiton },
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });
      return { rows, count };
    } catch (error) {
      Logger.error('Error participantTypeList', error);
      throw error;
    }
  }

  /**
   * Creates participant Type.
   * @param participantTypeData - The data to create the participant Type.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Participant Type.
   */
  async createParticipantType(
    participantTypeData: CreateParticipantTypeDTO,
    userId: number
  ): Promise<ParticipantType> {
    return this.participantTypeBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          // Check if the event exists
          const eventData = await this.eventBaseService.findById(
            participantTypeData.eventId
          );

          // Handle case where event does not exist
          if (!eventData) {
            const errorMessage = `Event ID ${participantTypeData.eventId} does not exist.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          const request = {
            name: participantTypeData.name,
            eventId: participantTypeData.eventId,
            description: participantTypeData.description,
            isContributor: participantTypeData.isContributor,
            createdBy: userId, // Adjust as necessary
            modifiedBy: userId, // Adjust as necessary
          };

          // Create Participant Type
          const newParticipantType =
            await this.participantTypeBaseService.create(request, transaction);

          Logger.info(
            'Participant Type created successfully:',
            newParticipantType
          );
          return newParticipantType;
        } catch (error) {
          Logger.error('Error creating participant type:', error);
          throw new Error(`${error}`); // Use custom error handling if needed
        }
      }
    );
  }

  /**
   * Service used to delete the data from participant type
   * @param id
   * @returns
   */
  async deleteParticipantType(
    id: number,
    transaction: Transaction
  ): Promise<number | undefined> {
    try {
      const participantTypeUsedParticipant =
        await this.participantBaseService.findAll({
          where: { participantTypeId: id },
          transaction,
        });

      const participantTypeUsedEventPriceTier =
        await this.eventPriceTierBaseService.findAll({
          where: { participantTypeId: id },
          transaction,
        });

      if (participantTypeUsedParticipant.length > 0) {
        const errorMessage = 'Participant Type is already in use.';
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      //if participant type is not used in participant and in eventprice tier having participant type then delete the event price tier data
      if (
        participantTypeUsedParticipant.length === 0 &&
        participantTypeUsedEventPriceTier.length > 0
      ) {
        await this.eventPriceTierBaseService.deleteCustom({
            participantTypeId: id,
          },
          undefined,
          transaction
        );
      }

      return await this.participantTypeBaseService.delete(
        id,
        undefined,
        transaction
      );
    } catch (error) {
      Logger.error('Error in Delete Participant Type:', error);
      throw error;
    }
  }
  /**
   * To update the participant type
   * @param id - The unique identifier of the participant type to update.
   * @param updateData - An object containing the fields and new values to update for the participant type.
   * @param transaction - Optional Sequelize transaction to allow for the update to be part of a larger transactional process.
   * @returns A Promise that resolves.
   */
  async updateParticipantType(
    id: number,
    updateData: UpdateParticipantTypeDTO,
    transaction?: Transaction
  ): Promise<[number, ParticipantType[] | undefined]> {
    return this.participantTypeBaseService.update(
      id,
      updateData,
      undefined,
      transaction
    );
  }
  /**
   * If the participant type is not found, throws an error.
   */
  async getUserOrThrow(id: number): Promise<ParticipantType> {
    const data = await this.participantTypeBaseService.findById(id);
    if (!data) {
      throw new Error('Participant type not found'); // You can customize the error message or use a custom error class
    }
    return data;
  }
}
