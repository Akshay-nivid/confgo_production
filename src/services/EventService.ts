/**
 * @class EventService
 * @description Service class for handling Event operations .
 * @author nihal
 */
import { BaseService } from "./BaseService";
import { Op, QueryTypes, Sequelize, Transaction, WhereOptions } from "sequelize";
import { Logger } from "../utils/logger";
import {
  AddProgramDTO,
  CreateEventDTO,
  EventFilterDTO,
  RegisteredEventFilter,
  UpdateContactDTO,
  UpdateEventDTO,
  UpdateDraftDTO,
  ProgramCheckinDTO,
} from "../dtos/event/EventDTO";
import {
  Addon,
  EventAddonProperty,
  Company,
  Event,
  EventAddon,
  EventSpeaker,
  EventRegistrationForm,
  EventStatus,
  ParticipantType,
  Subscription,
  User,
  MeetingMetadata,
  UserCompany,
  Venue,
  Participant,
  Template,
  EventPriceTier,
  EventParticipantEntry,
  EventContact,
  EventParticipant,
  Attendee,
  Specialty,
  UserRole,
  Role,
  EventImages,
  EventSponsor,
  Sponsor,
  SponsorType,
  Plan,
  Asset,
  CompanyPaypalConfiguration,
} from "../models/init-models";
import { CreateEventRegistrationFormsRequestDTO, FormDataDTO, FormRequestDTO } from "../dtos/event/EventRegistrationFormDTO";
import {
  enumEventAddonStatus,
  enumEventClass,
  enumEventProgramSchedulerStatus,
  enumEventProgramStatus,
  enumEventStatus,
  enumRoll,
  enumSponsorStatus,
  enumStatus,
  enumSubscriptionStatus,
} from "../utils/enum";
import { CreateAddonPropertyDTO } from "../dtos/addon/AddonPropertyDTO";
import { AddEventAddonDTO, updateAddonDTO } from "../dtos/event/EventAddonDTO";
import { Utils } from "../utils/Utils";
import { UpdateEventTemplateDTO } from "../dtos/event/EventTemplateDTO";
import { SpeakerBio } from "../models/SpeakerBio";
import { sponsorAssignDataDTO, sponsorAssignDTO } from "../dtos/sponsor/SponsorDTO";
import { add } from "winston";
import { AddonCountDTO } from "../dtos/addon/AddonDTO";
import { Color } from "../models/init-models";
export class EventService {
  private eventBaseService: BaseService<Event>;
  private metaDataBaseService: BaseService<MeetingMetadata>;
  private venueBaseService: BaseService<Venue>;
  private eventAddonBaseService: BaseService<EventAddon>;
  private eventStatusBaseService: BaseService<EventStatus>;
  private companyBaseService: BaseService<Company>;
  private userBaseService: BaseService<User>;
  private participantTypeBaseService: BaseService<ParticipantType>;
  private eventRegistrationFormBaseService: BaseService<EventRegistrationForm>;
  private userCompanyService: BaseService<UserCompany>;
  private subscriptionBaseService: BaseService<Subscription>;
  private addonPropertyBaseService: BaseService<EventAddonProperty>;
  private participantBaseService: BaseService<Participant>;
  private addonBaseService: BaseService<Addon>;
  private eventAddonPropertyBaseService: BaseService<EventAddonProperty>;
  private eventParticipantEntryBaseService: BaseService<EventParticipantEntry>;
  private eventContactBaseService: BaseService<EventContact>;
  private eventSpeakerBaseService: BaseService<EventSpeaker>;
  private eventSpeakerBioBaseService: BaseService<SpeakerBio>;
  private userRoleBaseService: BaseService<UserRole>;
  private roleBaseService: BaseService<Role>;
  private eventSponsorBaseService: BaseService<EventSponsor>;
  private sponsorBaseService: BaseService<Sponsor>;
  private attendeeBaseService: BaseService<Attendee>;
  private eventParticipantBaseService: BaseService<EventParticipant>;
  private companyPaypalConfigurationBaseService: BaseService<CompanyPaypalConfiguration>;
  private colorBaseService: BaseService<Color>;
  constructor() {
    // Cast the Event model explicitly to match the expected constructor signature
    this.eventBaseService = new BaseService(Event as unknown as { new (): Event } & typeof Event);
    this.metaDataBaseService = new BaseService(MeetingMetadata as unknown as { new (): MeetingMetadata } & typeof MeetingMetadata);
    this.venueBaseService = new BaseService(Venue as unknown as { new (): Venue } & typeof Venue);
    this.eventAddonBaseService = new BaseService(EventAddon as unknown as { new (): EventAddon } & typeof EventAddon);
    this.eventStatusBaseService = new BaseService(EventStatus as unknown as { new (): EventStatus } & typeof EventStatus);
    this.companyBaseService = new BaseService(Company as unknown as { new (): Company } & typeof Company);
    this.userBaseService = new BaseService(User as unknown as { new (): User } & typeof User);
    this.participantTypeBaseService = new BaseService(
      ParticipantType as unknown as {
        new (): ParticipantType;
      } & typeof ParticipantType
    );
    this.eventRegistrationFormBaseService = new BaseService(
      EventRegistrationForm as unknown as {
        new (): EventRegistrationForm;
      } & typeof EventRegistrationForm
    );
    this.userCompanyService = new BaseService(UserCompany as unknown as { new (): UserCompany } & typeof UserCompany);
    this.subscriptionBaseService = new BaseService(Subscription as unknown as { new (): Subscription } & typeof Subscription);
    this.addonPropertyBaseService = new BaseService(
      EventAddonProperty as unknown as {
        new (): EventAddonProperty;
      } & typeof EventAddonProperty
    );
    this.participantBaseService = new BaseService(Participant as unknown as { new (): Participant } & typeof Participant);
    this.addonBaseService = new BaseService(Addon as unknown as { new (): Addon } & typeof Addon);
    this.eventAddonPropertyBaseService = new BaseService(
      EventAddonProperty as unknown as {
        new (): EventAddonProperty;
      } & typeof EventAddonProperty
    );
    this.eventParticipantEntryBaseService = new BaseService(
      EventParticipantEntry as unknown as {
        new (): EventParticipantEntry;
      } & typeof EventParticipantEntry
    );
    this.eventContactBaseService = new BaseService(EventContact as unknown as { new (): EventContact } & typeof EventContact);
    this.eventSpeakerBaseService = new BaseService(EventSpeaker as unknown as { new (): EventSpeaker } & typeof EventSpeaker);
    this.userRoleBaseService = new BaseService(UserRole as unknown as { new (): UserRole } & typeof UserRole);
    this.roleBaseService = new BaseService(Role as unknown as { new (): Role } & typeof Role);
    this.eventSpeakerBioBaseService = new BaseService(
      SpeakerBio as unknown as {
        new (): SpeakerBio;
      } & typeof SpeakerBio
    );
    // Cast the EventSponsor model explicitly to match the expected constructor signature
    this.eventSponsorBaseService = new BaseService(EventSponsor as unknown as { new (): EventSponsor } & typeof EventSponsor);
    this.sponsorBaseService = new BaseService(Sponsor as unknown as { new (): Sponsor } & typeof Sponsor);
    this.attendeeBaseService = new BaseService(Attendee as unknown as { new (): Attendee } & typeof Attendee);
    this.eventParticipantBaseService = new BaseService(EventParticipant as unknown as { new (): EventParticipant } & typeof EventParticipant);
    this.companyPaypalConfigurationBaseService = new BaseService(
      CompanyPaypalConfiguration as unknown as {
        new (): CompanyPaypalConfiguration;
      } & typeof CompanyPaypalConfiguration
    );
    this.colorBaseService = new BaseService(Color as unknown as { new (): Color } & typeof Color);
  }

  /**
   * Retrieves a single event status by their name.
   * @returns A promise that resolves to the event record, or null if not found.
   */
  async getEventStatusByName(name: string): Promise<EventStatus | null> {
    return this.eventStatusBaseService.findOne({
      where: { statusName: name },
    });
  }

