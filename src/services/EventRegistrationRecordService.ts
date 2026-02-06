import { BaseService } from './BaseService';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Logger } from '../utils/logger';
import { EventRegistrationRecord } from '../models/EventRegistrationRecord';
import { Participant } from '../models/Participant';
import {
  CreateEventRegistrationRecordDTO,
  UpdateEventRegistrationRecordDTO,
  UpdateRegistrationRecordParticipantDTO,
} from '../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';
import { EventRegistrationRecordFilterDTO } from '../dtos/eventRegistrationRecord/EventRegistrationRecordDTO';
import { Utils } from '../utils/Utils';
import { UserCompany } from '../models/UserCompany';
export class EventRegistrationRecordService {
  private eventRegistrationRecordBaseService: BaseService<EventRegistrationRecord>;
  private participantBaseService: BaseService<Participant>;
  private userCompanyBaseService: BaseService<UserCompany>;

  constructor() {
    this.eventRegistrationRecordBaseService = new BaseService(
      EventRegistrationRecord as unknown as {
        new (): EventRegistrationRecord;
      } & typeof EventRegistrationRecord
    );
    this.participantBaseService = new BaseService(
      Participant as unknown as {
        new (): Participant;
      } & typeof Participant
    );
    this.userCompanyBaseService = new BaseService(
      UserCompany as unknown as {
        new (): UserCompany;
      } & typeof UserCompany
    );
  }

  /**
   * Creates a new event registration record for a participant.
   * Validates the user's participation in the event and creates a registration record.
   * @param registrationRecordData - The data needed to create the registration record.
   * @param userId - The ID of the user creating the registration record.
   * @returns The newly created EventRegistrationRecord.
   */
  async createEventRegistrationRecord(
    registrationRecordData: CreateEventRegistrationRecordDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<EventRegistrationRecord[]> {
    // Initialize an array to hold the created records
    const createdRecords: EventRegistrationRecord[] = [];
    try {
      // Check if the participant is registered for the event.
      const participant = await this.participantBaseService.findOne({
        where: {
          userId,
          eventId: registrationRecordData.eventId,
        },
        transaction,
      });
      // Loop through each registration record data item in the input
      for (const recordData of registrationRecordData.data) {
        const req = {
          eventRegistrationFormId: recordData.eventRegistrationFormId,
          response: recordData.response,
          eventId: registrationRecordData.eventId,
          participantId: participant?.dataValues.id,
          userId: userId,
          createdBy: userId,
          modifiedBy: 0,
        };
        const newRecord = await this.eventRegistrationRecordBaseService.create(
          req,
          transaction
        );
        // Add the new record to the array of created records
        createdRecords.push(newRecord);
      }
      return createdRecords;
    } catch (error) {
      Logger.error('Error creating event registration record:', error);
      throw error;
    }
  }

  /**
   * Updates an event registration record with the specified data.
   * @param id - The unique identifier of the event registration record to be updated.
   * @param updateData - The data to update the event registration record with.
   * @returns A promise that resolves with a tuple, where the first element is the count
   * of updated rows and the second element is an optional array of the updated
   * records if available.
   */
  async updateEventRegistrationRecord(
    id: number,
    updateData: UpdateEventRegistrationRecordDTO
  ): Promise<[number, EventRegistrationRecord[] | undefined]> {
    try {
      return this.eventRegistrationRecordBaseService.update(id, updateData);
    } catch (error) {
      Logger.error('Error updateEventRegistrationRecord:', error);
      throw error;
    }
  }

  async getRecordOrThrow(id: number): Promise<EventRegistrationRecord> {
    const record = await this.eventRegistrationRecordBaseService.findById(id);
    if (!record) {
      throw new Error('Event registration record not found');
    }
    return record;
  }

  /**
   * Retrieves all event registration records with optional filters, pagination, and sorting.
   * @param filters - An object containing filter criteria,
   * such as event ID, event registration form ID, participant ID, and response text.
   * @param limit - The maximum number of records to return (for pagination).
   * @param offset - The number of records to skip (for pagination).
   * @param sortBy - The field by which to sort the results.
   * @param sortDirection - The direction of sorting, either 'ASC' or 'DESC'.
   * @returns - A promise that resolves with an object containing the total count of matching records and an array of retrieved records.
   */
  async getAllRecords(
    filters: EventRegistrationRecordFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: EventRegistrationRecord[]; count: number }> {
    try {
      const where: WhereOptions<EventRegistrationRecord> = {};
      if (Utils.isNotUndefined(filters?.eventId)) {
        where.eventId = filters.eventId;
      }

      if (Utils.isNotUndefined(filters?.eventRegistrationFormId)) {
        where.eventRegistrationFormId = filters.eventRegistrationFormId;
      }

      if (Utils.isNotUndefined(filters?.participantId)) {
        where.participantId = filters.participantId;
      }

      if (filters?.response) {
        where.response = { [Op.like]: `%${filters.response}%` };
      }
      const { count, rows } =
        await this.eventRegistrationRecordBaseService.findAndCountAll({
          where,
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });

      return { rows, count };
    } catch (error) {
      Logger.error('Error getAllRecoords', error);
      throw error;
    }
  }

  /**
   * Service used to update the participant id in event registration record
   * @param userId the  id which getting from the token.
   * @param id the id which getting from the params which is the id of event registration record
   * @param updateData data to be updated
   * @returns return the promise
   */
  async updateRegistrationRecordParticipant(
    userId: number,
    id: number,
    updateData: UpdateRegistrationRecordParticipantDTO
  ): Promise<[number, EventRegistrationRecord[] | unknown]> {
    try {
      const eventId = updateData.eventId;
      const companyId = await this.userCompanyBaseService.findOne({
        where: { userId },
        attributes: ['companyId'],
      });
      if (!companyId) {
        const dataPresent =
          await this.eventRegistrationRecordBaseService.findOne({
            where: { id, userId, eventId },
          });
        if (dataPresent) {
          return this.eventRegistrationRecordBaseService.update(id, updateData);
        }
      }
      throw new Error('Could not find a matching registration record.');
    } catch (error) {
      Logger.error(
        'Error in updation of participant id in eventRegistrationRecord'
      );
      throw error;
    }
  }

  /**
   * Service used to update the participant id in event registration record
   * @param userId the  id which getting from the token.
   * @param id the id which getting from the params which is the id of event registration record
   * @param updateData data to be updated
   * @returns return the promise
   */
  async updateRegistrationRecordParticipantByUser(
    userId: number,
    participantId: number,
    updateData: UpdateRegistrationRecordParticipantDTO,
    transaction?: Transaction
  ): Promise<[number, EventRegistrationRecord[] | unknown]> {
    try {
      const eventId = updateData.eventId;
      const companyId = await this.userCompanyBaseService.findOne({
        where: { userId },
        attributes: ['companyId'],
        transaction,
      });
      if (!companyId) {
        // Fetch all records matching userId and eventId
        const recordsToUpdate =
          await this.eventRegistrationRecordBaseService.findAll({
            where: { userId, eventId },
            transaction,
          });
        if (recordsToUpdate.length > 0) {
          const recordUpdateData = { participantId };
          // Update all matching records
          const results = await Promise.all(
            recordsToUpdate.map((record) =>
              this.eventRegistrationRecordBaseService.update(
                record.id,
                recordUpdateData,
                undefined,
                transaction
              )
            )
          );

          // Return the update results
          return [results.length, results];
        }
      }
      return [0, []];
    } catch (error) {
      Logger.error(
        'Error in updation of participant id in eventRegistrationRecord'
      );
      throw error;
    }
  }
}
