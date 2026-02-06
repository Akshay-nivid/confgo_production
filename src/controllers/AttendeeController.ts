/**
 * @class AttendeeController
 * @description Controller class for handling HTTP requests related to Attendee operations.
 * @author nihal
 */

import { NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { handleError } from '../utils/error_util';
import { AttendeeService } from '../services/AttendeeService';
import { createAttendeeSchema } from '../validators/attendeeValidator';
import { extractAttendeeData } from '../handlers/attendee/attendeeRequestHandler';
import { createAttendeeResponse } from '../dtos/attendee/AddAttendeeDTO';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export class AttendeeController {
  private attendeeService = new AttendeeService();

  /**
   * Handles the request to add Attendee.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  async addAttendee(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as JwtPayload)?.id;
      const attendeeData = extractAttendeeData(req, createAttendeeSchema);

      const attendeeResp = await this.attendeeService.addAttendee(
        attendeeData,
        Number(userId)
      );
      const response = createAttendeeResponse(
        attendeeResp.attendeePrograms,
        attendeeResp.attendeeAddons
      );
      res.status(201).json(response);
    } catch (err) {
      Logger.error('Error adding Attendee:', err);
      handleError(next, err);
    }
  }
}
