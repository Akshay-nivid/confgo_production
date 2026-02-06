/**
 * @class DashBoardService
 * @description Service class for handling DashBoard operations .
 * @author nihal
 */

import { User } from '../models/User';
import { Event } from '../models/Event';
import { Logger } from '../utils/logger';
import { BaseService } from './BaseService';
import { UserCompany } from '../models/UserCompany';
import { Op, WhereOperators, WhereOptions } from 'sequelize';
import { Participant } from '../models/Participant';
import { enumRoll } from '../utils/enum';
import { CompanyRevenueCountDTO, dashboardCountRequestDTO } from '../dtos/dashBoard/DashBoardDTO';
import { Attendee } from '../models/Attendee';
import { Payment } from '../models/Payment';
import { UserAbstract } from '../models/UserAbstract';

export class DashBoardService {
  private userBaseService: BaseService<User>;
  private eventBaseService: BaseService<Event>;
  private userCompanyBaseService: BaseService<UserCompany>;
  private participantBaseService: BaseService<Participant>;
  private attendeeBaseService: BaseService<Attendee>;
  private paymentBaseService: BaseService<Payment>;
  private userAbstractBaseService: BaseService<UserAbstract>;
  constructor() {
    // Cast the Event model explicitly to match the expected constructor signature
    this.userBaseService = new BaseService(
      User as unknown as { new (): User } & typeof User
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
    this.userCompanyBaseService = new BaseService(
      UserCompany as unknown as { new (): UserCompany } & typeof UserCompany
    );
    this.participantBaseService = new BaseService(
      Participant as unknown as { new (): Participant } & typeof Participant
    );
    this.attendeeBaseService = new BaseService(
      Attendee as unknown as { new (): Attendee } & typeof Attendee
    );
    this.paymentBaseService = new BaseService(
      Payment as unknown as { new (): Payment } & typeof Payment
    );
    this.userAbstractBaseService = new BaseService(
      UserAbstract as unknown as { new (): UserAbstract } & typeof UserAbstract
    );
  }

  /**
   * Retrieves counts of event, users, new registration.
   * @returns A promise that resolves to the counts, or null if not found.
   */
  async eventAndUserCount(userId: number, userRole: string) {
    try {
      // Check if the user exists
      const user = await this.userBaseService.findById(userId);
      if (!user) {
        const errorMessage = `User with ID ${userId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      let totalEventCount;
      let totalUserCount;
      let newUserCount;
      let eventIds;
      let totalAmountPaid = 0.0;
      let attendedSessions = 0;

      if (userRole == enumRoll.COMPANYADMIN) {
        // Check if the user has an associated company
        const company = await this.userCompanyBaseService.findOne({
          where: { userId },
        });
        // Fetch all published events created by this company
        const eventCondition = {
          companyId: company?.dataValues.companyId,
          published: 1,
          parentId: { [Op.is]: null },
        };
        const { rows: events, count: eventCount } =
          await this.eventBaseService.findAndCountAll({
            where: eventCondition,
          });

        // Extract event IDs from the `events` array
        eventIds = events.map((event) => event.id);
        // Fetch all participants registered in those events
        const { count: participantCount } =
          await this.participantBaseService.findAndCountAll({
            where: {
              eventId: { [Op.in]: eventIds },
            },
          });

        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch participants registered within the last 30 days
        const { count: newParticipantCount } =
          await this.participantBaseService.findAndCountAll({
            where: {
              eventId: { [Op.in]: eventIds },
              createdOn: { [Op.gte]: thirtyDaysAgo },
            },
          });
        totalEventCount = eventCount;
        totalUserCount = participantCount;
        newUserCount = newParticipantCount;
      }

      /**--------------------------------------------------------------- */

      //if the user is not a company user then fetching user event data
      if (userRole == enumRoll.USER) {
        const { rows: participated } =
          await this.participantBaseService.findAndCountAll({
            where: { userId: userId },
          });

        // Fetch all published events participated by this user
        eventIds = participated.map((participant) => participant.eventId);
        const eventCondition = {
          id: { [Op.in]: eventIds },
          parentId: { [Op.is]: null },
        };
        const { count: eventCount } =
          await this.eventBaseService.findAndCountAll({
            where: eventCondition,
          });

          totalEventCount = eventCount;
          for (const participatedEvent of participated) {
            totalAmountPaid += Number(participatedEvent.dataValues.amountPaid);
            const sessionReq = {
              participantId: participatedEvent.dataValues.id,
              parentEventId: participatedEvent.dataValues.eventId,
              eventAddonId: {
                [Op.is]: null,
              },
            };
            const sessions = await this.attendeeBaseService.findAndCountAll({
              where: sessionReq,
            });
            attendedSessions += sessions.count;
          }
          totalAmountPaid = parseFloat(totalAmountPaid.toFixed(2));

        
      }

      /**--------------------------------------------------------------- */

      // Get the current date
      const currentDate = new Date();

      // Fetch the count of upcoming events
      const upcomingCondition = {
        id: { [Op.in]: eventIds },
        startTime: { [Op.gt]: currentDate },
        published: userRole === enumRoll.COMPANYADMIN ? 1 : { [Op.in]: [0, 1] },
        parentId: { [Op.is]: null },
      };
      const { count: upcomingCount } =
        await this.eventBaseService.findAndCountAll({
          where: upcomingCondition,
        });
      const upcomingEventCount = upcomingCount;

      // Fetch the count of events happening now
      const currentCondition = {
        id: { [Op.in]: eventIds },
        startTime: { [Op.lte]: currentDate },
        endTime: { [Op.gte]: currentDate },
        published: userRole === enumRoll.COMPANYADMIN ? 1 : { [Op.in]: [0, 1] },
        parentId: { [Op.is]: null },
      };
      const { count: currentCount } =
        await this.eventBaseService.findAndCountAll({
          where: currentCondition,
        });
      const currentEventCount = currentCount;

      // Fetch the count of past events
      const pastCondition = {
        id: { [Op.in]: eventIds },
        endTime: { [Op.lt]: currentDate },
        published: userRole === enumRoll.COMPANYADMIN ? 1 : { [Op.in]: [0, 1] },
        parentId: { [Op.is]: null },
      };
      const { count: pastCount } = await this.eventBaseService.findAndCountAll({
        where: pastCondition,
      });
      const pastEventCount = pastCount;

      // Construct the response with the counts of different event categories
      return {
        totalEventCount,
        upcomingEventCount,
        currentEventCount,
        pastEventCount,
        totalAmountPaid,
        totalUserCount,
        newUserCount,
        attendedSessions,
      };
    } catch (error) {
      Logger.error('Error fetching eventAndUserCount:', error);
      throw error;
    }
  }

  /**
   * Retrieves counts of total registered users, new registration(check in).
   * @returns A promise that resolves to the counts, or null if not found.
   */
  async volunteerDashboardCount(
    userId: number,
    userRole: string,
    eventData: dashboardCountRequestDTO
  ) {
    try {
      // Check if the user exists
      const user = await this.userBaseService.findById(userId);
      if (!user) {
        const errorMessage = `User with ID ${userId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      let totalUserCount = 0,
        checkInUserCount = 0;
      //if user is a volunteer
      if (userRole == enumRoll.VOLUNTEER) {
        // Fetch all total users registered for event
        const eventParticipantCondition = {
          eventId: eventData.eventId,
        };
        const { rows: events, count: eventCount } =
          await this.participantBaseService.findAndCountAll({
            where: eventParticipantCondition,
          });

        totalUserCount = eventCount;

        //Attendee table -- Getting count from attendee table
        const attendeeCondition = {
          parentEventId: eventData.eventId,
          isDeleted:0
        };
        const checkIn =
          await this.attendeeBaseService.findAll({
            attributes: ['participantId'],
            where: attendeeCondition,
            group: ['participantId'],
          });
        checkInUserCount = checkIn.length;
      }

      return {
        totalUserCount,
        checkInUserCount,
      };
    } catch (error) {
      Logger.error('Error fetching eventAndUserCount:', error);
      throw error;
    }
  }

  /**
   * Calculates the total registrations, total check-ins, and total amount collected for a given event.
   *
   * @param {number} eventId - The ID of the event to calculate statistics for.
   * @param {number} companyId - The ID of the company associated with the event.
   * @returns {Promise<{ totalRegistrations: number; totalCheckIns: number; totalAmount: number }>} - An object containing the calculated statistics.
   *
   * @throws {Error} - Throws an error if any issue occurs during the calculation process.
   */
  async countByEvent(eventId: number): Promise<{
    totalRegistrations: number;
    totalCheckIns: number;
    totalAmount: number;
  }> {
    try {
      // Initialize counters
      let totalAmount = 0.0;

      // Fetch all registered participants for the event
      const registeredUsers = await this.participantBaseService.findAll({
        where: { eventId },
      });
      const totalRegistrations = registeredUsers.length;

      // Fetch distinct check-ins for the event
      const checkIns = await this.attendeeBaseService.findAll({
        attributes: ['participantId'],
        where: { parentEventId: eventId },
        group: ['participantId'],
      });
      const totalCheckIns = checkIns.length;

      const paymentRecords = await this.paymentBaseService.findAll({
        where: { eventId },
      });

      // Calculate total amount using map
      paymentRecords.map((payment) => {
        const amount = Number(payment.dataValues.amount);
        if (!isNaN(amount)) {
          totalAmount += amount;
        }
      });

      return {
        totalRegistrations,
        totalCheckIns,
        totalAmount,
      };
    } catch (error) {
      Logger.error('Error in countByEvent:', error);
      throw error;
    }
  }

  /**
   * Retrieves the abstract counts for a reviewer.
   *
   * This method calculates various statistics related to abstracts for a reviewer,
   * including total abstracts, pending reviews, reviewed abstracts, approved abstracts,
   * and rejected abstracts. If the user is not a reviewer, an error is thrown.
   *
   * @param userId - The ID of the reviewer whose abstracts are being analyzed.
   * @param userRole - The role of the user to verify reviewer access.
   * @returns An object containing counts of different abstract statuses.
   * @throws Error if the user is not a reviewer or if an internal error occurs.
   */
  async abstractCountForReviewer(
    userId: number,
    userRole: string
  ): Promise<{
    totalAbstracts: number;
    pendingForReview: number;
    reviewedAbstracts: number;
    approvedAbstract: number;
    rejectedAbstracts: number;
  }> {
    try {
      // Ensure the user has the reviewer role
      if (userRole !== enumRoll.REVIEWER) {
        const errorMessage = `This data is provided only for Reviewers.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Initialize counters
      let totalAbstracts = 0;
      let pendingForReview = 0;
      let reviewedAbstracts = 0;
      let approvedAbstract = 0;
      let rejectedAbstracts = 0;

      // Fetch abstracts for the reviewer
      const abstracts = await this.userAbstractBaseService.findAll({
        where: { reviewerId: userId },
      });

      // Update counters based on abstract data
      totalAbstracts = abstracts.length;
      for (const abstract of abstracts) {
        if (abstract.dataValues.isReviewed === 0) {
          pendingForReview += 1;
        } else {
          reviewedAbstracts += 1;
        }

        if (abstract.dataValues.statusId === 1) {
          approvedAbstract += 1;
        } else if (abstract.dataValues.statusId === 2) {
          rejectedAbstracts += 1;
        }
      }

      // Return the computed counts
      return {
        totalAbstracts,
        pendingForReview,
        reviewedAbstracts,
        approvedAbstract,
        rejectedAbstracts,
      };
    } catch (error) {
      // Log and rethrow the error
      Logger.error('Error in abstractCountForReviewer:', error);
      throw error;
    }
  }

  /**
   * Calculates the total revenue for a company based on event participants' payments.
   * @param userId The ID of the user associated with the company
   * @returns The total revenue amount for the company
   * @throws Error if the company user is not found or any other issue occurs
   */
  async companyRevenueCount(userId: number, data: CompanyRevenueCountDTO) {
    try {
      let insights: Record<string, { amount: number; count: number }> = {};

      // Retrieve company details based on userId
      const companyDetails = await this.userCompanyBaseService.findOne({
        where: { userId },
      });

      if (!companyDetails) {
        const errorMessage = `Company user with ID ${userId} not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Fetch all events associated with the company (excluding child events)
      const eventCondition: WhereOptions = {
        companyId: companyDetails.dataValues.companyId,
        parentId: { [Op.is]: null },
      };
      if (data.eventId) {
        eventCondition.id = data.eventId;
      }
      const events = await this.eventBaseService.findAll({
        where: eventCondition,
      });

      let startDate = data.startDate ? new Date(data.startDate) : null;
      let endDate = data.endDate ? new Date(data.endDate) : null;

      // Iterate over each event to calculate total revenue and registered users
      for (const event of events) {
        let participantCondition: WhereOptions = {
          eventId: event.dataValues.id,
        };

        if (startDate && endDate) {
          participantCondition.createdOn = {
            [Op.between]: [
              startDate,
              new Date(endDate).setHours(23, 59, 59, 999),
            ],
          };
        } else if (startDate) {
          participantCondition.createdOn = { [Op.gte]: startDate };
        } else if (endDate) {
          participantCondition.createdOn = {
            [Op.lte]: new Date(endDate).setHours(23, 59, 59, 999),
          };
        }

        // Fetch all participants who match the given condition
        const participants = await this.participantBaseService.findAll({
          where: participantCondition,
        });

        // Process each participant
        participants.forEach((participant) => {
          const createdOn = participant.dataValues.createdOn;
          const rawAmount = participant.dataValues.amountPaid;

          if (!createdOn || rawAmount == null) return;

          const amount =
            typeof rawAmount === 'number' ? rawAmount : parseFloat(rawAmount);
          if (isNaN(amount)) return;

          const date = new Date(createdOn).toISOString().split('T')[0];

          // Initialize date entry if not present
          if (!insights[date]) {
            insights[date] = { amount: 0, count: 0 };
          }

          // Accumulate revenue and increase participant count
          insights[date].amount += amount;
          insights[date].count += 1;
        });
      }

      // Ensure all dates between startDate and endDate are present
      if (startDate && endDate) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          if (!insights[dateStr]) {
            insights[dateStr] = { amount: 0, count: 0 };
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      // Convert insights object to an array and sort by date
      const sortedInsights = Object.entries(insights).sort(([dateA], [dateB]) =>
        dateA.localeCompare(dateB)
      );

      // Format the response with amount and participant count
      const formattedInsights = sortedInsights.map(([date, data]) => ({
        date,
        amount: parseFloat(data.amount.toFixed(2)), // Ensure 2 decimal places
        registeredUsers: data.count, // Total participants for that date
      }));

      return formattedInsights;
    } catch (error) {
      Logger.error('Error in companyRevenueCount:', error);
      throw error;
    }
  }
}
