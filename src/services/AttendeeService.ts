/**
 * @class AttendeeService
 * @description Service class for handling Attendee operations .
 * @author nihal
 */
import { Op, Transaction, WhereOptions } from 'sequelize';
import { Attendee } from '../models/Attendee';
import { Logger } from '../utils/logger';
import { BaseService } from './BaseService';
import {
  AddAttendeeDTO,
  UpdatedParticipantDTO,
} from '../dtos/attendee/AddAttendeeDTO';
import { Participant } from '../models/Participant';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { UserAbstract } from '../models/UserAbstract';
import { Venue } from '../models/Venue';

export class AttendeeService {
  private attendeeBaseService: BaseService<Attendee>;
  private participantBaseService: BaseService<Participant>;
  private eventBaseService: BaseService<Event>;

  constructor() {
    // Cast the Attendee model explicitly to match the expected constructor signature
    this.attendeeBaseService = new BaseService(
      Attendee as unknown as { new (): Attendee } & typeof Attendee
    );
    this.participantBaseService = new BaseService(
      Participant as unknown as { new (): Participant } & typeof Participant
    );
    this.eventBaseService = new BaseService(
      Event as unknown as { new (): Event } & typeof Event
    );
  }

  /**
   * Add an attendee.
   * @param attendeeData - The data to add the attendee.
   * @param transaction - Optional transaction to ensure atomicity.
   * @returns A promise that resolves to the added Attendee.
   */
  async addAttendee(
    attendeeData: AddAttendeeDTO,
    userId: number
  ): Promise<{
    attendeePrograms: Attendee[];
    attendeeAddons: Attendee[] | null;
  }> {
    try {
      return this.attendeeBaseService.executeTransaction(
        async (transaction: Transaction) => {
          const condition: WhereOptions = {};

          if (attendeeData.qrCode) {
            condition.qrCode = attendeeData.qrCode;
          }

          if (attendeeData.participantId) {
            condition.id = attendeeData.participantId;
          }
          const participant = await this.participantBaseService.findOne({
            where: condition,
          });
          //throwing error if participant is not exist
          if (!participant) {
            const errorMessage = `Qr Code Or Participant Id is not valid.`;
            Logger.error(errorMessage);
            throw new Error(errorMessage);
          }
          const existAttendance = await this.attendeeBaseService.findAll({
            where: { participantId: participant.dataValues.id },
          });

          const updateData = { isDeleted: 1, mdifiedOn: new Date() };
          // existAttendance.forEach(async (attendance) => {
          //   const whereCondition = { id: attendance.dataValues.id };
          //   await this.attendeeBaseService.updateCustom(
          //     updateData,
          //     whereCondition,
          //     undefined,
          //     transaction
          //   );
          // });
          for (const attendance of existAttendance) {
            const whereCondition = { id: attendance.dataValues.id };
            await this.attendeeBaseService.updateCustom(
              updateData,
              whereCondition,
              undefined,
              transaction
            );
          }
          const eventIds = Array.isArray(attendeeData.eventId)
            ? attendeeData.eventId
            : [attendeeData.eventId];

          const attendeeReq = eventIds.map((event) => ({
            eventId: event,
            scannedBy: userId,
            parentEventId: participant.dataValues.eventId,
            scanDate: new Date().toISOString().slice(0, 10),
            scanTime: new Date().toISOString().slice(11, 19),
            participantId: participant?.dataValues.id,
            createdBy: 0,
            modifiedBy: 0,
          }));

          const attendeePrograms = await this.attendeeBaseService.bulkCreate(
            attendeeReq,
            transaction
          );

          const attendeeAddons: Attendee[] = [];
          if (attendeeData.addons && Array.isArray(attendeeData.addons)) {
            for (const addon of attendeeData.addons) {
              const addonData = {
                scannedBy: userId,
                parentEventId: participant.dataValues.eventId,
                scanDate: new Date().toISOString().slice(0, 10),
                scanTime: new Date().toISOString().slice(11, 19),
                participantId: participant.dataValues.id,
                eventAddonId: addon.addonId,
                eventAddonPropertyId: addon.addonPropertyId || null,
                createdBy: 0,
                modifiedBy: 0,
              };
              // Insert addon entries
              const addonEntry = await this.attendeeBaseService.create(
                addonData,
                transaction
              );
              attendeeAddons.push(addonEntry);
            }
          }

          Logger.info('Attendees and addons added successfully');

          // Return both attendees and attendeeAddons
          return { attendeePrograms, attendeeAddons };
        }
      
      );
    } catch (error) {
      Logger.error('Error creating attendee:', error);
      throw error; // Re-throwing the error for higher-level handling
    }
  }

