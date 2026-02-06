import { BaseService } from './BaseService';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Logger } from '../utils/logger';
import { EventSpeaker } from '../models/EventSpeaker';
import {
  CreateEventSpeakerDTO,
  CreateSpeakerBioDTO,
  EventProgramFilterDTO,
  SpeakerDetailFilterDTO,
  StatusFilterDTO,
  UpdateEventProgramDTO,
  UpdateSpeakerBioDTO,
} from '../dtos/event/EventProgramDTO';
import { enumEventProgramStatus, enumEventStatus} from '../utils/enum';
import { EventProgramScheduleStatus } from '../models/EventProgramScheduleStatus';
import { StatusValidationDTO } from '../dtos/event/EventProgramDTO';
import { Utils } from '../utils/Utils';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Asset } from '../models/Asset';
import { SpeakerBio } from '../models/SpeakerBio';
import { utf16Decode } from 'pdf-lib';

export class EventProgramService {
  private eventspeakerBaseService: BaseService<EventSpeaker>;
  private eventProgramStatusBaseService: BaseService<EventProgramScheduleStatus>;
  private eventSpeakerBioBaseService: BaseService<SpeakerBio>;
  private eventBaseService: BaseService<Event>;
  constructor() {
    this.eventspeakerBaseService = new BaseService(
      EventSpeaker as unknown as {
        new (): EventSpeaker;
      } & typeof EventSpeaker
    );
    this.eventProgramStatusBaseService = new BaseService(
      EventProgramScheduleStatus as unknown as {
        new (): EventProgramScheduleStatus;
      } & typeof EventProgramScheduleStatus
    );
    this.eventSpeakerBioBaseService = new BaseService(
      SpeakerBio as unknown as {
        new (): SpeakerBio;
      } & typeof SpeakerBio
    );
    this.eventBaseService = new BaseService(
      Event as unknown as {
        new (): Event;
      } & typeof Event
    );
  }

