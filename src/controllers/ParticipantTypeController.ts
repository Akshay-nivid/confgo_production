/**
 * @class ParticipantTypeController
 * @description Controller class for handling HTTP requests related to Participant type operations.
 * @author nihal
 */

import { Request, Response, NextFunction } from 'express';
import { extractListRequestData } from '../utils/request_util';
import { handleError } from '../utils/error_util';
import { Logger } from '../utils/logger';
import { createPaginatedResponse } from '../utils/response_util';
import { ParticipantTypeService } from '../services/ParticipantTypeService';
import { ParticipantType } from '../models/ParticipantType';
import {
  createParticipantTypeResponse,
  ParticipantTypeResponseDTO,
  updateParticipantTypeResponse,
} from '../dtos/participant/ParticipantTypeDTO';
import {
  createParticipantTypeSchema,
  updateParticipantTypeSchema,
} from '../validators/participant/participantTypeValidator';
import {
  extractParticipantTypeData,
  extractUpdateParticipantTypeData,
} from '../handlers/participant/participantTypeRequestHandler';
import { JwtPayload } from 'jsonwebtoken';
import { sequelize } from './../models/index';
import { Transaction } from 'sequelize';

export class ParticipantTypeController {
  private participantTypeService = new ParticipantTypeService();
  /**
   * Retrieves all participant type based on the request data, including filters, pagination, and sorting.
   * @param req - Request object containing filters, pagination, and sorting parameters.
   * @param res -Response object used to send the response back.
   * @param next - The next middleware function for handling errors.
   */
  async participantTypeList(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract request data for filtering, pagination, and sorting
      const { filters, offset, sortBy, sortDirection } =
        extractListRequestData(req);

        const limit = 200;
      // Fetch participant types with pagination, sorting, and filtering
      const { rows: participantTypes, count: total } =
        await this.participantTypeService.participantTypeList(
          filters,
          limit,
          offset,
          sortBy,
          sortDirection
        );

      // Filter the fields of each participant type
      const filteredParticipantTypes = participantTypes.map(
        (participantType: ParticipantType) =>
          this.filterParticipantTypeFields(participantType)
      );

      // Create a paginated response with the filtered participant types
      const response = createPaginatedResponse(
        filteredParticipantTypes,
        total,
        limit,
        offset
      );

      // Send the response with a 200 status code
      res.status(200).json(response);
    } catch (error) {
      // Log and handle any errors
      Logger.error('Error participantTypeList:', error);
      handleError(next, error);
    }
  }

  /**
   * Filters the participant type fields based on the requested fields.
   * @param participantType - The participantType object to filter.
   * @param fields - Array of fields to include in the response.
   * @returns The filtered eventProgram object.
   */
  private filterParticipantTypeFields(participantType: ParticipantType) {
    return participantType;
  }

  /**
   * Handles the request to create Participants type.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async createParticipantType(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const participantTypeData = extractParticipantTypeData(
        req,
        createParticipantTypeSchema
      );

      const participantType =
        await this.participantTypeService.createParticipantType(
          participantTypeData,
          Number(userId)
        );
      const response = createParticipantTypeResponse(participantType);

      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error creating participant Group:', err);
      handleError(next, err); // Ensure a valid error object is passed
    }
  }

  /**
   * Handle request to delete the participant
   * @param req - Express the request object
   * @param res - Express response object
   * @param next - Express next middleware function.
   */
  async deleteParticipantType(req: Request, res: Response, next: NextFunction) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const id = Number(req.params?.id);
      const deleted = await this.participantTypeService.deleteParticipantType(
        id,
        transaction
      );
      transaction.commit();
      if (deleted && deleted > 0) {
        res.status(200).send();
      } else {
        res
          .status(404)
          .json({ status: 'error', message: 'Participant type not found' });
      }
    } catch (err) {
      transaction.rollback();
      handleError(next, err);
    }
  }

  /**
   * Handle request to update the participant type
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  async updateParticipantType(req: Request, res: Response, next: NextFunction) {
    try {
      const updateData = extractUpdateParticipantTypeData(
        req,
        updateParticipantTypeSchema
      );
      const { id } = updateData;

      const [updatedCount] =
        await this.participantTypeService.updateParticipantType(
          Number(id),
          updateData
        );

      if (updatedCount > 0) {
        const updatedData = await this.participantTypeService.getUserOrThrow(
          Number(id)
        );

        const response = updateParticipantTypeResponse(
          updatedData as ParticipantTypeResponseDTO
        );

        res.status(200).json(response);
      } else {
        res.status(500).json({ message: 'Failed to update participant type' });
      }
    } catch (err) {
      handleError(next, err);
    }
  }
}
