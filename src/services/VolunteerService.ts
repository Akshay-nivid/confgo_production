/**
 * @class VolunteerService
 * @description Service class for handling volunteer operations .
 * @author Maneesh
 */
import { Op, Transaction } from 'sequelize';
import { Logger } from '../utils/logger';
import { BaseService } from './BaseService';
import {
  AddVolunteerDTO,
  AddVolunteerEventDTO,
  VolunteerFilterDTO,
} from '../dtos/volunteer/AddVolunteerDTO';
import { Volunteer } from '../models/Volunteer';
import { enumVolunteerEventStatus, enumVolunteerStatus } from '../utils/enum';
import { VolunteerEvent } from '../models/VolunteerEvent';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { Venue } from '../models/Venue';

export class VolunteerService {
  private volunteerBaseService: BaseService<Volunteer>;
  private volunteerEventBaseService: BaseService<VolunteerEvent>;
  private eventBaseService: BaseService<Event>;

  constructor() {
    // Cast the Volunteer model explicitly to match the expected constructor signature
    this.volunteerBaseService = new BaseService(
      Volunteer as unknown as { new (): Volunteer } & typeof Volunteer
    );

    this.volunteerEventBaseService = new BaseService(
      VolunteerEvent as unknown as {
        new (): VolunteerEvent;
      } & typeof VolunteerEvent
    );

    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
  }

  /**
   * Add a volunteer.
   * @param attendeeData - The data to add the volunteer.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the added volunteer.
   */
  async addVolunteer(
    volunteerData: AddVolunteerDTO,
    companyId: number,
    userId: number,
    transaction?: Transaction
  ): Promise<Volunteer> {
    try {
      // Fetch the volunteer data to ensure it exists and is active
      const volunteerResp = await this.volunteerBaseService.findOne(
        {
          where: {
            companyId: companyId,
            userId: volunteerData.userId,
            statusId: enumVolunteerStatus.ACTIVE,
          },
        },
        transaction
      );

      const errorMessage = `Already added as a volunteer`;
      // If volunteer not found, throw an error
      if (volunteerResp) {
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const req = {
        companyId: companyId as number,
        userId: volunteerData.userId,
        statusId: enumVolunteerStatus.ACTIVE,
        createdOn: new Date(),
        createdBy: userId,
        modifiedBy: 0,
      };

      const volunteer = await this.volunteerBaseService.create(
        req,
        transaction
      );
      return volunteer;
    } catch (error) {
      Logger.error('Error creating volunteer:', error);
      throw error; // Re-throwing the error for higher-level handling
    }
  }

  /**
   * Retrieves a list of volunteers based on the provided filters, pagination, and sorting options.
   * @param filters - Filters for querying volunteers (e.g., userId, statusId)
   * @param limit - Maximum number of results to return (pagination limit)
   * @param offset - Number of results to skip before returning (pagination offset)
   * @param sortBy - Field to sort by
   * @param sortDirection - Direction to sort
   * @returns An object containing the rows of volunteers and the total count of matching records
   */
  async getVolunteerList(
    filters: VolunteerFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Volunteer[]; count: number }> {
    try {
      const queryFilters: any = { ...filters };

      if (filters?.userId) {
        queryFilters.userId = { [Op.eq]: filters.userId }; // Exact match for userId
      }

      if (filters?.statusId) {
        queryFilters.statusId = { [Op.eq]: filters.statusId }; // Exact match for statusId
      }

      const { count, rows } = await this.volunteerBaseService.findAndCountAll({
        where: { ...queryFilters },
        include: [
          {
            model: User,
            as: 'user',
            required: false,
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      return { rows, count };
    } catch (error) {
      Logger.error('Error to get all addon:', error);
      throw error;
    }
  }

  /**
   * Retrieves the list of events a volunteer is associated with.
   *
   * @param {number} userId - The ID of the user (volunteer) whose events are being retrieved.
   * @throws {Error} - Throws an error if fetching fails.
   */
  async getVolunteerEvents(userId: number, transaction?: Transaction) {
    try {
      const volunteerEvents = await this.volunteerEventBaseService.findAll({
        where: { userId , statusId: enumVolunteerEventStatus.ACTIVE },
        transaction,
      });

      if (!volunteerEvents.length) return [];

      // Extract eventIds and filter out undefined values
      const eventIds = volunteerEvents
        .map((event) => event.dataValues.eventId)
        .filter((id): id is number => id !== undefined); // Type guard to remove undefined values

      if (eventIds.length === 0) return [];

      const allEvents = await this.eventBaseService.findAll({
        where: { id: eventIds, published: true },
        include: [{
          model: Venue,
          as: 'venue',
          attributes: { exclude: ['createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'] }
        }],
        transaction,
      });

      return allEvents;
    } catch (error) {
      console.error('Error fetching volunteer events:', error);
      throw error;
    }
  }
}