  /**
   * Creates an event program.
   * @param eventdata - The data needed to create an event program.
   * @returns The newly created EventProgramSchedule.
   */
  async createEventSpeaker(
    eventdata: CreateEventSpeakerDTO
  ): Promise<EventSpeaker> {
    return this.eventspeakerBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          const req = {
            userId: eventdata.userId,
            eventId: eventdata.eventId,
            parentEventId: eventdata.parentEventId,
            statusId: eventdata.statusId||1,
            createdBy: 0, // Assuming createdBy is set to 0 for now
          };
          //checking whether same speaker assigned to same event
          const existingEntry = await this.eventspeakerBaseService.findOne({
            where: {
              userId:  eventdata.userId,
              eventId: eventdata.eventId,
              statusId:1
            },
            transaction,
          });
          if(existingEntry)
          {
            throw new Error(`The Speaker is already assigned to event. `);
          }
          const newEventProgram = await this.eventspeakerBaseService.create(
            req,
            transaction
          );
          
          Logger.info('EventSpeaker created successfully:', newEventProgram);
          return newEventProgram;
        } catch (error) {
          Logger.error('Error creating EventSpeaker:', error);
          throw error;
        }
      }
    );
  }
  /**
   * Creates an event speaker session bio details.
   * @param eventdata - The data needed to create an event program.
   * @returns The newly created EventProgramSchedule.
   */
  async createEventSpeakerBio(
    eventdata: CreateSpeakerBioDTO,
    userId: number
  ): Promise<SpeakerBio> {
    return this.eventspeakerBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try { 
          //creating req structure for speaker bio
          const create_req = {
            eventSpeakerId: eventdata.eventSpeakerId,
            fileId: eventdata.speakerFileId || undefined,
            isModerator: eventdata.isModerator || 0,
            designation: eventdata.designation || undefined,
            description: eventdata.description || undefined,
            startTime: eventdata.startTime || undefined,
            endTime: eventdata.endTime || undefined,
            modifiedBy: userId,
            createdBy: userId,
          };
          let result;
  
          // Create a new entry
          result = await this.eventSpeakerBioBaseService.create(create_req, transaction);
          Logger.info('EventSpeaker details added successfully:', result);

          //fetch result of event speaker bio and return data
          let speaker_bio_results = await this.eventSpeakerBioBaseService.findOne(
            {where: {eventSpeakerId: eventdata.eventSpeakerId}} // Pass the eventSpeakerId as the ID
          );
          if (!speaker_bio_results) {
            throw new Error('Speaker bio not found after creation or update');
          }
          
          return speaker_bio_results;
        } catch (error) {
          Logger.error('Error saving EventSpeaker details:', error);
          throw error;
        }
      }
    );
  }
  
   /**
   * Update an event speaker session bio details.
   * @param eventdata - The data needed to create an event program.
   * @returns The newly created EventProgramSchedule.
   */
   async updateEventSpeakerBio(
    eventReq: UpdateSpeakerBioDTO,
    bioId:number,
    userId: number
  ):  Promise<[number, SpeakerBio[] | undefined]> {
    return this.eventspeakerBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          const existingSpeakerBio = await this.eventSpeakerBioBaseService.findById(
            bioId,
          );

          if (!existingSpeakerBio) {
            const errorMessage = `Speaker session details not found.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage); // Consider custom error handling
          }
    
          const req: UpdateSpeakerBioDTO = {
            eventSpeakerId: eventReq.eventSpeakerId,
            isModerator: eventReq.isModerator || 0,
            designation: eventReq.designation || undefined,
            description: eventReq.description || undefined,
            startTime: eventReq.startTime || undefined,
            endTime: eventReq.endTime || undefined,
            modifiedBy: userId,
          };
          
          let result;
          if (eventReq.fileId === null || eventReq.fileId === '') {
            // If fileId is null or empty, update file_id to NULL
            await this.eventSpeakerBioBaseService.updateToNull(existingSpeakerBio.dataValues.id, 'file_id', undefined, transaction);
            req.modifiedOn = new Date;
          } else {
            // Otherwise, set the fileId value
            req.fileId = eventReq.fileId || undefined;
            req.modifiedOn = new Date;
          }

          result = await this.eventSpeakerBioBaseService.update(bioId,req,undefined, transaction);


          // Update a session entry
          Logger.info('EventSpeaker details updated successfully:', result);

          return result;
        } catch (error) {
          Logger.error('Error saving EventSpeaker details:', error);
          throw error;
        }
      }
    );
  }
  /**
   * Retrieves all event programs based on the provided filters, pagination, and sorting criteria.
   * @param filters - The filters used to narrow down the event programs ( startTime, endTime, name, statusId, designation, topic, language, programType).
   * @param limit - The maximum number of event programs to return.
   * @param offset - The starting index for pagination.
   * @param sortBy - The column by which to sort the results.
   * @param sortDirection - The direction of sorting
   * @returns - A promise that resolves to an object containing:
   *    - `rows`: An array of `EventProgramSchedule` objects that match the filters and pagination criteria.
   *    - `count`: The total number of event programs that match the filters.
   */
  async getAllEventProgram(
    filters: EventProgramFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: EventSpeaker[]; count: number }> {
    try {
      const speakerCondition: WhereOptions = {};

      if (filters?.statusId !== undefined) {
        speakerCondition.statusId = filters.statusId;
      } else {
        speakerCondition.statusId = enumEventProgramStatus.ACTIVE;
      }
      if (Utils.isNotUndefined(filters?.eventId)) {
        speakerCondition.eventId = filters.eventId;
      }
      if (Utils.isNotUndefined(filters?.parentEventId)) {
        speakerCondition.parentEventId = filters.parentEventId;
      }
      if (Utils.isNotUndefined(filters?.userId)) {
        speakerCondition.userId = filters.userId;
      }
      if (Utils.isNotUndefined(filters?.id)) {
        speakerCondition.id = filters.id;
      }

      const { count, rows } =
        await this.eventspeakerBaseService.findAndCountAll({
          where: speakerCondition,
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
          include: [
            {
              model: User,
              as: 'user',
              required: true
            },
            {
              model: Event,
              as: 'event',
              required: true
            },
            {
              model: SpeakerBio,
              as: 'speakerBios',
              required: false
            }
          ],
        });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getAll Event Speakers', error);
      throw error;
    }
  }
  /**
   * Retrieves a paginated list of event speakers statuses based on the provided filters, pagination, and sorting options.
   * @param filters - Filters used to query the event program statuses
   * @param limit - The maximum number of records to return.
   * @param offset - The offset to start retrieving records from (pagination offset).
   * @param sortBy - The column to sort the results by.
   * @param sortDirection - The direction to sort the results in (either 'ASC' or 'DESC').
   *
   * @returns - Returns a promise that resolves to an object containing:
   *  - `rows`: An array of the event program schedule statuses.
   *  - `count`: The total number of matching records.
   */
  async getEventProgramStatusList(
    filters: StatusFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: EventProgramScheduleStatus[]; count: number }> {
    try {
      const { count, rows } =
        await this.eventProgramStatusBaseService.findAndCountAll({
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        });
      return { rows, count };
    } catch (error) {
      Logger.error('Error getEventProgramStatusList:', error);
      throw error;
    }
  }

  async getEventProgramStatusByName(
    data: StatusValidationDTO
  ): Promise<EventProgramScheduleStatus | null> {
    try {
      return await this.eventProgramStatusBaseService.findOne({
        where: { statusName: data.statusName },
      });
    } catch (error) {
      Logger.error('Error getTokenStatusByName:', error);
      throw error;
    }
  }

  /**
   *  Fetches an event program by its ID.
   * @param id - The unique identifier of the event program to be retrieved.
   * @returns -A Promise that resolves to the `EventProgramSchedule` object if found, or `null` if not found.
   */
  async getProgramById(id: number): Promise<EventSpeaker | null> {
    try {
      const program = await this.eventspeakerBaseService.findById(id);
      if (program && program.statusId === 1) {
        return program;
      } else {
        Logger.warn(
          `No data found or program is not active (statusId != 1) for id: ${id}`
        );
        return null; // Or throw an error if needed
      }
    } catch (error) {
      Logger.error('Error in getting program details by id', error);
      throw error;
    }
  }
  /**
   * Updates an event speaker in the database based on the provided ID and data.
   * @param id - The unique identifier of the event program to update.
   * @param updateData  - The new data to update the event program with.
   * @returns - A promise that resolves to an array.
   */
  async updateEventSpeaker(
    id: number,
    updateData: UpdateEventProgramDTO
  ): Promise<[number, EventSpeaker[] | undefined]> {
    try {
      const modifiedData = {
        ...updateData,
        modifiedOn: new Date(), // Set the current date and time
      };
      return this.eventspeakerBaseService.update(id, modifiedData);
    } catch (error) {
      Logger.error('Error update event speaker details:', error);
      throw error;
    }
  }
  /**
   * Retrieves a program by ID. If the program is not found, throws an error.
   * @param id - The ID of the program to retrieve.
   * @returns The program record if found.
   */
  async getProgramOrThrow(id: number): Promise<EventSpeaker> {
    const program = await this.eventspeakerBaseService.findById(id);
    if (!program) {
      throw new Error('Program not found');
    }
    return program;
  }

  /**
   * Deletes a speaker from the database.
   * @param id - The ID of the speaker to delete.
   * @returns A promise that resolves to the number of rows affected (1 if successful, 0 if no rows were deleted).
   */
  async deleteProgramSchedule(
    id: number
  ): Promise<[number, EventSpeaker[] | undefined]> {
    try {
      await this.getProgramOrThrow(id);
      const deleteData = { statusId: enumEventProgramStatus.INACTIVE };
      return this.eventspeakerBaseService.update(id, deleteData);
    } catch (error) {
      Logger.error('Error delete speaker:', error);
      throw error;
    }
  }


  /**
   * Fetches a list of events assigned to a speaker, with pagination and sorting options.
   *
   * @param limit - The maximum number of events to return (pagination).
   * @param offset - The number of events to skip (pagination).
   * @param sortBy - The column by which to sort the results.
   * @param sortDirection - The direction in which to sort (e.g., 'ASC' or 'DESC').
   * @param userId - The ID of the speaker (used to filter assigned events).
   * @returns An object containing the list of events (`rows`) and the total count of those events.
   */
  async speakerAssignedEventsList(
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: Event[]; count: number }> {
    try {
      // 1. Fetch all programs assigned to the speaker.
      const assignedPrograms = await this.eventspeakerBaseService.findAll({
        where: { userId },
      });

      // 2. Collect the parent event IDs based on the assigned programs
      const parentEventIds = assignedPrograms
        .map((program) => program.dataValues.parentEventId)
        .filter((parentId) => parentId !== null); // Remove any null values

      // 3. Fetch parent events based on the parent IDs
      const eventCondition = {
        id: { [Op.in]: parentEventIds }, // Ensure we're only fetching parent events
        parentId: { [Op.is]: null },
        published: true,
      };
      const parentEvents = await this.eventBaseService.findAll({
        where: eventCondition,
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]], // Sorting based on the given field and direction
      });

      // 4. Remove any duplicate events in case multiple programs share the same parent event
      const uniqueParentEvents = parentEvents.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.id === event.id) // Ensure unique parent events by ID
      );

      // 5. Return the list of unique parent events and the total count of parent events
      return {
        rows: uniqueParentEvents,
        count: uniqueParentEvents.length,
      };
    } catch (err) {
      // Log the error if something goes wrong.
      Logger.error('Error getSpeakerAssignedEvents:', err);
      throw err; // Rethrow the error to propagate it
    }
  }

  /**
   * Fetches a list of speaker details based on the provided filters, pagination, and sorting parameters.
   *
   * @param filters - The filter criteria (e.g., `parentEventId`) to apply to the speaker details query.
   * @param limit - The maximum number of records to fetch (for pagination).
   * @param offset - The number of records to skip (for pagination).
   * @param sortBy - The column to sort the results by.
   * @param sortDirection - The direction to sort the results, either 'ASC' (ascending) or 'DESC' (descending).
   *
   * @returns A response object containing the filtered and sorted speaker details, including pagination info.
   */
  async speakerDetailsList(
    filters: SpeakerDetailFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ) {
    try {
      // Initialize the condition object that will be used in the query to filter speakers.
      let speakerCondition: WhereOptions = {};

      // Apply a filter if `parentEventId` is provided in the filters.
      if (filters?.parentEventId) {
        speakerCondition.parentEventId = filters.parentEventId;
      }

      // Define which attributes to exclude from the User model to avoid unnecessary data.
      const exclude = ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy'];

      // Query the database to fetch the speaker details based on the provided filters, limit, and offset.
      const rows = await this.eventspeakerBaseService.findAll({
        where: speakerCondition,
        include: [{ model: User, as: 'user', attributes: { exclude } }],
        attributes: { exclude },
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      // Store the fetched rows in the `data` variable.
      const data = rows;

      // Filter out duplicate users based on `userId` to ensure unique users are returned.
      const uniqueUsers = data.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.userId === value.userId)
      );

      // Construct the response object containing the filtered list of unique users and the count of unique users.
      const response = {
        rows: uniqueUsers,
        count: uniqueUsers.length,
      };

      return response;
    } catch (err) {
      // Log the error if something goes wrong during the process.
      Logger.error('Error in speakerDetailsList:', err);
      throw err;
    }
  }
}
