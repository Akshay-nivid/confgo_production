import { BaseService } from './BaseService';
import { Logger } from '../utils/logger';
import { Log } from '../models/init-models';
import { Request } from 'express';

interface Response {
  success?: boolean;
  statusCode?: number;
  message?: any;
}
/**
 * LogService class to handle log-related operations.
 */
export class LogService {
  private logBaseService: BaseService<Log>;

  constructor() {
    this.logBaseService = new BaseService(
      Log as unknown as {
        new (): Log;
      } & typeof Log
    );
  }

  /**
   * Creates a log entry in the database.
   *
   * @param userId - The ID of the user creating the log.
   * @param req - The incoming HTTP request object.
   * @param res - The outgoing HTTP response object.
   */
  createLogEntry(userId: number, request: Request, response?: Response) {
    try {
      const extractRelevantData = (obj: any, seen = new Set()) => {
        if (!obj || typeof obj !== 'object') return obj;

        // If we've seen this object before, return '[Circular]' to avoid infinite loop
        if (seen.has(obj)) return '[Circular]';

        // Mark the object as seen
        seen.add(obj);

        // Create a shallow copy to prevent modifying the original object
        const result: any = {};

        for (const key of Object.keys(obj)) {
          // Recursively process each property and filter out known circular reference properties
          if (key !== 'parser' && key !== 'socket' && key !== 'listening') {
            result[key] = extractRelevantData(obj[key], seen);
          }
        }

        return result;
      };

      const cleanedRequest = request ? extractRelevantData(request) : {};
      const cleanedResponse = response ? extractRelevantData(response) : {};
      const req = {
        userId: userId,
        request: JSON.stringify(cleanedRequest),
        response: JSON.stringify(cleanedResponse),
        createdBy: userId,
        modifiedBy: 0,
      };

      this.logBaseService.create(req);
    } catch (error) {
      Logger.error('Error creating log', error);
    }
  }
}