  /**
   * List event statuses with pagination.
   * @param limit - Number of results to return.
   * @param offset - Offset for pagination.
   * @param sortBy - Field to sort by.
   * @param sortDirection - Direction of sorting (ASC or DESC).
   * @returns A promise that resolves to a paginated list of event statuses.
   */
  async getEventStatusList(limit: number, offset: number, sortBy: string, sortDirection: string): Promise<{ rows: EventStatus[]; count: number }> {
    try {
      // Fetch event statuses with pagination and sorting
      const { count, rows } = await this.eventStatusBaseService.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]], // Sorting based on provided parameters
      });

      return { rows, count };
    } catch (error) {
      Logger.error("Error fetching event statuses:", error);
      throw error;
    }
  }

  /**
   * Creates a new event.
   * @param eventData - The data to create the event.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Event.
   */
  async generateUniqueFormattedId(existingIds: string[]): Promise<string> {
    const prefix = "conf";
    const now = new Date();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;

    const generateSuffix = () => Math.random().toString(36).substring(4, 8);

    const existingSet = new Set(existingIds);
    let newId = `${prefix}-${mmdd}-${generateSuffix()}`;

    while (existingSet.has(newId)) {
      newId = `${prefix}-${mmdd}-${generateSuffix()}`;
    }

    return newId.toUpperCase();
  }

  async createEvent(isDraft: Boolean, eventData: CreateEventDTO, userId: number): Promise<Event> {
    return this.eventBaseService.executeTransaction(async (transaction: Transaction) => {
      try {
        let moderators: number[] = [];
        moderators.push(userId);
        const userData = await this.userBaseService.findOne({
          where: { id: userId },
          include: [
            {
              model: UserCompany,
              as: "userCompanies",
            },
          ],
        });
        if (!userData) {
          const errorMessage = `user ID ${userId} does not exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
        const status = await this.eventStatusBaseService.findById(eventData.statusId);

        if (!status) {
          const errorMessage = `Status id ${eventData.statusId} is not valid`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
        const companyData = await this.companyBaseService.findOne({
          where: { id: userData?.userCompanies?.[0].companyId },
        });
        if (!companyData) {
          const errorMessage = `Company ID ${userData?.userCompanies?.[0].companyId} does not exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        const subscription = await this.subscriptionBaseService.findOne(
          {
            where: { userId: userId, statusId: enumSubscriptionStatus.ACTIVE },
            include: [
              {
                model: Plan,
                as: "plan",
              },
            ],
          },
          transaction
        );

        const conductedEventsCondition = {
          published: true,
          companyId: companyData.dataValues.id,
          parentId: { [Op.is]: null },
          createdOn: { [Op.gte]: subscription?.dataValues.startDate },
        };
        const conductedEvents = await this.eventBaseService.findAll(
          {
            where: conductedEventsCondition,
          },
          transaction
        );

        let eventAllotment;
        if (subscription?.plan?.dataValues.eventLimits) {
          eventAllotment = JSON.parse(subscription?.plan?.dataValues.eventLimits);
        }
        //Event count checking based on subscription plan
        if (subscription?.dataValues.id && conductedEvents.length >= eventAllotment.totalEvent) {
          await this.subscriptionBaseService.update(subscription?.dataValues.id, { statusId: enumSubscriptionStatus.EXPIRED }, undefined, transaction);
          const errorMessage = `Can't Create the Event; You are not subscribed or subscription expired.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        let venue: Venue | undefined = undefined;
        if (eventData.venue && Object.keys(eventData.venue).length !== 0) {
          const venueReq = {
            name: eventData.venue.name ? eventData.venue.name : "",
            address: eventData.venue.address,
            city: eventData.venue.city,
            state: eventData.venue.state,
            country: eventData.venue.country,
            postalCode: eventData.venue.postalCode,
            totalCapacity: eventData.venue.totalCapacity,
            mapUrl: eventData.venue.mapUrl,
            createdBy: userData.dataValues.id,
            modifiedBy: 0,
          };

          // Creating venue for event
          venue = await this.venueBaseService.create(venueReq, transaction);
        }

        // Checking the eventClass must be online , offline , hybrid or undefined
        let eventClass: "ONLINE" | "OFFLINE" | "HYBRID" | undefined;
        if (eventData.eventClass === "ONLINE" || eventData.eventClass === "OFFLINE" || eventData.eventClass === "HYBRID") {
          eventClass = eventData.eventClass;
        } else {
          eventClass = undefined; // Or provide a default valid value
        }

        // const stringStartTime = new Date(eventData.startTime).toISOString();
        // const stringEndTime = new Date(eventData.endTime).toISOString();
        const existingIds = await this.eventBaseService.findAll({
          attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("meetingId")), "meetingId"]],
          raw: true,
        });

        const meetingIdList: string[] = existingIds.map((row) => row.meetingId).filter((id): id is string => typeof id === "string");

        const meetingId = await this.generateUniqueFormattedId(meetingIdList);

        const req = {
          name: eventData.name ? eventData.name : "",
          title: eventData.title ? eventData.title : "",
          specialtyId: eventData.specialtyId,
          isAbstract: eventData.isAbstract,
          abstractDate: eventData.abstractDate ? new Date(eventData.abstractDate).toISOString() : undefined,
          amount: eventData.amount ? eventData.amount : 0,
          description: eventData.description,
          venueId: venue?.dataValues?.id,
          registrationDeadline: eventData.registrationDeadline ?? eventData.endTime,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          eventStartTime: eventData.eventStartTime?.toString(),
          eventEndTime: eventData.eventStartTime?.toString(),
          interval: eventData.interval,
          statusId: eventData.statusId,
          eventClass: eventClass,
          templateId: eventData.templateId,
          colorId: eventData.colorId,
          url: eventData.url,
          assetId: eventData.assetId,
          companyId: companyData.dataValues.id,
          createdBy: userData.dataValues.id,
          modifiedBy: 0,
          meetingId: meetingId,
        };

        // Create Parent Event
        const newEvent = await this.eventBaseService.create(req, transaction);

        if (eventData.contacts && Object.keys(eventData.contacts).length != 0) {
          const contactReq = eventData.contacts.map((contact) => ({
            eventId: newEvent.dataValues.id,
            phone: contact.phone ? contact.phone : "",
            email: contact.email ? contact.email : "",
            createdBy: userData.dataValues.id,
            modifiedBy: 0,
          }));
          await this.eventContactBaseService.bulkCreate(contactReq, transaction);
        }
        //Programs is not required , so if it comes in request then it will insert
        if (eventData.programs) {
          // Assuming eventData.program is an array of program objects
          for (const program of eventData.programs) {
            const programData = {
              parentId: newEvent.dataValues.id,
              name: program.name ? program.name : "",
              title: program.title ? program.title : "",
              amount: program.amount ? program.amount : 0,
              description: program.description,
              startTime: program.startTime,
              endTime: program.endTime,
              interval: program.interval,
              eventClass: eventClass,
              statusId: program.statusId,
              assetId: program.assetId,
              url: program.url,
              hall: program.hall,
              registrationDeadline: program.registrationDeadline,
              venueId: venue?.dataValues?.id,
              companyId: companyData.dataValues.id,
              createdBy: userData.dataValues.id,
              modifiedBy: 0,
            };

            // Creating a single entry for each program
            const programDetails = await this.eventBaseService.create(programData, transaction);

            // creating the seat capacity if its declared
            if (program.totalSeat) {
              const seatData = {
                eventId: programDetails.dataValues.id,
                parentEventId: newEvent.dataValues.id,
                totalSeat: program.totalSeat,
                seatAllocated: program.seatAllocated ?? 0,
                createdBy: userData.dataValues.id,
                modifiedBy: 0,
              };
              await this.eventParticipantEntryBaseService.create(seatData, transaction);
            }

            // Creating event speaker in program level
            if (program.speaker && programDetails) {
              for (const speakerData of program.speaker) {
                const speakerCheck = await this.userRoleBaseService.findOne({
                  where: { userId: speakerData.speakerId },
                });
                moderators.push(speakerData.speakerId);
                // checking the given speaker id is exist or not
                if (!speakerCheck || !speakerCheck.dataValues.roleId) {
                  const errorMessage = `Given Speaker Id is invalid.`;
                  Logger.error(errorMessage);
                  throw new Error(errorMessage);
                }

                // checking the given id is speaker or not
                const role = await this.roleBaseService.findById(speakerCheck.dataValues.roleId);
                if (role?.dataValues.roleName !== enumRoll.SPEAKER) {
                  const errorMessage = `Given Id is not a Speaker.`;
                  Logger.error(errorMessage);
                  throw new Error(errorMessage);
                }

                const speakerReq = {
                  eventId: programDetails.dataValues.id,
                  userId: speakerData.speakerId,
                  parentEventId: newEvent.dataValues.id,
                  createdBy: userId,
                  statusId: enumEventStatus.ACTIVE,
                };

                let speakerResult = await this.eventSpeakerBaseService.create(speakerReq, transaction);
                //creating an entry in speaker bio table with speaker designation
                if (speakerResult && speakerData) {
                  const speakerBioReq = {
                    eventSpeakerId: speakerResult.dataValues.id,
                    isModerator: speakerData.isModerator,
                    createdBy: userId,
                    modifiedBy: userId,
                  };
                  await this.eventSpeakerBioBaseService.create(speakerBioReq, transaction);
                }
              }
            }

            // Creating event sponsor in program level
            if (program.sponsors && programDetails) {
              const sponsorReq = program.sponsors.map((data) => ({
                eventId: programDetails.dataValues.id,
                createdBy: userId,
                parentEventId: newEvent.dataValues.id,
                sponsorId: data.sponsorId,
                sponsorTypeId: data.sponsorTypeId,
                reservedSeats: data.reservedSeats,
                modifiedBy: userId,
              }));

              // Bulk create sponsor records in a single query for better performance
              const createdSponsors = await this.eventSponsorBaseService.bulkCreate(sponsorReq, transaction);
            }
          }
        }

        //Addons is not required , so if it comes in request then it will insert
        if (eventData.addons) {
          for (const addon of eventData.addons) {
            // Create a single addon
            const createdAddon = await this.eventAddonBaseService.create(
              {
                eventId: newEvent.dataValues.id,
                addonId: addon.addonId,
                amount: addon.amount,
                startTime: addon.startTime,
                tier: addon.tier,
                companyId: companyData.dataValues.id,
                createdBy: userData.dataValues.id,
                modifiedBy: 0,
                endTime: addon.endTime,
                description: addon.description,
                statusId: enumEventAddonStatus.ACTIVE,
              },
              transaction
            );

            // Assign sponsors if available
            if (addon.sponsors) {
              const sponsorReq = addon.sponsors.map((data) => ({
                createdBy: userData.dataValues.id,
                parentEventId: newEvent.dataValues.id,
                sponsorId: data.sponsorId,
                sponsorTypeId: data.sponsorTypeId,
                eventAddonId: createdAddon.dataValues.id,
                reservedSeats: data.reservedSeats,
                modifiedBy: userData.dataValues.id,
              }));

              await this.eventSponsorBaseService.bulkCreate(sponsorReq, transaction);
            }

            // Check if addon start time exceeds event end time
            if (addon.startTime && newEvent.dataValues.endTime && addon.startTime > newEvent.dataValues.endTime) {
              throw new Error(`Invalid addon dates: Addon start time exceeds event end time.`);
            }

            // Process properties for the created addon
            if (addon.properties && addon.properties.length > 0) {
              for (const property of addon.properties) {
                const createdProperty = await this.addonPropertyBaseService.create(
                  {
                    eventAddonId: createdAddon.dataValues.id,
                    name: property.name,
                    amount: property.amount,
                    createdBy: userData.dataValues.id,
                    modifiedBy: userData.dataValues.id,
                  },
                  transaction
                );
              }
            }
            // else {
            //   // If no properties but sponsors exist, assign sponsors to the addon directly
            //   if (addon.sponsors) {
            //     const sponsorReq = addon.sponsors.map((data) => ({
            //       createdBy: userData.dataValues.id,
            //       parentEventId: newEvent.dataValues.id,
            //       sponsorId: data.sponsorId,
            //       sponsorTypeId: data.sponsorTypeId,
            //       eventAddonId: createdAddon.dataValues.id,
            //       eventAddonPropertyId: undefined, // No property, so set to null
            //       modifiedBy: userData.dataValues.id,
            //     }));

            //     await this.eventSponsorBaseService.bulkCreate(sponsorReq, transaction);
            //   }
            // }
          }
        }
        //After creating event -- moving drafted event status to DELETED
        if (!isDraft && eventData.draftId && newEvent) {
          await this.deleteDraftEvent(eventData.draftId);
        }

        for (let userId of moderators) {
          await this.metaDataBaseService.create(
            {
              url: eventData.url,
              meetingUniqueId: eventData.meetingUniqueId
  ? eventData.meetingUniqueId.replace(
      /^https:\/\/webinar\.confgo\.com\/meeting\//,
      ""
    )
  : ""
,
              userId: userId,
              eventId: newEvent.dataValues.id,
              moderator: 1,
            },
            transaction
          );
        }
        Logger.info("Event created successfully:", newEvent);
        return newEvent;
      } catch (error) {
        Logger.error("Error creating event:", error);
        throw error; // Re-throwing the error for higher-level handling
      }
    });
  }

  /**
   * List events.
   * @param eventData - The data to list event.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the list Event.
   */
  async listEvent(
    filters: EventFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: Event[]; count: number }> {
    try {
      const eventCondition: WhereOptions = {};
      const venueCondition: WhereOptions = {};
      const addonCondition: WhereOptions = {};
      //
      const isCompany = await this.userCompanyService.findOne({
        where: {
          userId: userId,
        },
      });

      let companyIds: number[] = [];
      let eventIds: number[] = [];
      if (isCompany) {
        // Fetch user's associated companies
        const userCompanies = await this.userCompanyService.findAll({
          where: { userId },
          attributes: ["companyId"],
        });
        companyIds = userCompanies.map((uc) => uc.companyId).filter((id): id is number => id !== undefined);
      } else {
        const userParticipant = await this.participantBaseService.findAll({
          where: { userId },
        });

        // fetching end user's registered programs
        for (const participate of userParticipant) {
          const programCondition = {
            participantId: participate.dataValues.id,
            eventAddonId: { [Op.is]: null },
          };

          const registeredPrograms = await this.eventParticipantBaseService.findAll({
            where: programCondition,
          });

          // Taking program id to fetch event data
          if (registeredPrograms) {
            // Use map() to extract eventId and filter out undefined values before pushing
            const ids = registeredPrograms.map((rp) => rp.eventId).filter((eventId): eventId is number => eventId !== undefined);
            eventIds = ids;
          }
        }
      }
      // Apply event filters based on provided filters object
      if (filters?.name) {
        eventCondition.name = { [Op.like]: `%${filters.name}%` };
      }
      if (Utils.isNotUndefined(filters?.id)) {
        eventCondition.id = filters.id;
      }
      if (filters?.title) {
        eventCondition.title = { [Op.like]: `%${filters.title}%` };
      }
      if (Utils.isNotUndefined(filters?.published)) {
        eventCondition.published = filters.published;
      }
      if (Utils.isNotUndefined(filters?.statusId)) {
        eventCondition.statusId = filters.statusId;
      } else {
        eventCondition.statusId = { [Op.ne]: enumEventStatus.DELETED };
      }
      if (filters?.statusName) {
        switch (filters.statusName) {
          case "ACTIVE":
            eventCondition.statusId = enumEventStatus.ACTIVE;
            eventCondition.published = false;
            break;
          case "DRAFTED":
            eventCondition.statusId = enumEventStatus.DRAFTED;
            eventCondition.published = false;
            break;
          case "PUBLISHED":
            eventCondition.published = true;
            break;
          case "EXPIRED":
            eventCondition.statusId = enumEventStatus.EXPIRED;
            eventCondition.published = false;
            break;
          default:
            break; // No action for unknown status
        }
      }
      if (Utils.isNotUndefined(filters?.templateId)) {
        eventCondition.templateId = filters.templateId;
      }
      if (Utils.isNotUndefined(filters?.amount)) {
        eventCondition.amount = { [Op.lte]: filters.amount };
      }
      if (filters?.eventClass) {
        eventCondition.eventClass = { [Op.like]: `%${filters.eventClass}%` };
      }
      if (filters?.startTime && filters?.endTime) {
        eventCondition.startTime = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
        eventCondition.endTime = {
          [Op.gte]: new Date(filters.startTime),
        };
      } else if (filters?.startTime) {
        eventCondition.startTime = { [Op.gte]: new Date(filters.startTime) };
      } else if (filters?.endTime) {
        eventCondition.endTime = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
      }
      if (filters?.city) {
        venueCondition.city = { [Op.like]: `%${filters.city}%` };
      }
      if (filters?.state) {
        venueCondition.state = { [Op.like]: `%${filters.state}%` };
      }
      if (filters?.addonName) {
        addonCondition.name = { [Op.like]: `%${filters.addonName}%` };
      }
      if (companyIds.length > 0) {
        eventCondition.companyId = { [Op.in]: companyIds };
      } else if (eventIds.length > 0) {
        eventCondition.id = filters.id ?? { [Op.in]: eventIds };
      } else {
        return { rows: [], count: 0 };
      }

      // Fetch parent events that match the condition
      const matchingParentEvents = await this.eventBaseService.findAll({
        where: { ...eventCondition },
        include: [
          {
            model: Venue,
            as: "venue",
            where: venueCondition,
            required: false,
          },
          {
            model: EventAddon,
            as: "eventAddons",
            required: false,
            include: [
              {
                model: Addon,
                as: "addon",
                where: addonCondition,
                required: false,
              },
            ],
          },
        ],
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      // Collect parent IDs from matched child events
      const childParentIds = matchingParentEvents.map((event) => event.parentId).filter((parentId): parentId is number => parentId !== null);

      const mainParentIds = matchingParentEvents.map((event) => event.id).filter((_, index) => matchingParentEvents[index].parentId === null);

      const parentIds = [...childParentIds, ...mainParentIds];

      const whereClause = {
        id: { [Op.in]: parentIds },
        parentId: { [Op.is]: null },
      } as WhereOptions<Event>;

      // Fetch parent events based on collected parent IDs
      const parentEvents = await this.eventBaseService.findAll({
        where: whereClause,
        include: [
          {
            model: Venue,
            as: "venue",
            required: false,
          },
          {
            model: Company,
            as: "company",
            attributes: ["id"],
            include: [
              {
                model: CompanyPaypalConfiguration,
                as: "companyPaypalConfigurations",
                required: false,
                attributes: {
                  exclude: ["createdBy", "createdOn", "modifiedBy", "modifiedOn"],
                },
              },
            ],
          },
          {
            model: EventAddon,
            as: "eventAddons",
            required: false,
            include: [
              {
                model: Addon,
                as: "addon",
                required: false,
              },
            ],
          },
          {
            model: Template,
            as: "template",
            required: false,
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
      });

      // Combine unique matching parent events and child-parent matched events
      const combinedEvents = parentEvents.filter((event, index, self) => index === self.findIndex((e) => e.id === event.id));

      return { rows: combinedEvents, count: mainParentIds.length };
    } catch (error) {
      Logger.error("Error listing events:", error);
      throw error;
    }
  }

  /**
   * Retrieves the detailed information of an event by its ID, including the event's parent details,
   * associated programs (sub-events), addons, venue, and status.
   *
   * The function fetches the parent event, its sub-events (programs), and any associated addons.
   * If the event has a venue and status, these are also included in the result.
   *
   * @param {number} eventId - The ID of the event to retrieve details for.
   * @returns A promise that resolves to an object containing the event details, programs, addons, venue, and status.
   *
   * @throws Will throw an error if the event details cannot be retrieved or if there is a database error.
   */
  async getEventDetailById(
    eventId: number,
    transaction?: Transaction
  ): Promise<{
    event: Event | null;
    programs: Event[];
    addons: EventAddon[];
    eventPriceTier?: EventPriceTier[];
    venue?: Venue;
    assetName?: string;
    availableSeats?: number;
    registeredParticipants?: number;
    programCheckins?: ProgramCheckinDTO[];
    status?: EventStatus;
    speciality: Specialty;
    eventSpeakers?: EventSpeaker[];
    eventSponsors?: EventSponsor[];
    addonCounts?: AddonCountDTO[];
    eventCapacity?: EventParticipantEntry[];
    template?: Template;
    eventContacts?: EventContact[];
    eventImages?: EventImages[];
  }> {
    try {
      const exclude = ["modifiedOn", "modifiedBy", "createdBy", "createdOn"];
      const eventParent = await this.eventBaseService.findById(
        eventId,
        {
          include: [
            {
              model: Venue,
              as: "venue",
              required: false,
              attributes: {
                exclude,
              },
            },
            {
              model: Company,
              as: "company",
              required: false,
              attributes: {
                exclude,
              },
              include: [
                {
                  model: CompanyPaypalConfiguration,
                  as: "companyPaypalConfigurations",
                  required: false,
                  attributes: {
                    exclude: ["createdBy", "createdOn", "modifiedBy", "modifiedOn"],
                  },
                },
              ],
            },
            {
              model: Asset,
              as: "asset",
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: EventStatus,
              as: "status",
              attributes: {
                exclude,
              },
            },
            {
              model: Specialty,
              as: "specialty",
              attributes: {
                exclude,
              },
            },
            {
              model: EventPriceTier,
              as: "eventPriceTiers",
              attributes: {
                exclude,
              },
              include: [
                {
                  model: ParticipantType,
                  as: "participantType",
                  required: true,
                  attributes: {
                    exclude,
                  },
                },
              ],
            },
            {
              model: EventSpeaker,
              as: "eventSpeakers",
              required: false,
              where: { statusId: enumEventProgramSchedulerStatus.ACTIVE },
              attributes: {
                exclude,
              },
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: {
                    exclude,
                  },
                },
                {
                  model: SpeakerBio,
                  as: "speakerBios",
                  required: false,
                  attributes: {
                    exclude,
                  },
                },
              ],
            },
            {
              model: EventContact,
              as: "eventContacts",
              required: false,
              attributes: {
                exclude,
              },
            },
            {
              model: EventImages,
              as: "eventImages",
              required: false,
              attributes: {
                exclude,
              },
            },
            {
              model: Color,
              as: "color",
              required: false,
              attributes: {
                exclude,
              },
            },
          ],
          attributes: {
            exclude,
          },
        },
        transaction
      );

      if (!eventParent) {
        const errorMessage = `Event ID ${eventId} does not exist.`;
        throw new Error(errorMessage);
      }
      const eventChildren = await this.eventBaseService.findAll(
        {
          where: { statusId: { [Op.ne]: 2 }, parentId: eventId },
          include: [
            {
              model: EventStatus,
              as: "status",
              attributes: {
                exclude,
              },
            },
            {
              model: EventParticipantEntry,
              as: "eventParticipantEntries",
              attributes: ["totalSeat", "seatAllocated", "participantTypeId"],
              include: [
                {
                  model: ParticipantType,
                  as: "participantType",
                  attributes: {
                    exclude,
                  },
                },
              ],
            },
            {
              model: EventSpeaker,
              as: "eventSpeakers",
              where: { statusId: enumEventProgramSchedulerStatus.ACTIVE },
              attributes: {
                exclude,
              },
              required: false,
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: {
                    exclude,
                  },
                },
                {
                  model: SpeakerBio,
                  as: "speakerBios",
                  attributes: {
                    exclude,
                  },
                },
              ],
            },
            {
              model: EventSponsor,
              as: "eventSponsors",
              where: {
                statusId: enumSponsorStatus.ACTIVE,
              },
              attributes: {
                exclude,
              },
              required: false,
              include: [
                {
                  model: Sponsor,
                  as: "sponsor",
                  where: {
                    statusId: enumSponsorStatus.ACTIVE,
                  },
                  attributes: {
                    exclude,
                  },
                  required: false,
                },
                {
                  model: SponsorType,
                  as: "sponsorType",
                  attributes: {
                    exclude,
                  },
                  required: false,
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

      const eventAddons = await eventParent?.getEventAddons({
        include: [
          {
            model: Addon,
            as: "addon",
            required: false,
            attributes: {
              exclude,
            },
          },
          {
            model: EventAddonProperty,
            as: "eventAddonProperties",
            attributes: {
              exclude,
            },
          },
          {
            model: EventSponsor,
            as: "eventSponsors",
            where: {
              statusId: enumSponsorStatus.ACTIVE,
            },
            attributes: {
              exclude,
            },
            required: false,
            include: [
              {
                model: Sponsor,
                as: "sponsor",
                where: {
                  statusId: enumSponsorStatus.ACTIVE,
                },
                attributes: {
                  exclude,
                },
                required: false,
              },
              {
                model: SponsorType,
                as: "sponsorType",
                attributes: {
                  exclude,
                },
                required: false,
              },
            ],
          },
        ],
        attributes: {
          exclude,
        },
      });

      const eventTemplate = await eventParent?.getTemplate();

      const eventParticipantEntry = await this.eventParticipantEntryBaseService.findAll({
        where: { parentEventId: eventId },
        attributes: {
          exclude,
        },
      });

      //fetching Event speakers
      const eventSpeakers = await this.eventSpeakerBaseService.findAll(
        {
          where: { parentEventId: eventId, statusId: 1 },
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude,
              },
            },
            {
              model: SpeakerBio,
              as: "speakerBios",
              required: false,
              attributes: {
                exclude,
              },
            },
          ],
          attributes: {
            exclude,
          },
        },
        transaction
      );
      //fetching Event sposors
      const eventSponsors = await this.eventSponsorBaseService.findAll(
        {
          where: { parentEventId: eventId, statusId: 1 },
          include: [
            {
              model: Sponsor,
              as: "sponsor",
              attributes: {
                exclude,
              },
              required: false,
            },
            {
              model: SponsorType,
              as: "sponsorType",
              attributes: {
                exclude,
              },
              required: false,
            },
          ],
          attributes: {
            exclude,
          },
        },
        transaction
      );

      const participants = await this.participantBaseService.findAll({ where: { eventId } });
      const addonDetails = await this.addonCountByEventId(eventId);

      const programCheckins = [];

      for (const program of eventChildren) {
        const attendees = await this.attendeeBaseService.findAll({
          where: { eventId: program.dataValues.id, isDeleted: 0 },
        });

        const registrations = await this.eventParticipantBaseService.findAll({
          where: { eventId: program.dataValues.id },
        });

        programCheckins.push({
          eventId: program.dataValues.id,
          checkins: attendees.length ?? 0,
          registrations: registrations.length ?? 0,
        });
      }

      // fetching available seats based on plan  rule
      const seatLimit = await this.eventAvailableSeatsCount(eventParent.dataValues.id, transaction);
      const availableSeats = seatLimit - participants.length;
      return {
        addons: eventAddons ?? [],
        event: eventParent,
        programs: eventChildren ?? [],
        eventPriceTier: eventParent?.eventPriceTiers,
        status: eventParent?.status,
        venue: eventParent?.venue,
        assetName: eventParent?.asset?.dataValues?.name,
        availableSeats: availableSeats,
        registeredParticipants: participants.length || 0,
        programCheckins: programCheckins,
        speciality: eventParent?.specialty,
        eventSpeakers: eventSpeakers ?? [],
        eventSponsors: eventSponsors ?? [],
        addonCounts: addonDetails ?? [],
        template: eventTemplate ?? undefined,
        eventCapacity: eventParticipantEntry ?? [],
        eventContacts: eventParent?.eventContacts,
        eventImages: eventParent?.eventImages,
      };
    } catch (error) {
      Logger.error("Error getEventDetailById:", error);
      throw error;
    }
  }

  /**
   * Creates a new event registration form.
   * This method performs several checks to ensure the user is associated with a company,
   * the event exists, and the participant type is valid before creating the registration form.
   *
   * @param {number} userId - The ID of the user creating the registration form.
   * @param {CreateEventRegistrationFormsRequestDTO} regFormsReq - The data for the registration form.
   * @param {Transaction} transaction - Optional transaction object for database consistency during the creation process
   * @returns {Promise<EventRegistrationForm>} - Returns the created EventRegistrationForm.
   *
   * @throws {Error} - Throws an error if the company, event, or participant type is not found
   */
  async createEventRegistrationForm(
    userId: number,
    regFormsReq: CreateEventRegistrationFormsRequestDTO,
    transaction?: Transaction
  ): Promise<EventRegistrationForm[]> {
    const createdForms: EventRegistrationForm[] = [];

    try {
      // Fetch the company associated with the given userId
      const companyResp = await this.companyBaseService.findOne(
        {
          include: {
            model: UserCompany,
            as: "userCompanies",
            where: { userId },
          },
        },
        transaction
      );
      if (!companyResp) {
        throw new Error(`Company not found for user ID ${userId}`);
      }

      // Fetch the event associated with the given eventId and the user's company
      const eventResp = await this.eventBaseService.findById(regFormsReq.eventId, { where: { companyId: companyResp.dataValues.id } }, transaction);
      if (!eventResp) {
        throw new Error(`Event with ID ${regFormsReq.eventId} not found`);
      }

      // Prepare an array of registration form requests
      const formRequests: FormRequestDTO[] = [];

      // Iterate over the formData array to process and create registration forms
      for (const formData of regFormsReq.formData) {
        for (const registrationData of formData.data) {
          // Get participant type IDs based on formData and event data
          const participantTypeIds = await this.getOrCreateParticipantType(formData, regFormsReq, userId);

          if (participantTypeIds.length == 0 || participantTypeIds.length > 1) {
            formRequests.push({
              name: registrationData.name ?? "",
              metadata: registrationData.metadata,
              eventId: regFormsReq.eventId,
              createdBy: userId,
              modifiedBy: 0,
            });
          } else {
            // For each participantTypeId, construct a request for creating a new event registration form
            participantTypeIds.forEach((participantTypeId) => {
              formRequests.push({
                name: registrationData.name ?? "",
                metadata: registrationData.metadata,
                eventId: regFormsReq.eventId,
                participantTypeId: participantTypeId,
                createdBy: userId,
                modifiedBy: 0,
              });
            });
          }
        }
      }

      // Bulk create all registration forms in the database
      const newForms = await this.eventRegistrationFormBaseService.bulkCreate(formRequests, transaction);

      // Add the newly created forms to the results array
      createdForms.push(...newForms);

      return createdForms;
    } catch (error) {
      Logger.error("Error createEventRegistrationForm", error);
      throw error;
    }
  }

  /**
   * Fetches the participant types for an event or creates a new participant type if none exist.
   *
   * This function checks if a participant type already exists for the specified event. If a `participantTypeId` is provided in the form data, it returns that participant type.
   * If no `participantTypeId` is provided or if the event has no participant types, it creates a default participant type (e.g., "General").
   *
   * @param regFormsReq - The registration form request object, containing event-related data (e.g., eventId).
   * @param formData - The form data containing optional participantTypeId, to decide which participant type to fetch or create.
   * @param userId - The ID of the user performing the action, used for audit purposes (e.g., createdBy, modifiedBy).
   * @param transaction - An optional transaction object to ensure that database operations are performed within a transactional context.
   *
   * @returns A promise that resolves to an array of participant type IDs for the event.
   */

  async getOrCreateParticipantType(
    formData: FormDataDTO,
    regFormsReq: CreateEventRegistrationFormsRequestDTO,
    userId: number,
    transaction?: Transaction
  ): Promise<number[]> {
    try {
      // Fetch participant types for the event (using the existing eventId)
      const participantTypes = await this.participantTypeBaseService.findAll({
        where: { eventId: regFormsReq.eventId },
        transaction, // Ensure the transaction is passed here
      });

      let participantTypeIds: number[] = [];

      // If participantTypeId is provided in the request, use it
      if (formData.participantTypeId) {
        const matchingParticipantType = await this.participantTypeBaseService.findAll({
          where: { id: formData.participantTypeId },
          transaction, // Ensure the transaction is passed here
        });
        if (matchingParticipantType.length > 0) {
          participantTypeIds = matchingParticipantType.map((pt) => pt.dataValues.id);
        }
      }
      // If no participantTypeId is provided, use the existing ones from the event
      else if (participantTypes.length > 0) {
        participantTypeIds = participantTypes.map((pt) => pt.dataValues.id);
      }

      return participantTypeIds;
    } catch (error) {
      Logger.error("Error in getOrCreateParticipantType", error);
      throw error; // Re-throw error for further handling in the calling function
    }
  }

  /**
   * Retrieves all event registration forms for a specified event ID.
   * Queries the database for all registration forms associated with the given event.
   *
   * @param eventId - The ID of the event for which registration forms are to be retrieved
   * @returns Promise<EventRegistrationForm[] | null> - An array of event registration forms or null if none found
   *
   * @throws Error - Logs and rethrows any error encountered during the database query
   */
  async getEventRegistrationForms(eventId: number, transaction?: Transaction): Promise<EventRegistrationForm[] | null> {
    try {
      return this.eventRegistrationFormBaseService.findAll(
        {
          where: {
            eventId: eventId,
          },
          order: [["id", "ASC"]],
        },
        transaction
      );
    } catch (error) {
      Logger.error("Error getEventRegistrationForms", error);
      throw error;
    }
  }

  /**
   * Deletes all event registration forms associated with a specified event ID.
   *
   * This method executes a custom SQL delete query to remove all registration forms
   * linked to the provided event ID. Optionally, it can use a transaction to ensure
   * database operation consistency.
   *
   * @param eventId - The ID of the event whose registration forms are to be deleted
   * @param transaction - Optional transaction object for managing database operations
   *                     consistently across multiple queries (default is undefined)
   *
   * @returns Promise<[number, EventRegistrationForm[] | undefined]> -
   *          An array where the first element is the number of records deleted,
   *          and the second element is an array of the deleted event registration forms,
   *          if any were found and deleted
   */
  async deleteEventRegistrationFormsByEventId(eventId: number, transaction?: Transaction): Promise<EventRegistrationForm[] | undefined> {
    try {
      const sql = "DELETE FROM event_registration_form WHERE event_id = :eventId";
      const replacements = { eventId };
      return await this.eventRegistrationFormBaseService.executeCustomQuery(sql, replacements, QueryTypes.DELETE, transaction);
    } catch (error) {
      Logger.error("Error deleteEventRegistrationFormsByEventId", error);
      throw error;
    }
  }

  /**
   * Updates the slug name for an event with a specified ID if:
   *  - The slug name is not already in use by another event.
   *  - The event ID represents a parent event (i.e., has a null `parentId`).
   * @param id - The ID of the event to update.
   * @param slugName - The new slug name to be assigned to the event.
   * @returns A tuple containing the number of rows affected and the updated event data.
   * @throws Error if the slugName is already in use or if the event ID is not a parent event.
   */
  async updateSlugName(id: number, slugName: string): Promise<[number, Event[] | undefined] | string> {
    try {
      // Check if the provided slugName is already in use by another event.
      const existingEvent = await this.eventBaseService.findOne({
        where: {
          slugName,
        },
      });
      if (existingEvent) {
        if (existingEvent.dataValues.id === id) {
          return "SlugName is available for this event";
        } else {
          throw new Error("The provided slugName is already in use by event.");
        }
      }
      // Check if the event with the provided ID has a null parentId
      const whereClause = {
        id,
        parentId: { [Op.is]: null },
      } as WhereOptions<Event>; // Explicit cast to satisfy TypeScript

      const eventToUpdate = await this.eventBaseService.findOne({
        where: whereClause,
      });

      if (!eventToUpdate) {
        const errorMessage = "The event cannot be updated because the given id is not a parent";
        Logger.error(errorMessage); // Log the error message
        throw new Error(errorMessage); // Throw the error
      }
      // Perform the update if all conditions are met.
      const data = await this.eventBaseService.update(id, { slugName });
      return data;
    } catch (error) {
      Logger.error("Error updateSlugName:", error);
      throw error;
    }
  }

  /**
   * Retrieves an event by its ID. Throws an error if the event is not found.
   *
   * @param id - The unique identifier of the event to retrieve.
   * @returns The event object if found.
   * @throws Error if the event with the given ID does not exist.
   */
  async getEventOrThrow(id: number, transaction?: Transaction): Promise<Event> {
    const event = await this.eventBaseService.findById(id, undefined, transaction);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  /**
   * Updates the publication status of an event.
   *
   * @param eventId - The ID of the event to update.
   * @param publish - The new publication status (true for published, false for unpublished).
   * @param transaction - Optional transaction object for managing database operations consistently.
   * @returns A promise that resolves to an array containing the number of affected rows and the updated event data.
   * @throws Error if the event does not exist or if its status is not active.
   */
  async updateIsPublished(userId: number, eventId: number, publish: number, transaction?: Transaction): Promise<[number, Event[] | undefined]> {
    try {
      const event = await this.eventBaseService.findOne(
        {
          where: { id: eventId },
        },
        transaction
      );
      // Check if the event exists and if its status is active.
      if (!event || event.statusId === enumEventStatus.INACTIVE || event.statusId === enumEventStatus.COMPLETED) {
        const errorMessage = "Only events with an active status can be published. The requested event either does not exist, inactive or already published";
        Logger.error(errorMessage); // Log the error message
        throw new Error(errorMessage); // Throw the error
      }
      //throwing error when the event end time is over
      if (!event.dataValues.endTime || new Date(event.dataValues.endTime) < new Date()) {
        const errorMessage = `The Event Has already Ended.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // checking the event's programs are in future
      const programs = await this.eventBaseService.findAll({
        where: { parentId: event.dataValues.id },
      });

      if (programs) {
        for (const program of programs) {
          if (program.dataValues.endTime && new Date(program.dataValues.endTime) < new Date()) {
            const errorMessage = `The Event's Program is already Ended.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
        }
      }

      //Checking the user subscription payment done or not
      const subscription = await this.subscriptionBaseService.findOne({
        where: {
          userId: userId,
          statusId: enumSubscriptionStatus.ACTIVE,
          endDate: {
            [Op.gt]: new Date(), // Ensures endDate is greater than today
          },
        },
      });
      if (subscription?.dataValues.statusId !== enumSubscriptionStatus.ACTIVE) {
        const errorMessage = `Can't Publish the event, Complete the Subscription Payment.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Checking the company has paypal configuration
      const paypalConfig = await this.companyPaypalConfigurationBaseService.findOne({
        where: { companyId: event.dataValues.companyId },
      });
      if (!paypalConfig) {
        const errorMessage = `The company does not have a PayPal configuration. You can only publish after creating a configuration.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Check if the current publication status is the same as the requested update.
      if (event.published === publish) {
        const errorMessage = `The event is already set to ${publish ? "published" : "unpublished"}. No changes required.`;
        Logger.error(errorMessage); // Log the error message
        throw new Error(errorMessage);
      }

      // Proceed to update the event with the new publication status.
      const updateData = { published: publish };
      const whereOptions = {
        [Op.or]: [{ id: eventId }, { parentId: eventId }],
      };
      const data = await this.eventBaseService.updateCustom(updateData, whereOptions, undefined, transaction);
      return data;
    } catch (error) {
      Logger.error("Error updateIsPublished:", error);
      throw error;
    }
  }

  /**
   * Retrieves an event by its slug name.
   *
   * @param slugName - The slug name of the event to retrieve.
   * @returns A promise that resolves to the event object if found, or null if not found.
   */
  async getEventBySlugName(slugName: string, eventId?: number, transaction?: Transaction): Promise<Event | null> {
    try {
      let event;
      const slugCheck = await this.eventBaseService.findOne({
        where: { slugName: slugName },
        transaction,
      });
      if (eventId && slugCheck?.dataValues.id === eventId) {
        event = null;
      } else {
        event = slugCheck;
      }

      return event;
    } catch (error) {
      Logger.error("Error getEventBySlugName:", error);
      throw error;
    }
  }

  /**
   * Generates a unique slug name for an event.
   *
   * @param eventId - The ID of the event for which to generate the slug name.
   * @returns A promise that resolves to a unique slug name.
   */
  async genaerateEventSlugName(eventId: number): Promise<string> {
    try {
      const eventData = await this.eventBaseService.findById(eventId);
      if (!eventData) {
        throw new Error("Event not found");
      }
      // Generate the initial slug name using the first 4 characters of the event name.
      const baseSlug = eventData.name
        .slice(0, 4)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      const remainingLength = 12 - baseSlug.length - 1;
      let slugName =
        `${baseSlug}-` +
        Math.random()
          .toString(36)
          .substring(2, 2 + remainingLength);

      // Ensure the slug name is unique by checking the database.
      let isUnique = await this.eventBaseService.findOne({
        where: { slugName },
      });
      while (isUnique) {
        // If not unique, generate a new dynamic part until uniqueness is ensured.
        slugName =
          `${baseSlug}-` +
          Math.random()
            .toString(36)
            .substring(2, 2 + remainingLength);
        isUnique = await this.eventBaseService.findOne({ where: { slugName } });
      }
      return slugName;
    } catch (error) {
      Logger.error("Error genaerateEventSlugName:", error);
      throw error;
    }
  }
  /**
   * Update a event.
   * @param eventData - The data to update the event.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the created Event.
   */
  async updateEvent(eventData: UpdateEventDTO, userId: number, eventId: number, transaction: Transaction): Promise<[number, Event[] | undefined]> {
    try {
      //checking the event is exist or not.
      const eventCheck = await this.eventBaseService.findById(eventId, undefined, transaction);
      if (!eventCheck) {
        const errorMessage = `Invalid Event Id: ${eventId}`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // If the event status is 'EXPIRED', it cannot be updated
      if (eventCheck.dataValues.statusId === enumEventStatus.EXPIRED) {
        const errorMessage = `The event is either expired or already completed, so this event cannot be updated.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // if request have venue details then update or insert the venue.
      let venue;
      if (eventData.venue && eventData.venue.name) {
        const venueReq = {
          id: eventCheck.dataValues.venueId,
          name: eventData.venue.name,
          address: eventData.venue.address,
          city: eventData.venue.city,
          state: eventData.venue.state,
          country: eventData.venue.country,
          postalCode: eventData.venue.postalCode,
          mapUrl: eventData.venue.mapUrl,
          createdBy: eventCheck.dataValues.createdBy,
          modifiedBy: userId,
        };

        // Updating venue for event
        venue = await this.venueBaseService.upsert(venueReq, transaction);
      }

      // updating event seat capacity if its in request
      if (eventData.totalSeat && eventCheck.dataValues.parentId) {
        const existingCapacity = await this.eventParticipantEntryBaseService.findOne({ where: { eventId: eventCheck.dataValues.id } });
        const capacityReq = {
          id: existingCapacity?.dataValues.id,
          eventId: eventCheck.dataValues.id,
          parentEventId: eventCheck.dataValues.parentId,
          totalSeat: eventData.totalSeat,
          seatAllocated: eventData.seatAllocated ?? 0,
          participantTypeId: eventData.participantTypeId,
          createdBy: userId,
          modifiedBy: userId,
        };

        await this.eventParticipantEntryBaseService.upsert(capacityReq, transaction);
      }

      const eventReq = {
        name: eventData.name,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        eventStartTime: eventData.eventStartTime,
        eventEndTime: eventData.eventEndTime,
        slugName: eventData.slugName,
        specialtyId: eventData.specialtyId,
        hall: eventData.hall,
        isAbstract: eventData.isAbstract,
        abstractDate: eventData.abstractDate,
        assetId: eventData.assetId,
        eventClass: eventData.eventClass as enumEventClass,
        modifiedBy: userId,
        statusId: enumEventStatus.ACTIVE,
        venueId: venue ? venue[0].dataValues.id : undefined,
        amount: eventData.amount,
        url: eventData.url,
      };

      //updating the event
      const event = await this.eventBaseService.update(eventId, eventReq, undefined, transaction);

      // Deleting the venue details in event, if the event class changing to online
      if (eventCheck.dataValues.venueId && eventReq.eventClass == enumEventClass.ONLINE) {
        await this.venueBaseService.deleteCustom({ id: eventCheck.dataValues.venueId }, undefined, transaction);
      }

      //delete the existing contacts and add new contacts in EventContact
      if (eventData.contacts) {
        await this.eventContactBaseService.deleteCustom({ eventId }, undefined, transaction);
        const contactReq: UpdateContactDTO[] = eventData.contacts.map((contact) => ({
          eventId,
          phone: contact.phone,
          email: contact.email,
          createdBy: userId,
          modifiedBy: userId,
        }));
        await this.eventContactBaseService.bulkCreate(contactReq, transaction);
      }

      //Event Program Speaker update
      await this.updateEventSpeakers(eventData, eventId, eventCheck, userId, transaction);

      //Event Program Sponsor update
      await this.updateEventSponsors(eventData, eventId, eventCheck, userId, transaction);

      return event;
    } catch (error) {
      Logger.error("Error in update Event Details:", error);
      throw error;
    }
  }

  /**
   * Update Event Speaker
   * @param eventData
   * @param eventId
   * @param eventCheck
   * @param userId
   * @param transaction
   */
  private async updateEventSpeakers(eventData: UpdateEventDTO, eventId: number, eventCheck: any, userId: number, transaction: Transaction) {
    if (eventData.speakers) {
      for (const speakerData of eventData.speakers) {
        await this.validateSpeaker(speakerData.speakerId);
        const existingSpeaker = await this.eventSpeakerBaseService.findOne({
          where: { eventId, userId: speakerData.speakerId, statusId: enumEventStatus.ACTIVE },
        });
        const speakerReq = {
          id: existingSpeaker?.dataValues.id,
          eventId,
          userId: speakerData.speakerId,
          parentEventId: eventCheck.dataValues.parentId,
          createdBy: userId,
          statusId: enumEventStatus.ACTIVE,
        };
        const speakerResult = await this.eventSpeakerBaseService.upsert(speakerReq, transaction);
        if (speakerResult && speakerData.isModerator) {
          if (speakerData.isModerator) {
            const moderatorData = await this.eventSpeakerBaseService.findOne({
              where: { eventId: eventId, statusId: enumEventStatus.ACTIVE }, // Condition for filtering the event
              include: [
                {
                  model: SpeakerBio,
                  as: "speakerBios",
                  where: { isModerator: 1 },
                  required: true,
                },
              ],
            });
            if (moderatorData) {
              // Update all existing moderators for the same eventSpeakerId to isModerator: false
              await this.eventSpeakerBioBaseService.updateCustom(
                { isModerator: 0 },
                { eventSpeakerId: moderatorData?.dataValues.id, isModerator: true },
                undefined,
                transaction
              );
            }
          }
          const existingSpeakerBio = await this.eventSpeakerBioBaseService.findOne({
            where: { eventSpeakerId: speakerResult[0].dataValues.id },
          });
          const speakerBioReq = {
            id: existingSpeakerBio?.dataValues.id,
            eventSpeakerId: speakerResult[0].dataValues.id,
            isModerator: speakerData.isModerator,
            createdBy: userId,
            modifiedBy: userId,
          };
          await this.eventSpeakerBioBaseService.upsert(speakerBioReq, transaction);
        }
      }
    }
  }
  /**
   * Update Event Sponser
   * @param eventData
   * @param eventId
   * @param eventCheck
   * @param userId
   * @param transaction
   */
  private async updateEventSponsors(eventData: UpdateEventDTO, eventId: number, eventCheck: any, userId: number, transaction: Transaction) {
    if (eventData.sponsors) {
      for (const speakerData of eventData.sponsors) {
        await this.validateSponsor(speakerData.sponsorId);
        const req = {
          eventId,
          sponsorId: speakerData.sponsorId,
          sponsorTypeId: speakerData.sponsorTypeId,
          parentEventId: eventCheck.dataValues.parentId,
          createdBy: userId,
          statusId: enumEventStatus.ACTIVE,
        };
        const speakerResult = await this.eventSponsorBaseService.create(req, transaction);
      }
    }
  }
  /**
   * Method to validate event speaker
   * @param speakerId
   * @returns
   */
  private async validateSpeaker(speakerId: number) {
    const speakerCheck = await this.userRoleBaseService.findOne({ where: { userId: speakerId } });
    if (!speakerCheck || !speakerCheck.dataValues.roleId) {
      throw new Error(`Given Speaker Id is invalid.`);
    }
    const role = await this.roleBaseService.findById(speakerCheck.dataValues.roleId);
    if (role?.dataValues.roleName !== enumRoll.SPEAKER) {
      throw new Error(`Given Id is not a Speaker.`);
    }
    return { speakerCheck, role };
  }

  /**
   * Method to validate event speaker
   * @param speakerId
   * @returns
   */
  private async validateSponsor(speakerId: number) {
    const sponsorCheck = await this.sponsorBaseService.findOne({ where: { id: speakerId } });
    if (!sponsorCheck) {
      throw new Error(`Given Sponsor Id is invalid.`);
    }

    return { sponsorCheck };
  }
  /**
   * Add a single program into the event table
   * @param eventData datas in addProgram DTO
   * @param userId
   * @returns
   */
  async addProgram(eventData: AddProgramDTO, userId: number): Promise<Event> {
    return this.eventBaseService.executeTransaction(async (transaction: Transaction) => {
      try {
        const userData = await this.userBaseService.findOne({
          where: { id: userId },
          include: [
            {
              model: UserCompany,
              as: "userCompanies",
            },
          ],
        });
        const companyData = await this.companyBaseService.findOne({
          where: { id: userData?.userCompanies?.[0].companyId },
        });
        if (!companyData) {
          const errorMessage = `Company ID ${userData?.userCompanies?.[0].id} does not exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }
        const companyId = companyData.id;
        const data = await this.eventBaseService.findById(eventData.parentEventId);
        const venueId = data?.venueId;

        const req = {
          parentId: eventData.parentEventId,
          name: eventData.name,
          description: eventData.description,
          startTime: eventData.startTime,
          hall: eventData.hall,
          endTime: eventData.endTime,
          venueId: venueId,
          companyId: companyId,
          amount: eventData.amount,
          statusId: enumEventStatus.ACTIVE,
          createdBy: userId,
          modifiedBy: userId,
        };
        const result = await this.eventBaseService.create(req, transaction);

        //creating seat capacity
        if (eventData.totalSeat) {
          const capacityReq = {
            eventId: result.dataValues.id,
            parentEventId: eventData.parentEventId,
            totalSeat: eventData.totalSeat,
            seatAllocated: eventData.seatAllocated ?? 0,
            createdBy: userId,
            modifiedBy: 0,
          };
          await this.eventParticipantEntryBaseService.create(capacityReq, transaction);
        }

        // Creating event speaker in program level
        if (eventData.speakers && result) {
          for (const speakerData of eventData.speakers) {
            const speakerCheck = await this.userRoleBaseService.findOne({
              where: { userId: speakerData.speakerId },
            });

            // checking the given speaker id is exist or not
            if (!speakerCheck || !speakerCheck.dataValues.roleId) {
              const errorMessage = `Given Speaker Id is invalid.`;
              Logger.error(errorMessage);
              throw new Error(errorMessage);
            }

            // checking the given id is speaker or not
            const role = await this.roleBaseService.findById(speakerCheck.dataValues.roleId);
            if (role?.dataValues.roleName !== enumRoll.SPEAKER) {
              const errorMessage = `Given Id is not a Speaker.`;
              Logger.error(errorMessage);
              throw new Error(errorMessage);
            }

            const speakerReq = {
              eventId: result.dataValues.id,
              userId: speakerData.speakerId,
              parentEventId: result.dataValues.parentId,
              createdBy: userId,
              statusId: enumEventStatus.ACTIVE,
            };

            let speakerResult = await this.eventSpeakerBaseService.create(speakerReq, transaction);
            //creating an entry in speaker bio table with speaker designation
            if (speakerResult && speakerData) {
              // Create a new entry for the speaker
              const speakerBioReq = {
                eventSpeakerId: speakerResult.dataValues.id,
                isModerator: speakerData.isModerator,
                createdBy: userId,
                modifiedBy: userId,
              };
              await this.eventSpeakerBioBaseService.create(speakerBioReq, transaction);
            }
          }
        }

        // Creating event sponsor in program level
        if (eventData.sponsors && result) {
          const sponsorReq = eventData.sponsors.map((data) => ({
            eventId: result.dataValues.id,
            createdBy: userId,
            parentEventId: result.dataValues.parentId,
            sponsorId: data.sponsorId,
            sponsorTypeId: data.sponsorTypeId,
            reservedSeats: data.reservedSeats,
            modifiedBy: userId,
          }));

          // Bulk create sponsor records in a single query for better performance
          const createdSponsors = await this.eventSponsorBaseService.bulkCreate(sponsorReq, transaction);
        }
        Logger.info("Program added successfully:", result);
        return result;
      } catch (error) {
        Logger.error("Error adding program:", error);
        throw error;
      }
    });
  }

  /**
   * Adds a single addon to an event with optional properties.
   *
   * @param addonData - Data for the addon being added, including event ID, addon ID, amount, tier, and properties.
   * @param userId - ID of the user creating the addon.
   * @returns A Promise that resolves to the created Addon object.
   */
  async addSingleEventAddon(addonData: AddEventAddonDTO, userId: number, transaction?: Transaction): Promise<EventAddon[]> {
    return this.addonBaseService.executeTransaction(async (transaction: Transaction) => {
      try {
        // Get user company data
        const userData = await this.userBaseService.findOne(
          {
            where: { id: userId },
            include: [
              {
                model: UserCompany,
                as: "userCompanies",
              },
            ],
          },
          transaction
        );

        // Validate that the user's associated company exists
        const companyData = await this.companyBaseService.findOne(
          {
            where: { id: userData?.userCompanies?.[0].companyId },
          },
          transaction
        );

        if (!companyData) {
          const errorMessage = `Company ID ${userData?.userCompanies?.[0].companyId} does not exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        // Validate event existence
        const event = await this.eventBaseService.findById(addonData.eventId, undefined, transaction);
        if (!event) {
          const errorMessage = `Provided Event ID ${addonData.eventId} does not exist.`;
          Logger.error(errorMessage);
          throw new Error(errorMessage);
        }

        const createdAddons: EventAddon[] = [];
        // Prepare addon request objects
        for (const addon of addonData.addons) {
          let createAddon;
          let addonProperty;
          const addonReq = {
            eventId: addonData.eventId,
            addonId: addon.addonId,
            amount: addon.amount,
            startTime: addon.startTime,
            tier: addon.tier,
            companyId: companyData.dataValues.id,
            createdBy: userId,
            modifiedBy: 0,
            endTime: addon.endTime,
            description: addon.description,
            statusId: enumEventAddonStatus.ACTIVE,
          };

          // Validate addon dates
          if (addon.startTime && event.dataValues.endTime && addon.startTime > event.dataValues.endTime) {
            const errorMessage = `Invalid addon dates: Addon start time exceeds event end time.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }

          // Bulk create addons
          createAddon = await this.eventAddonBaseService.create(addonReq, transaction);

          if (addon.sponsors) {
            for (const sponsor of addon.sponsors) {
              // checking the Given Sponsor already Assigned in this addon
              const existingSponsor = await this.eventSponsorBaseService.findOne({
                where: {
                  sponsorId: sponsor.sponsorId,
                  eventAddonId: createAddon.dataValues.id,
                },
              });

              if (existingSponsor) {
                const errorMessage = `The sponsor with ID ${sponsor.sponsorId} is already assigned to the addon with ID ${createAddon.dataValues.id}. Duplicate sponsorships are not allowed.`;
                Logger.error(errorMessage);
                throw new Error(errorMessage);
              }
              const sponsorReq = {
                sponsorId: sponsor.sponsorId,
                sponsorTypeId: sponsor.sponsorTypeId,
                parentEventId: addonData.eventId,
                eventAddonId: createAddon.dataValues.id,
                statusId: enumSponsorStatus.ACTIVE,
                createdBy: userId,
                modifiedBy: 0,
              };
              await this.eventSponsorBaseService.create(sponsorReq, transaction);
            }
          }

          // Prepare properties for each created addon if properties are provided
          if (addon.properties && addon.properties.length > 0) {
            for (const property of addon.properties) {
              const propertyReq: CreateAddonPropertyDTO = {
                eventAddonId: createAddon.dataValues.id,
                name: property.name,
                description: property.description,
                enabled: property.enabled || 1,
                assetId: property.assetId,
                amount: property.amount,
                createdBy: userId,
                modifiedBy: 0,
              };
              addonProperty = await this.addonPropertyBaseService.create(propertyReq, transaction);
            }
          }
          createdAddons.push(createAddon);
        }
        return createdAddons;
      } catch (error) {
        Logger.error("Error in addSingleEventAddon", error);
        throw error;
      }
    });
  }

  /**
   * Updates a single event addon and its associated properties.
   *
   * @param eventAddonId - ID of the addon to update
   * @param addonData - Updated addon data
   * @param userId - ID of the user making the update
   * @returns Updated EventAddon instance
   */
  async updateEventAddon(eventAddonId: number, addonData: updateAddonDTO, userId: number, transaction: Transaction): Promise<EventAddon | null> {
    try {
      // Fetch the existing addon to ensure it exists
      const existingAddon = await this.eventAddonBaseService.findOne(
        {
          where: { id: eventAddonId },
        },
        transaction
      );

      if (!existingAddon) {
        const errorMessage = `Event Addon with ID ${eventAddonId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // checking the given addon date is less then event end time
      const event = await this.eventBaseService.findById(addonData.eventId);
      if (event?.dataValues.endTime && addonData.startTime && event?.dataValues.endTime < addonData.startTime) {
        const errorMessage = `Invalid addon dates: Addon start time exceeds event end time.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }
      // Update addon details
      await this.eventAddonBaseService.update(
        eventAddonId,
        {
          eventId: addonData.eventId,
          addonId: addonData.addonId,
          amount: addonData.amount,
          startTime: addonData.startTime,
          endTime: addonData.endTime,
          tier: addonData.tier,
          description: addonData.description,
          modifiedBy: userId,
        },
        undefined,
        transaction
      );

      if (addonData.sponsors) {
        for (const sponsor of addonData.sponsors) {
          // checking the Given Sponsor already Assigned in this addon
          const existingSponsor = await this.eventSponsorBaseService.findOne({
            where: {
              sponsorId: sponsor.sponsorId,
              eventAddonId: eventAddonId,
            },
          });

          if (existingSponsor) {
            const errorMessage = `The sponsor with ID ${sponsor.sponsorId} is already assigned to the addon with ID ${eventAddonId}. Duplicate sponsorships are not allowed.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
          const sponsorReq = {
            sponsorId: sponsor.sponsorId,
            sponsorTypeId: sponsor.sponsorTypeId,
            parentEventId: addonData.eventId,
            eventAddonId: eventAddonId,
            statusId: enumSponsorStatus.ACTIVE,
            createdBy: userId,
            modifiedBy: 0,
          };
          await this.eventSponsorBaseService.create(sponsorReq, transaction);
        }
      }

      // Update properties if provided
      if (addonData.properties) {
        // Delete existing properties
        await this.addonPropertyBaseService.deleteCustom({ eventAddonId: eventAddonId }, undefined, transaction);

        // Prepare properties for each created addon if properties are provided
        for (const property of addonData.properties) {
          let addonProperty;
          const propertyReq: CreateAddonPropertyDTO = {
            eventAddonId: eventAddonId,
            name: property.name,
            description: property.description,
            enabled: property.enabled || 1,
            assetId: property.assetId,
            amount: property.amount,
            createdBy: userId,
            modifiedBy: 0,
          };
          addonProperty = await this.addonPropertyBaseService.create(propertyReq, transaction);
        }
      }

      // Fetch and return the updated addon with its properties
      return await this.eventAddonBaseService.findOne(
        {
          where: { id: eventAddonId },
          include: [
            {
              model: Addon,
              as: "addon",
            },
            {
              model: EventAddonProperty,
              as: "eventAddonProperties",
            },
          ],
        },
        transaction
      );
    } catch (error) {
      Logger.error("Error in updateEventAddon", error);
      throw error;
    }
  }
  /**
   * Updates the template ID of an event in the database.
   *
   * @param eventId - The ID of the event to update.
   * @param templateData - An object containing the new template ID.
   * @param userId - The ID of the user making the update.
   * @param transaction - The Sequelize transaction instance for atomicity.
   * @returns The updated event object with associated details, or `null` if not found.
   */
  async updateEventTemplate(eventId: number, templateData: UpdateEventTemplateDTO, userId: number, transaction?: Transaction): Promise<Event | null> {
    try {
      // Fetch the existing event to ensure it exists
      const existingEvent = await this.eventBaseService.findOne(
        {
          where: { id: eventId },
        },
        transaction
      );

      if (!existingEvent) {
        const errorMessage = `Event with ID ${eventId} does not exist.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Update the template ID and modifiedBy in the event
      await this.eventBaseService.update(
        eventId,
        {
          colorId: templateData.colorId ?? undefined,
          templateId: templateData.templateId,
          modifiedBy: userId,
        },
        undefined,
        transaction
      );

      // Fetch and return the updated event with its associated template details
      return await this.eventBaseService.findOne(
        {
          where: { id: eventId },
          include: [
            {
              model: Template,
              as: "template",
            },
            {
              model: Color,
              as: "color",
            },
          ],
        },
        transaction
      );
    } catch (error) {
      Logger.error("Error in updateEventTemplate:", error);
      throw error;
    }
  }

  /**
   * function for delete child events / Programs
   *
   * @param programId - Program id to delete
   * @param transaction - The Sequelize transaction instance for atomicity.
   */
  async deleteEventProgram(programId: number, userId: number) {
    try {
      // Checking the program with given id is exist or not.
      const program = await this.eventBaseService.findById(programId);
      if (!program) {
        const errorMessage = `Program with Id ${programId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Checking the Program Event Has participants.
      const participant = await this.participantBaseService.findOne({
        where: { eventId: program.dataValues.parentId },
      });
      if (participant) {
        const errorMessage = `Can't delete the program , This Event has registered Participants.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Deleting seat capacity if program have
      const seatCpacity = await this.eventParticipantEntryBaseService.findOne({
        where: { eventId: program.dataValues.id },
      });
      if (seatCpacity) {
        await this.eventParticipantEntryBaseService.delete(seatCpacity.dataValues.id);
      }
      // Fetch speakers assigned to the event program with a limit of 10 records
      const pgmSpeakers = await this.eventSpeakerBaseService.findAll({
        where: { eventId: program.dataValues.id },
        limit: 10,
      });

      // Check if the event program contains assigned speakers
      if (pgmSpeakers) {
        // Updating Event Program speaker status to INACTIVE
        const updateData = {
          statusId: enumEventStatus.INACTIVE, // Set status to INACTIVE
          mdifiedOn: new Date(), // Record the modification date
          modifiedBy: userId, // Track who made the change
        };

        const whereCondition = { eventId: program.dataValues.id };

        // Update the speaker records with the new status
        await this.eventSpeakerBaseService.updateCustom(updateData, whereCondition);
      }

      // Prepare data to update the event status to INACTIVE
      let updateCondition = {
        modifiedBy: userId, // Track who modified the event
        modifiedOn: new Date(), // Record the modification date
        statusId: enumEventStatus.INACTIVE, // Set event status to INACTIVE
      };

      // Update the event record with the new status
      return await this.eventBaseService.update(programId, updateCondition);
    } catch (error) {
      Logger.error("Error in deleteEventProgram:", error);
      throw error;
    }
  }

  /**
   * function for delete event addon.
   *
   * @param eventAddonId - Event Addon id to delete
   * @param transaction - The Sequelize transaction instance for atomicity.
   */
  async deleteEventAddon(eventAddonId: number) {
    try {
      // Checking the eventAddon with given id is exist or not.
      const eventAddon = await this.eventAddonBaseService.findById(eventAddonId);
      if (!eventAddon) {
        const errorMessage = `Event Addon with Id ${eventAddonId} not found`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Checking the Addon Event Has participants.
      const participant = await this.participantBaseService.findOne({
        where: { eventId: eventAddon.dataValues.eventId },
      });
      if (participant) {
        const errorMessage = `Can't delete the Addon , This Event has registered Participants.`;
        Logger.error(errorMessage);
        throw new Error(errorMessage);
      }

      // First, find all event addon properties related to the event addon.
      const addonProperties = await this.eventAddonPropertyBaseService.findAll({
        where: { eventAddonId: eventAddon.dataValues.id },
      });

      if (addonProperties && addonProperties.length > 0) {
        // Use a for...of loop to handle asynchronous delete operations
        for (const property of addonProperties) {
          await this.eventAddonPropertyBaseService.delete(property.id);
        }
      }

      return await this.eventAddonBaseService.delete(eventAddonId);
    } catch (error) {
      Logger.error("Error in deleteEventAddon:", error);
      throw error;
    }
  }

  /**
   * Retrieves the event participation status for the given user, applying various filters, pagination, and sorting.
   *
   * @param userId - The ID of the user for whom to filter events.
   * @returns - A promise that resolves to an object containing the events list
   *           (`rows`) and the total count of matching events (`count`).
   */
  async getRegisteredEventStatus(
    filters: RegisteredEventFilter,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    userId: number
  ): Promise<{ rows: Event[]; count: number }> {
    // Fetch participant IDs for the given userId
    const participants = await this.participantBaseService.findAll({
      where: { userId: userId },
    });

    // Initialize condition object for filtering events
    let condition: WhereOptions = {};
    if (filters.name) {
      condition.name = { [Op.like]: `%${filters.name}%` };
    }
    if (filters.id) {
      condition.id = filters.id;
    }
    if (participants) {
      const eventIds = participants.map((participant) => participant.dataValues.eventId);
      condition.id = filters.id ?? { [Op.in]: eventIds };
    }

    const participantIds = participants.map((participant) => participant.dataValues.id);

    // Create an array to collect the results for each participant
    const allEvents = [];
    const exclude = ["createdBy", "createdOn", "modifiedBy", "modifiedOn"];
    const userExclude = ["createdBy", "createdOn", "modifiedBy", "modifiedOn", "phone", "email", "ssoMetadata", "deviceToken"];
    // Loop through participantIds and fetch events related to each participant
    const events = await this.eventBaseService.findAll({
      where: condition, // Assuming condition filters the events as needed
      attributes: { exclude },
      include: [
        {
          model: Venue,
          as: "venue",
          required: false,
          attributes: { exclude },
        },
        {
          model: Participant,
          as: "participants",
          where: { id: { [Op.in]: participantIds } },
          required: true,
          attributes: { exclude },
          include: [
            {
              model: EventParticipant,
              as: "eventParticipants",
              attributes: ["id", "participantId"],
              // where: { eventAddonId: { [Op.is]: null } },
              include: [
                {
                  model: Event,
                  as: "event",
                  required: false,
                  attributes: { exclude },
                  include: [
                    {
                      model: EventSpeaker,
                      as: "eventSpeakers",
                      required: false,
                      attributes: { exclude },
                      where: {
                        statusId: enumEventProgramSchedulerStatus.ACTIVE,
                      },
                      include: [
                        {
                          model: User,
                          as: "user",
                          attributes: {
                            exclude: userExclude,
                          },
                        },
                        {
                          model: SpeakerBio,
                          as: "speakerBios",
                          attributes: {
                            exclude,
                          },
                        },
                      ],
                    },
                    {
                      model: EventSponsor,
                      as: "eventSponsors",
                      attributes: ["sponsorId"],
                      include: [
                        {
                          model: Sponsor,
                          as: "sponsor",
                          attributes: { exclude },
                        },
                      ],
                    },
                    {
                      model: Venue,
                      as: "venue",
                      required: false,
                      attributes: { exclude },
                    },
                    {
                      model: Attendee,
                      as: "eventAttendees",
                      attributes: { exclude },
                      where: {
                        participantId: { [Op.in]: participantIds },
                        isDeleted: 0,
                      },
                      required: false,
                    },
                  ],
                },
                {
                  model: EventAddon,
                  as: "eventAddon",
                  attributes: { exclude },
                  required: false,
                  include: [
                    {
                      model: Addon,
                      as: "addon",
                      attributes: { exclude },
                    },
                    {
                      model: EventSponsor,
                      as: "eventSponsors",
                      attributes: ["sponsorId"],
                      include: [
                        {
                          model: Sponsor,
                          as: "sponsor",
                          attributes: { exclude },
                        },
                      ],
                    },
                  ],
                },
                {
                  model: EventAddonProperty,
                  as: "eventAddonProperty",
                  attributes: { exclude },
                },
              ],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [[sortBy, sortDirection.toUpperCase()]],
    });

    // Flatten the events for the current participant and add to allEvents
    allEvents.push(...events); // Spread the event array into the allEvents array

    // Return the events along with the count
    return {
      rows: allEvents,
      count: participants.length,
    };
  }

  /**
   * Fetches details for all published events and their associated programs for a specific company.
   *
   * @param {number} companyId - The unique identifier of the company for which events and programs are retrieved.
   * @returns {Promise<{ rows: Event[]; count: number; programs: Event[] }>}
   *          - An object containing:
   *            - `rows`: Array of events that are parent-level (without a `parentId`).
   *            - `count`: Total number of parent-level events.
   *            - `programs`: Array of events that are considered programs (with a defined `parentId`).
   * @throws {Error} - Logs and rethrows any errors encountered during database queries.
   */

  async eventDetails(
    filters: EventFilterDTO,
    limit: number,
    offset: number,
    sortBy: string,
    sortDirection: string,
    companyId: number
  ): Promise<{ rows: Event[]; count: number }> {
    try {
      const exclude = ["createdBy", "createdOn", "modifiedBy", "modifiedOn"];
      let eventCondition: WhereOptions = {
        companyId: companyId,
        parentId: { [Op.is]: undefined },
        published: 1,
      };
      if (filters?.startTime && filters?.endTime) {
        eventCondition.startTime = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
        eventCondition.endTime = {
          [Op.gte]: new Date(filters.startTime),
        };
      } else if (filters?.startTime) {
        eventCondition.startTime = { [Op.gte]: new Date(filters.startTime) };
      } else if (filters?.endTime) {
        eventCondition.endTime = {
          [Op.lte]: new Date(filters.endTime).setHours(23, 59, 59, 999),
        };
      }
      const { rows } = await this.eventBaseService.findAndCountAll({
        limit,
        offset,
        order: [[sortBy, sortDirection.toUpperCase()]],
        where: eventCondition,
        include: [
          {
            model: Event,
            as: "events",
            required: false,
            where: { companyId: companyId, parentId: { [Op.ne]: null } },
            include: [
              {
                model: EventSpeaker,
                as: "eventSpeakers",
                required: false,
                attributes: { exclude },
                where: { statusId: enumEventProgramSchedulerStatus.ACTIVE },
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: { exclude },
                  },
                  {
                    model: SpeakerBio,
                    as: "speakerBios",
                    attributes: { exclude },
                  },
                ],
              },
            ],
          },
          {
            model: Venue,
            as: "venue",
          },
        ],
      });
      return { rows, count: rows.length };
    } catch (error) {
      Logger.log("error in eventDetails service ", error);
      throw error;
    }
  }

  /**
   * Delete a draft event
   * @param draftId - The ID of the draft event to delete.
   * @returns A promise that resolves to the result of the deletion operation.
   */
  async deleteDraftEvent(draftId: number) {
    try {
      // Fetch Event Drafted Status
      const eventStatus = await this.eventStatusBaseService.findOne({
        where: { id: enumEventStatus.DRAFTED },
      });
      const eventDeleteStatus = await this.eventStatusBaseService.findOne({
        where: { id: enumEventStatus.DELETED },
      });
      if (!eventStatus) {
        throw new Error("Draft status not found.");
      }
      if (!eventDeleteStatus) {
        throw new Error("Draft delete status not found.");
      }

      // Check if the program with the given ID exists and has the drafted status
      const event = await this.eventBaseService.findOne({
        where: { id: draftId, statusId: eventStatus?.dataValues.id },
      });

      if (!event) {
        Logger.warn(`No drafted event found with ID: ${draftId}`);
        return null; // Or you can throw an error if required
      }

      //delete all event contacts
      const eventContacts = await this.eventContactBaseService.findAll({
        where: { eventId: draftId },
      });
      let updateData: UpdateDraftDTO = { statusId: eventDeleteStatus?.dataValues.id, modifiedOn: new Date() };
      let addOwnUpdateData: UpdateDraftDTO = { statusId: 2, modifiedOn: new Date() };
      if (eventContacts) {
        await Promise.all(
          eventContacts.map((contact) => {
            this.eventContactBaseService.delete(Number(contact?.dataValues?.id));
          })
        );
      }
      //delete all event contacts
      const eventAddOwns = await this.eventAddonBaseService.findAll({
        where: { eventId: draftId },
      });
      let whereOptions;
      if (eventAddOwns) {
        await Promise.all(
          eventAddOwns.map((addOwns) => {
            //this.eventContactBaseService.delete(Number(contact?.dataValues?.id))
            whereOptions = { id: Number(addOwns?.dataValues?.id) };
            this.eventAddonBaseService.updateCustom(addOwnUpdateData, whereOptions, undefined);
          })
        );
      }
      //delete all event pgms which is on draft
      const eventPgms = await this.eventBaseService.findAll({
        where: { parentId: draftId, statusId: eventStatus?.dataValues.id },
      });
      if (eventPgms) {
        await Promise.all(
          eventPgms.map((pgm) => {
            const pgmwhereOptions = { id: Number(pgm?.dataValues?.id) }; // Create `pgmwhereOptions`
            return this.eventBaseService.updateCustom(updateData, pgmwhereOptions, undefined); // Call `updateCustom`
          })
        );
      }

      // Delete the main event and return the result
      //  return await this.eventBaseService.delete(Number(event?.dataValues?.id));
      return await this.eventBaseService.update(Number(event?.dataValues?.id), { statusId: 6 });
    } catch (error) {
      Logger.error("Error in deleteDraftEvent:", error);
      throw error;
    }
  }

  /**
   * Retrieves event contact details by event ID.
   *
   * @param id - The ID of the event
   * @param transaction - Optional Sequelize transaction
   * @returns The event contact details or null if not found
   * @throws An error if the operation fails
   */
  async getEventContactByEventId(id: number, transaction?: Transaction) {
    try {
      return await this.eventContactBaseService.findOne({
        where: { eventId: id },
        transaction,
      });
    } catch (err) {
      Logger.error("Error in getEventContactByEventId: ", err);
      throw err;
    }
  }

  /**
   * Retrieves addon details associated with an event by its ID.
   *
   * @param eventId - The ID of the event for which we need to fetch addon details.
   * @returns - An array of addon objects, each containing `name` and `id` properties.
   */
  async addonCountByEventId(eventId: number) {
    try {
      // Fetch all the event add-ons for the given eventId, including associated addon details.
      const eventAddons = await this.eventAddonBaseService.findAll({
        where: { eventId: eventId }, // Filter add-ons by eventId
        include: [
          {
            model: Addon,
            as: "addon",
          },
        ],
      });

      let addonDetails = [];

      // Loop through each eventAddon and push relevant details (name, id) into the array.
      for (const eventAddon of eventAddons) {
        const registered = await this.eventParticipantBaseService.findAll({
          attributes: ["participantId"],
          where: { eventAddonId: eventAddon.dataValues.id },
          group: ["participantId"],
        });

        const checkIns = await this.attendeeBaseService.findAll({
          attributes: ["participantId"],
          where: { eventAddonId: eventAddon.dataValues.id },
          group: ["participantId"],
        });

        addonDetails.push({
          id: eventAddon.dataValues.id,
          name: eventAddon.addon.dataValues.name,
          registeredCount: registered.length,
          checkinCount: checkIns.length,
        });
      }

      return addonDetails;
    } catch (err) {
      // Log any errors that occur during the process.
      Logger.error("Error in addonCountByEventId: ", err);
      throw err;
    }
  }

  /**
   * Calculates the available seats for a given event.
   *
   * @param eventId - The ID of the event whose available seats need to be calculated.
   * @param transaction - An optional Sequelize transaction object for database queries.
   *
   * @returns - A promise that resolves to the number of available seats for the event.
   */
  async eventAvailableSeatsCount(eventId: number, transaction?: Transaction): Promise<number> {
    try {
      // Fetch the event details, including the associated company and userCompanies (i.e., users linked to the company)
      const event = await this.eventBaseService.findById(eventId, {
        include: [
          {
            model: Company,
            as: "company",
            include: [
              {
                model: UserCompany,
                as: "userCompanies",
              },
            ],
          },
        ],
      });

      // Retrieve the active subscription for the company associated with the event
      const subscription = await this.subscriptionBaseService.findOne(
        {
          where: {
            userId: event?.company.userCompanies[0].dataValues.userId,
            statusId: enumSubscriptionStatus.ACTIVE,
          },
          include: [
            {
              model: Plan,
              as: "plan",
            },
          ],
        },
        transaction
      );

      let eventAllotment;
      // If event limits are defined in the plan, parse them into an object
      if (subscription?.plan?.dataValues.eventLimits) {
        eventAllotment = JSON.parse(subscription?.plan?.dataValues.eventLimits);
      }

      // Calculate the available seats: total allowed attendees - registered attendees
      const availableSeats = eventAllotment.noOfAttendees;
      return availableSeats;
    } catch (err) {
      // Log and rethrow any error that occurs
      Logger.error("Error in eventAvailableSeatsCount: ", err);
      throw err;
    }
  }
  async getEventDetails(meetingCode: string) {
    try {
      const data = await this.eventBaseService.findOne({
        where: { meetingId: meetingCode },
        attributes: ["url", "name", "meetingId", "start_time", "end_time","id"],
      });

      return data;
    } catch (err) {
      Logger.error("Error in getMeetingMetaData: ", err);
      throw err;
    }
  }
  async getMeetingMetaData(meetingId?: string, userId?: number, eventId?: number) {
    try {
      const orConditions: any[] = [];

      if (meetingId) {
        orConditions.push({ meetingUniqueId: meetingId });
      }

      if (userId && eventId) {
        orConditions.push({ userId, eventId });
      }

      if (orConditions.length === 0) {
        throw new Error("Please provide either meetingId or both userId and eventId.");
      }

      const data = await this.metaDataBaseService.findOne({
        where: {
          [Op.or]: orConditions
        },
        include: [
          {
            model: Event,
            as: "event",
            required: false,
            attributes: ["id", "name", "eventStartTime", "eventEndTime"],
          },
          {
            model: User,
            as: "user",
            required: false,
            attributes: ["id", "firstName", "lastName", "phone"],
          },
        ],
      });

      return data;
    } catch (err) {
      Logger.error("Error in getMeetingMetaData: ", err);
      throw err;
    }
  }

}
