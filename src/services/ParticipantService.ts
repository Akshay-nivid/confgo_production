/**
 * @class ParticipantService
 * @description Service class for handling Participant operations.
 * @author nihal
 */

import { Logger } from '../utils/logger';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { BaseService } from './BaseService';
import { Participant } from '../models/Participant';
import {
  AddonData,
  AttendanceDetailsDTO,
  AttendedProgramsDTO,
  CreateParticipantDTO,
  ParticipantByEventResponse,
  ParticipantListFilterDTO,
  participantRequestDTO,
  QrParticipantRequestDTO,
} from '../dtos/participant/ParticipantDTO';
import { ParticipantType } from '../models/ParticipantType';
import { ParticipantGroup } from '../models/ParticipantGroup';
import { CreateParticipantGroupDTO } from '../dtos/participant/ParticipantGroupDTO';
import { Event } from '../models/Event';
import { EventParticipant } from '../models/EventParticipant';
import { ParticipantRole } from '../models/ParticipantRole';
import { CreateParticipantRoleDTO } from '../dtos/participant/ParticipantRoleDTO';
import { User } from '../models/User';
import { UserCompany } from '../models/UserCompany';
import { Venue } from '../models/Venue';
import { EventSpeaker } from '../models/EventSpeaker';
import { EventParticipantEntry } from '../models/EventParticipantEntry';
import { Utils } from '../utils/Utils';
import {
  Addon,
  Attendee,
  Cart,
  Company,
  EventAddon,
  EventAddonProperty,
  EventContact,
  EventRegistrationRecord,
  Order,
  OrderItem,
  Payment,
  PaymentMethod,
  UserAbstract,
  VolunteerEvent,
} from '../models/init-models';
import { v1 as uuidv1 } from 'uuid';
import { enumRoll, enumVolunteerEventStatus } from '../utils/enum';
/**
 * @class ParticipantService
 * @description Service class for handling CRUD operations related to the Participant model.
 */
export class ParticipantService {
  private participantBaseService: BaseService<Participant>;
  private participantTypeBaseService: BaseService<ParticipantType>;
  private participantGroupBaseService: BaseService<ParticipantGroup>;
  private eventParticipantBaseService: BaseService<EventParticipant>;
  private participantRoleBaseService: BaseService<ParticipantRole>;
  private userBaseService: BaseService<User>;
  private eventParticipantEntryBaseService: BaseService<EventParticipantEntry>;
  private orderBaseService: BaseService<Order>;
  private paymentBaseService: BaseService<Payment>;
  private eventBaseService: BaseService<Event>;
  private eventRegistrationRecordBaseService: BaseService<EventRegistrationRecord>;
  private attendeeBaseService: BaseService<Attendee>;
  private eventAddonBaseService: BaseService<EventAddon>;
  private eventAddonPropertyBaseService: BaseService<EventAddonProperty>;
  private userAbstractBaseService: BaseService<UserAbstract>;
  private cartBaseService: BaseService<Cart>;
  private volunteerEventBaseService: BaseService<VolunteerEvent>;

