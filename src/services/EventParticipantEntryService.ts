/**
 * @class EventParticipantEntryService
 * @description Service class for handling Event Participant entry operations .
 * @author nihal
 */

import { BaseService } from './BaseService';
import { EventParticipantEntry } from '../models/EventParticipantEntry';
import { Event } from '../models/Event';
import { Transaction } from 'sequelize';
import { Logger } from '../utils/logger';
import {
  AddEventParticipantDTO,
  UpdateEntryDTO,
} from '../dtos/event/EventParticipantEntryDTO';
import { ParticipantType } from '../models/ParticipantType';

export class EventParticipantEntryService {
  private eventParticipantEntryBaseService: BaseService<EventParticipantEntry>;
  private eventBaseService: BaseService<Event>;
  private participantTypeBaseService: BaseService<ParticipantType>;

  constructor() {
    this.eventParticipantEntryBaseService = new BaseService(
      EventParticipantEntry as unknown as {
        new (): EventParticipantEntry;
      } & typeof EventParticipantEntry
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
    this.participantTypeBaseService = new BaseService(
      ParticipantType as unknown as {
        new (): ParticipantType;
      } & typeof ParticipantType
    );
  }

  /**
   * Add an event Participant entry.
   * @param eventParticipanData - The data needed to add an event PArticipant entry.
   * @returns The newly added EventParticipantEntry.
   */
  async addEventParticipant(
    eventParticipantData: AddEventParticipantDTO,
    userId: number
  ): Promise<EventParticipantEntry> {
    return this.eventParticipantEntryBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          //Checking the given parent event id and child event id is matching or exist.
          const event = await this.eventBaseService.findOne({
            where: {
              id: eventParticipantData.eventId,
              parentId: eventParticipantData.parentEventId,
            },
          });
          if (!event) {
            const errorMessage = `Event with Id ${eventParticipantData.eventId} or Parent Event ID ${eventParticipantData.parentEventId} does'nt Exist`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          if (eventParticipantData.participantTypeId) {
            //Checking the given participant type is exist or not.
            const participantType =
              await this.participantTypeBaseService.findById(
                eventParticipantData.participantTypeId
              );
            if (!participantType) {
              const errorMessage = `Participant Type with Id ${eventParticipantData.participantTypeId} doesn't exist`;
              Logger.error(errorMessage);
              throw new Error(errorMessage);
            }
          }

          const req = {
            eventId: eventParticipantData.eventId,
            totalSeat: eventParticipantData.totalSeat,
            seatAllocated: eventParticipantData.seatAllocated,
            participantTypeId: eventParticipantData.participantTypeId,
            parentEventId: eventParticipantData.parentEventId,
            createdBy: userId,
            modifiedBy: userId,
            createdOn: new Date(),
            modifiedOn: new Date(),
          };

          const newEventParticipantEntry =
            await this.eventParticipantEntryBaseService.create(
              req,
              transaction
            );
          Logger.info(
            'EventProgram created successfully:',
            newEventParticipantEntry
          );
          return newEventParticipantEntry;
        } catch (error) {
          Logger.error('Error adding eventParticipant:', error);
          throw error;
        }
      }
    );
  }

  /**
   * Updates an existing participant entry in the database.
   * @param id - The ID of the participant entry to update.
   * @param updateData - The data to update.
   * @returns A promise that resolves to a tuple containing the number of affected rows and an array of the updated coupon records (if { returning: true } is set).
   */
  async updateEventParticipant(
    id: number,
    reqData: UpdateEntryDTO,
    userId: number
  ): Promise<[number, EventParticipantEntry[] | undefined]> {
    try {
      //Checking the given id is exist or not
      const entry = await this.eventParticipantEntryBaseService.findById(id);
      if (!entry) {
        const errorMessage = `Participant Entry with ID ${id} does not exist to Update.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      const updateData = {
        totalSeat: reqData?.totalSeat,
        seatAllocated: reqData?.seatAllocated,
        modifiedBy: userId,
        modifiedOn: new Date(),
      };
      return this.eventParticipantEntryBaseService.update(id, updateData);
    } catch (error) {
      Logger.error('Error updateEventParticipant:', error);
      throw error;
    }
  }

  /**
   * Retrieves a participant entry by ID. If the coupon is not found, throws an error.
   * @param id - The ID of the participant entry to retrieve.
   * @returns The entry record if found.
   * @throws Error if the participant entry is not found.
   */
  async getParticipantEntryOrThrow(id: number): Promise<EventParticipantEntry> {
    const entry = await this.eventParticipantEntryBaseService.findById(id);
    if (!entry) {
      throw new Error('Participant Entry not found');
    }
    return entry;
  }

  /**
   * List event participant entry with pagination.
   * @param limit - Number of results to return.
   * @param offset - Offset for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction of sorting (ASC or DESC).
   * @returns A promise that resolves to a paginated list of event participant entry.
   */
  async getEventParticipantEntryList(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: EventParticipantEntry[]; count: number }> {
    try {
      // Fetch event participant entry with pagination and sorting
      const { count, rows } =
        await this.eventParticipantEntryBaseService.findAndCountAll({
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]], // Sorting based on provided parameters
        });

      return { rows, count };
    } catch (error) {
      Logger.error('Error fetching event participant entry:', error);
      throw error;
    }
  }
}