  /**
   * Checks the attendance status of participants for their associated events.
   * It returns an updated list of participants with their check-in status.
   *
   * @param participants - An array of participant objects to check attendance for.
   * @returns A promise that resolves to an array of updated participant DTOs with check-in status.
   */
  async checkAttendanceStatus(
    participants: Participant[]
  ): Promise<UpdatedParticipantDTO[]> {
    try {
      // Fetch all programs linked to the provided participants
      const programs = await this.eventBaseService.findAll({
        where: {
          parentId: participants.map((participant) => participant.eventId),
        },
      });

      // Extract program IDs
      const programIds = programs.map((program) => program.id);

      // Extract participant IDs
      const participantIds = participants.map((participant) => participant.id);

      // Array to store updated participant entries
      const updatedParticipants: UpdatedParticipantDTO[] = [];

      for (const participantId of participantIds) {
        // Fetch attendee rows
        const rows = await this.attendeeBaseService.findAll({
          where: {
            participantId,
            eventId: { [Op.in]: programIds },
          },
        });

        let entry;
        // Exclude other details from fetching data
        const exclude = [
          'id',
          'phoneVerified',
          'acceptedTerms',
          'isSsoUser',
          'ssoMetadata',
          'statusId',
          'modifiedOn',
          'modifiedBy',
          'createdBy',
          'createdOn',
        ];
        const participant = await this.participantBaseService.findById(
          participantId,
          {
            include: [
              {
                model: User,
                as: 'user',
                attributes: {
                  exclude,
                },
                include: [
                  {
                    model: UserAbstract,
                    as: 'userAbstracts',
                    required: false,
                    attributes: {
                      exclude: [
                        'createdBy',
                        'createdOn',
                        'modifiedBy',
                        'modifiedOn',
                      ],
                    },
                  },
                ],
              },
              {
                model: Event,
                as: 'event',
                required: true,
                include: [
                  {
                    model: Venue,
                    as: 'venue',
                    attributes: {
                      exclude: ['createdBy', 'createdOn', 'modifiedBy', 'modifiedOn'],
                    },
                    required: false,
                  },
                ],                
              },
            ],
          }
        );

        if (rows.length > 0) {
          // Participant has checked-in rows
          entry = {
            participant: participant,
            checkedIn: true,
          };
        } else {
          // No checked-in rows for the participant
          entry = {
            participant: participant,
            checkedIn: false,
          };
        }

        // Add the entry to the updated participants array
        updatedParticipants.push(entry);
      }

      // Return the updated participants list
      return updatedParticipants;
    } catch (error) {
      console.error('Error in checkAttendanceStatus:', error);
      throw error; // Re-throw the error for external handling if needed
    }
  }

  /**
   * Retrieves the check-in status of a participant for a specific event.
   *
   * @param participantId The ID of the participant.
   * @param eventId The ID of the event.
   * @returns A promise that resolves to the check-in status of the participant.
   */
  async getCheckedInStatus(participantId: number, eventId: number) {
    try {
      const exclude = [
        'id',
        'createdBy',
        'modifiedBy',
        'modifiedOn',
        'createdOn',
        'scannedBy',
        'parentEventId',
        'isDeleted',
      ];
      return await this.attendeeBaseService.findAll({
        where: {
          participantId: participantId,
          parentEventId: eventId,
          isDeleted: 0,
        },
        attributes: { exclude },
      });
    } catch (error) {
      console.error('Error in getCheckedInStatus:', error);
      throw error; // Re-throw the error for external handling if needed
    }
  }
}