  constructor() {
    // Cast the Participant model explicitly to match the expected constructor signature
    this.participantBaseService = new BaseService(
      Participant as unknown as { new (): Participant } & typeof Participant
    );
    this.participantTypeBaseService = new BaseService(
      ParticipantType as unknown as {
        new (): ParticipantType;
      } & typeof ParticipantType
    );
    this.participantGroupBaseService = new BaseService(
      ParticipantGroup as unknown as {
        new (): ParticipantGroup;
      } & typeof ParticipantGroup
    );
    this.eventParticipantBaseService = new BaseService(
      EventParticipant as unknown as {
        new (): EventParticipant;
      } & typeof EventParticipant
    );
    this.participantRoleBaseService = new BaseService(
      ParticipantRole as unknown as {
        new (): ParticipantRole;
      } & typeof ParticipantRole
    );
    this.userBaseService = new BaseService(
      User as unknown as { new (): User } & typeof User
    );
    this.eventParticipantEntryBaseService = new BaseService(
      EventParticipantEntry as unknown as {
        new (): EventParticipantEntry;
      } & typeof EventParticipantEntry
    );
    this.orderBaseService = new BaseService(
      Order as unknown as {
        new (): Order;
      } & typeof Order
    );
    this.paymentBaseService = new BaseService(
      Payment as unknown as { new (): Payment } & typeof Payment
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
    this.eventRegistrationRecordBaseService = new BaseService(
      EventRegistrationRecord as unknown as {
        new (): EventRegistrationRecord;
      } & typeof EventRegistrationRecord
    );
    this.attendeeBaseService = new BaseService(
      Attendee as unknown as { new (): Attendee } & typeof Attendee
    );
    this.eventAddonBaseService = new BaseService(
      EventAddon as unknown as { new (): EventAddon } & typeof EventAddon
    );
    this.eventAddonPropertyBaseService = new BaseService(
      EventAddonProperty as unknown as {
        new (): EventAddonProperty;
      } & typeof EventAddonProperty
    );
    this.userAbstractBaseService = new BaseService(
      UserAbstract as unknown as { new (): UserAbstract } & typeof UserAbstract
    );
    this.cartBaseService = new BaseService(
      Cart as unknown as { new (): Cart } & typeof Cart
    );
    this.volunteerEventBaseService = new BaseService(
      VolunteerEvent as unknown as { new (): VolunteerEvent } & typeof VolunteerEvent
    );
  }

  /**
   * Creates a new participant.
   * @param participantData - The data to create the participant.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Participant.
   */
  async createParticipant(
    participantData: CreateParticipantDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<Participant> {
    try {
      let participantType: ParticipantType | null;
      if (participantData.participantTypeId) {
        participantType = await this.participantTypeBaseService.findById(
          participantData.participantTypeId,
          undefined,
          transaction
        );
      }

      // if (!participantType) {
      //   const errorMessage = `Participant Type not found for participant ID ${participantData.participantTypeId}.`;
      //   Logger.error(errorMessage);
      //   throw new Error(errorMessage);
      // }

      // Checking if user exists and retrieving user data
      const userData = await this.userBaseService.findById(userId);
      if (!userData) {
        const errorMessage = `User not found for user ID ${userId}.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const participantReq: participantRequestDTO = {
        registrationType: participantData.registrationType,
        eventId: participantData?.parentEventId,
        amountPaid: participantData.finalPrice,
        qrCode: uuidv1(),
        participantTypeId: participantData.participantTypeId,
        userId: userData.dataValues.id,
        createdBy: userId,
        modifiedBy: 0,
      };
      // Create Participant
      const newParticipant = await this.participantBaseService.create(
        participantReq,
        transaction
      );

      // Retrieve the event details using orderId
      const orderDetails = await this.orderBaseService.findOne(
        {
          where: { id: participantData.orderId },
          include: [
            {
              model: OrderItem,
              as: 'orderItems',
            },
          ],
        },
        transaction
      );

      // Get event IDs from order items
      const programIds: number[] =
        orderDetails?.orderItems
          ?.map((item) => item.eventId)
          .filter(
            (eventId): eventId is number =>
              eventId !== undefined && eventId !== null
          ) ?? [];
      // Check seat availability for each programId
      const eventPaticipatCondition: WhereOptions<EventParticipantEntry> = {
        eventId: { [Op.in]: programIds },
      };
      const programSeatDetails =
        await this.eventParticipantEntryBaseService.findAll(
          {
            where: eventPaticipatCondition,
            attributes: ['eventId', 'totalSeat', 'seatAllocated'],
          },
          transaction
        );

      // Check seat availability and update seatAllocated if seats are available
      for (const programSeatDetail of programSeatDetails) {
        if (programSeatDetail.seatAllocated >= programSeatDetail.totalSeat) {
          throw new Error(
            `Program with ID ${programSeatDetail.eventId} is full.`
          );
        } else {
          // Increment seatAllocated by 1 if seats are available
          const updateData = {
            seatAllocated: programSeatDetail.seatAllocated + 1,
          };
          const whereOptions = { eventId: programSeatDetail.eventId };
          await this.eventParticipantEntryBaseService.updateCustom(
            updateData,
            whereOptions,
            undefined,
            transaction
          );
        }
      }
      if (orderDetails?.orderItems && orderDetails.orderItems.length > 0) {
        const eventParticipantReq = orderDetails?.orderItems.map((items) => ({
          eventId: items.dataValues.eventId,
          participantId: newParticipant.dataValues.id,
          roleName: participantType?.dataValues.name,
          eventAddonId: items.dataValues.eventAddonId,
          eventAddonPropertyId: items.dataValues.eventAddonPropertyId,
          createdBy: userId,
          modifiedBy: userId,
        }));

        // Creating order items in bulk
        await this.eventParticipantBaseService.bulkCreate(
          eventParticipantReq,
          transaction
        );
      }
      Logger.info('Participant created successfully:', newParticipant);

      return newParticipant;
    } catch (error) {
      Logger.error('Error creating participant:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single participant by their primary key (ID).
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the Participant record, or null if not found.
   */
  async getParticipantById(id: number): Promise<Participant | null> {
    return this.participantBaseService.findById(id);
  }

  /**
   * Method to fetch Participant Details and program registered or participated
   * @param id
   * @param transaction
   * @returns
   */
  async getParticipantDetailsById(
    id: number,
    transaction?: Transaction
  ): Promise<{
    programs: EventParticipant[];
    details: Participant;
    payment: Payment | null;
    formData: EventRegistrationRecord[];
    attendanceDetails: AttendanceDetailsDTO;
    userAbstract: UserAbstract | null;
  }> {
    try {
      const exclude = ['modifiedOn', 'modifiedBy', 'createdBy', 'createdOn'];
      //Fetching participant details
      const partDetails = await this.participantBaseService.findById(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude,
            },
          },
          {
            model: Event,
            as: 'event',
            attributes: {
              exclude,
            },
            include: [
              {
                model: Company,
                as: 'company',
                attributes: {
                  exclude: ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy']
                }
              },
              {
                model: EventContact,
                as: 'eventContacts',
                attributes: ['email', 'phone'],
                required: false
              }
            ]
          }
        ],
      });
      if (!partDetails) {
        const errorMessage = `Participant with ID: ${id} does not exist.`;
        throw new Error(errorMessage);
      }
      //Fetching program details
      const eventPgms = await this.eventParticipantBaseService.findAll(
        {
          where: { participantId: id },
          include: [
            {
              model: Event,
              as: 'event',
              attributes: {
                exclude,
              },
              include: [
                {
                  model: Venue,
                  as: 'venue',
                  attributes: {
                    exclude,
                  },
                },
                {
                  model: EventSpeaker,
                  as: 'eventSpeakers',
                  attributes: {
                    exclude,
                  },
                  include: [
                    {
                      model: User,
                      as: 'user',
                      attributes: {
                        exclude: [
                          'phoneVerified',
                          'isSsoUser',
                          'ssoMetadata',
                          'designation',
                          'deviceToken',
                          'userDescription',
                          'statusId',
                          'acceptedTerms',
                          'createdBy',
                          'createdOn',
                          'modifiedBy',
                          'modifiedOn'
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          attributes: {
            exclude,
          },
        },
        transaction
      );
      const methodExclude = [
        'id',
        'handler',
        'enabled',
        'description',
        'logoUrl',
        'minAmount',
        'maxAmount',
        'createdOn',
        'createdBy',
        'modifiedOn',
        'modifiedBy',
      ];
      const paymentDetails = await this.paymentBaseService.findOne({
        where: {
          userId: partDetails.dataValues.userId,
          eventId: partDetails.dataValues.eventId,
        },
        include: [
          {
            model: PaymentMethod,
            as: 'paymentMethod',
            attributes: {
              exclude: methodExclude,
            },
          },
          {
            model: Order,
            as: 'order',
            attributes: {
              exclude: ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy'],
            } 
          }
        ],
      });

      // Fetching form data of the participant
      const formData = await this.eventRegistrationRecordBaseService.findAll({
        where: {
          userId: partDetails.dataValues.userId,
          eventId: partDetails.dataValues.eventId,
        },
        attributes: ['response'],
      });
      const attendanceDetails = await this.getAttendanceDetails(
        partDetails.dataValues.id,
        partDetails.dataValues.eventId
      );

      const abstractData = await this.userAbstractBaseService.findOne({
        where: {
          userId: partDetails.dataValues.userId,
          eventId: partDetails.dataValues.eventId,
        },
        attributes: {
          exclude,
        },
      });

      return {
        details: partDetails,
        programs: eventPgms || [],
        payment: paymentDetails,
        formData: formData || [],
        attendanceDetails: attendanceDetails, // Updated to match AttendanceDetails type
        userAbstract: abstractData,
      };
    } catch (error) {
      Logger.error('Error getParticipantDetailsById:', error);
      throw error;
    }
  }

  /**
   * Retrieves a single participant type by their primary key (ID).
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the Participant record, or null if not found.
   */
  async getParticipantTypeById(id: number): Promise<ParticipantType | null> {
    return this.participantTypeBaseService.findById(id);
  }

  /**
   * Creates participant Group.
   * @param participantGroupData - The data to create the participant Group.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Participant Group.
   */
  async createParticipantGroup(
    participantGroupData: CreateParticipantGroupDTO,
    userId: number
  ): Promise<ParticipantGroup> {
    return this.participantGroupBaseService.executeTransaction<ParticipantGroup>(
      async (transaction: Transaction) => {
        try {
          // Check if the participant exists
          const participantData = await this.getParticipantById(
            participantGroupData.participantId
          );

          if (!participantData) {
            const errorMessage = `Participant ID ${participantGroupData.participantId} does not exist.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
          const user = await this.userBaseService.findOne({
            where: { id: userId },
            include: [{ model: UserCompany, as: 'userCompanies' }],
          });
          // Handle case where user does not exist
          if (!user) {
            const errorMessage = `Company not found for user ID ${userId}.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          } else if (
            !user.userCompanies ||
            user.userCompanies.length === 0 ||
            !user.userCompanies[0].companyId
          ) {
            const errorMessage = `Company not found for user ID ${userId}.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const request = {
              name: participantGroupData.name,
              participantId: participantGroupData.participantId,
              tag: participantGroupData.tag,
              companyId: user.userCompanies[0].companyId,
              createdBy: userId, // Changed to userId for meaningful tracking
              modifiedBy: userId,
            };

            // Create Participant Group
            const newParticipantGroup =
              await this.participantGroupBaseService.create(
                request,
                transaction
              );

            Logger.info(
              'Participant Group created successfully:',
              newParticipantGroup
            );
            return newParticipantGroup;
          }
        } catch (error) {
          Logger.error('Error creating participant group:', error);
          throw new Error(`Failed to create participant group: ${error}`);
        }
      }
    );
  }

  /**
   * Creates participant Role.
   * @param participantRoleData - The data to create the participant Group.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Participant Group.
   */
  async createParticipantRole(
    participantRoleData: CreateParticipantRoleDTO,
    userId: number
  ): Promise<ParticipantRole> {
    return this.participantRoleBaseService.executeTransaction(
      async (transaction: Transaction) => {
        try {
          //Checking the user and association is exist
          const user = await this.userBaseService.findOne({
            where: { id: userId },
            include: [{ model: UserCompany, as: 'userCompanies' }],
          });

          //check the company id exist in user company model
          if (
            !user ||
            !user.userCompanies[0] ||
            !user.userCompanies[0].companyId
          ) {
            const errorMessage = `Company not found for user ID ${userId}.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          } else {
            const request = {
              roleName: participantRoleData.roleName,
              owner: participantRoleData.owner,
              description: participantRoleData?.description,
              companyId: user.userCompanies?.[0].companyId,
              createdBy: userId,
              modifiedBy: userId,
            };

            // Create Participant Role
            const newParticipantRole =
              await this.participantRoleBaseService.create(
                request,
                transaction
              );

            Logger.info(
              'Participant Role created successfully:',
              newParticipantRole
            );
            return newParticipantRole;
          }
        } catch (error) {
          Logger.error('Error creating participant Role:', error);
          throw new Error(`${error}`); // Use custom error handling if needed
        }
      }
    );
  }

  /**
   * Fetches a list of event participants with optional filters, sorting, and pagination
   * Includes participant details and associated user data.
   * @param filters - Filtering options to apply to the participant list.
   * @param limit - Number of results to return per page.
   * @param offset - Number of results to skip for pagination.
   * @param sortBy - Field by which to sort results.
   * @param sortDirection - Direction to sort (ASC or DESC).
   * @returns Object containing the list of event participants and the total count.
   */
  async getParticipantList(
    filters: ParticipantListFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string
  ): Promise<{ rows: Participant[]; count: number }> {
    try {
      const { id, eventId, startDate, endDate, name,userId } = filters;

      // Initialize the participantCondition object for filtering event participants
      const participantCondition: WhereOptions<Participant> = {};
      if (Utils.isNotUndefined(eventId)) {
        participantCondition.eventId = eventId;
      }
      if (Utils.isNotUndefined(userId)) {
        participantCondition.userId = userId;
      }
      if (Utils.isNotUndefined(id)) {
        participantCondition.id = id;
      }
      // Apply date range filters to participantCondition if specified
      if (startDate && endDate) {
        participantCondition.createdOn = {
          [Op.between]: [startDate, endDate],
        };
      } else if (startDate) {
        participantCondition.createdOn = { [Op.gte]: startDate };
      } else if (endDate) {
        participantCondition.createdOn = { [Op.lte]: endDate };
      }

      // Initialize userCondition to filter by user's name if provided
      const userCondition: WhereOptions<User> = {};
      if (name) userCondition.firstName = { [Op.like]: `%${name}%` };

      const { count, rows } = await this.participantBaseService.findAndCountAll(
        {
          where: participantCondition,
          include: [
            {
              model: User,
              as: 'user',
              required: true,
              where: userCondition,
              attributes: { exclude: ['isSsoUser', 'ssoMetadata'] },
            },
          ],
          limit,
          offset,
          order: [[sortBy, sortDirection.toUpperCase()]],
        }
      );

      return { rows, count };
    } catch (error) {
      Logger.error('Error getParticipantList:', error);
      throw error;
    }
  }

  /**
   * Retrieves all participant and count by their eventId.
   * @param eventId - The ID of the event to retrieve.
   * @returns A promise that resolves to the Participant record, or null if not found.
   */
  async getParticipantByEventId(
    eventId: number
  ): Promise<ParticipantByEventResponse> {
    try {
      const { rows: participant, count: participantCount } =
        await this.participantBaseService.findAndCountAll({
          where: { eventId: eventId },
        });
      const response = {
        participant: participant,
        participantCount: participantCount,
      };
      return response;
    } catch (error) {
      Logger.error('Error getParticipantByEventId:', error);
      throw error;
    }
  }

  /**
   * Checks if the user is already a participant in a given event.
   * @param userId - ID of the user to check.
   * @param eventId - ID of the event to check.
   * @returns true if the user is a participant, false otherwise.
   */
  async existingParticipantOrNot(userId: number, eventId: number) {
    try {
      
      // checking the given event id is exist or not
      const event = await this.eventBaseService.findById(eventId);
      if(!event){
        const errorMessage = `Event with Id ${eventId} does not found.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      const participant = await this.participantBaseService.findOne({
        where: { userId: userId, eventId: eventId },
      });
      return !!participant;
    } catch (error) {
      Logger.error('Error existingParticipantOrNot: ', error);
      throw error;
    }
  }

  /**
   * Fetch participant and payment details for a given event and user.
   * @param eventId
   * @param userId
   * @returns
   */
  async getParticipantAndPaymentDetailsByEventId(
    eventId: number,
    userId: number
  ) {
    try {
      // Fetch participant details
      const eventParticipant = await this.participantBaseService.findOne({
        where: {
          eventId: eventId,
          userId: userId,
        },
      });

      // Fetch payment details
      const participantPayment = await this.paymentBaseService.findOne({
        where: {
          eventId: eventId,
          userId: userId,
        },
        include: [
          {
            model: Order,
            as: 'order',
            attributes: {
              exclude: ['createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'],
            },
          },
        ],
      });

      // Return both results as an object or tuple
      return { eventParticipant, participantPayment };
    } catch (error) {
      Logger.error('Error in getParticipantAndPaymentDetailsByEventId:', error);
      throw error;
    }
  }

  /**
   *  Retrieves the registered events and associated programs for a user.
   *
   * @param userId - The ID of the user whose registered events and programs are to be fetched.
   * @param eventId - (Optional) The ID of a specific event to filter the programs.
   *                  If not provided, all registered events for the user are returned.
   * @returns A promise that resolves to an array of event and program details.
   * @throws An error if the operation fails, logged with a descriptive message.
   */
  async getRegisteredEventsAndPrograms(userId: number, eventId: number) {
    try {
      const response: Event[] = [];
      const exclude = ['createdOn', 'createdBy', 'modifiedOn', 'modifiedBy'];
      // Fetch participant records for the userId
      const participantIds = await this.participantBaseService.findAll({
        where: { userId: userId },
      });

      if (eventId === 0) {
        const eventIds = participantIds.map(
          (participant) => participant.dataValues.eventId
        );

        // Fetch events by the extracted event IDs
        const events = await this.eventBaseService.findAll({
          where: { id: eventIds },
          include: {
            model: Venue,
            as: 'venue',
            attributes: { exclude },
          },
          attributes: { exclude },
        });

        response.push(...events);
      } else {
        // Fetch child programs for the given eventId
        const eventPrograms = await this.eventBaseService.findAll({
          where: { parentId: eventId },
        });

        const programIds = eventPrograms.map((program) => program.id);

        const participantIdsArray = participantIds.map(
          (participant) => participant.dataValues.id
        );

        // Fetch attended programs where `programIds` are checked as `eventId`
        const attendedPrograms = await this.eventParticipantBaseService.findAll(
          {
            where: {
              participantId: participantIdsArray,
              eventId: programIds, // Check programIds as eventId
            },
            attributes: { exclude },
          }
        );

        // Extract program IDs from attended programs
        const attendedProgramIds = attendedPrograms
          .map((program) => program.dataValues.eventId)
          .filter((id): id is number => id !== undefined && id !== null);

        // Fetch events for the attended programs
        const events = await this.eventBaseService.findAll({
          where: { id: attendedProgramIds },
          include: [
            {
              model: Venue,
              as: 'venue',
              attributes: { exclude },
            },
          ],
          attributes: { exclude },
        });

        response.push(...events);
      }

      return response; // Return the array of events
    } catch (error) {
      Logger.error('Error in getRegisteredEventsAndPrograms:', error);
      throw error;
    }
  }

  /**
   * Retrieve Participant Details by QR Code and Event ID
   *
   * @param qrCode - The QR code associated with the participant.
   * @param eventId - The ID of the event for which the participant is being searched.
   * @returns The participant details if a match is found.
   * @throws Error if the QR code or event ID is invalid or does not match.
   */
  async getParticipantDetailsByQr(
    data: QrParticipantRequestDTO,
    userId?: number,
    userRole?: string,
    transaction?: Transaction
  ): Promise<Participant> {
    try {
      let participantCondition: WhereOptions = {};

      // taking the condition to check
      if (data.participantId) {
        participantCondition.id = data.participantId;
      }
      if (data.qrCode) {
        participantCondition.qrCode = data.qrCode;
      }

      // Exclude other details from fetching data
      const exclude = [
        'id',
        'phoneVerified',
        'acceptedTerms',
        'isSsoUser',
        'ssoMetadata',
        'statusId',
        'assetId',
        'modifiedOn',
        'modifiedBy',
        'createdBy',
        'createdOn',
      ];
      const participant = await this.participantBaseService.findOne({
        where: participantCondition,
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude,
            },
          },
        ],
        transaction,
      });
      if (!participant) {
        const errorMessage = `QR code or Participant ID not found for the given event.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // If the user is volunteer then checking volunteeer has access to the participant event
      if (userRole === enumRoll.VOLUNTEER) {
        const volunteerAssigned = await this.volunteerEventBaseService.findOne({
          where: {
            userId: userId,
            eventId: participant.dataValues.eventId,
            statusId: enumVolunteerEventStatus.ACTIVE,
          },
        });

        if(!volunteerAssigned){
          const errorMessage = `You are not authorized to manage attendee registrations for this event.` ;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
      }
      return participant;
    } catch (error) {
      Logger.error('Error in getParticipantDetailsByQr:', error);
      throw error;
    }
  }

  /**
   * Retrieves the registered addons for a participant
   * @param participantId - The ID of the participant
   * @returns A list of registered addons including their event and property details
   */
  async getRegisteredAddons(participantId: number) {
    try {
      const attendedAddonsMap = new Map<number, AddonData >();
  
      // Retrieve all the addons for the given participant
      const addons = await this.eventParticipantBaseService.findAll({
        where: {
          participantId: participantId,
          eventId: { [Op.is]: undefined },
        },
      });
  
      // Loop through each addon to fetch related data
      for (const addon of addons) {
        const { eventAddonId, eventAddonPropertyId } = addon.dataValues;
  
        if (eventAddonId) {
          // Retrieve the eventAddon data along with its associated Addon
          const eventAddonData = await this.eventAddonBaseService.findById(eventAddonId, {
            include: [
              {
                model: Addon,
                as: 'addon',
              },
            ],
          });
  
          // Check if this eventAddonData is already in the Map
          if (!attendedAddonsMap.has(eventAddonId)) {
            // Add the addon to the Map if not already present
            attendedAddonsMap.set(eventAddonId, {
              addon: eventAddonData,
              addonProperties: [],
            });
          }
  
          // Add properties only if eventAddonPropertyId exists
          if (eventAddonPropertyId) {
            const addonProperties = await this.eventAddonPropertyBaseService.findAll({
              where: {
                id: eventAddonPropertyId,
              },
            });
  
            // Push properties to the existing entry in the Map
            const existingEntry = attendedAddonsMap.get(eventAddonId);
            if (existingEntry) {
              existingEntry.addonProperties.push(...addonProperties);
            }
          }
        }
      }
  
      // Convert the Map to an array
      return Array.from(attendedAddonsMap.values());
    } catch (error) {
      // Error handling
      Logger.error('Error in getRegisteredAddons:', error);
      throw error; // Re-throw the error for external handling
    }
  }
  /**
   * Fetches the attendance details for a specific participant and event.
   *
   * Categorizes the registered programs into attended, upcoming, and absent
   * based on the attendance records and program schedules.
   *
   * @param participantId - The ID of the participant whose attendance details are being fetched.
   * @param eventId - The ID of the event for which attendance details are being fetched.
   * @returns A promise that resolves to an object containing categorized attendance details:
   *          - attendedPrograms: Programs the participant has attended.
   *          - upcomingPrograms: Programs scheduled for the future.
   *          - absentPrograms: Programs the participant missed.
   */
  async getAttendanceDetails(
    participantId: number,
    eventId: number
  ): Promise<AttendanceDetailsDTO> {
    try {
      // Fetching participant details and throwing an error if not found
      const participant =
        await this.participantBaseService.findById(participantId);
      if (!participant) {
        const errorMessage = `Participant with Id ${participantId} Not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Fetching the list of programs the participant is registered for in the specified event
      const registeredPrograms = await this.getRegisteredEventsAndPrograms(
        participant?.dataValues.userId,
        eventId
      );

      // Fetching all attendance records for the participant in the specified event
      const attendances = await this.attendeeBaseService.findAll({
        where: { participantId: participantId, isDeleted: 0 },
        attributes: {
          exclude: [
            'createdBy',
            'createdOn',
            'modifiedBy',
            'modifiedOn',
            'eventAddonId',
            'eventAddonPropertyId',
            'isDeleted',
          ],
        },
      });

      // Initialize categorized program arrays
      const attendedPrograms: AttendedProgramsDTO[] = [];
      const upcomingPrograms: Event[] = [];
      const absentPrograms: Event[] = [];
      
      // Create a map of attendance for faster lookup
      const attendanceMap = new Map();
      attendances.forEach((attendance) => {
        attendanceMap.set(attendance.dataValues.eventId, attendance);
      });
      
      for (const program of registeredPrograms) {
        const attendance = attendanceMap.get(program.dataValues.id);
        
        if (attendance) {
          // Participant has attended this program
          attendedPrograms.push({
            program: program,
            attendeeData: attendance,
          });
        } else if (program.parentId !== null && program.startTime > new Date()) {
          // Program is in the future
          upcomingPrograms.push(program);
        } else if (program.parentId !== null) {
          // If the program has a parentId but is not attended
          absentPrograms.push(program);
        }
      }      
      return { attendedPrograms, upcomingPrograms, absentPrograms };
    } catch (error) {
      Logger.error('Error in getAttendanceDetails:', error);
      throw error; // Re-throw the error for external handling
    }
  }
}
