import { Request } from 'express';
import 'express-session';

/**
 *  Extend the express-session module's Session interface to include a custom property `sessionId`.
 */
declare module 'express-session' {
  interface Session {
    sessionId?: string;
  }
}

/**
 * Helper class for managing session-related operations, such as setting and retrieving
 * a custom session identifier (sessionId) in Express sessions.
 */
export class SessionHelper {
  /**
   * Sets a custom session ID in the session object.
   *
   * @param {Request} req - The Express request object containing the session.
   * @param {string} sessionId - The unique session identifier to store in the session.
   */
  static setSessionId(req: Request, sessionId: string) {
    req.session.sessionId = sessionId;
  }

  /**
   * Retrieves the custom session ID from the session object.
   *
   * @param {Request} req - The Express request object containing the session.
   * @returns {string | undefined} - Returns the stored session ID, or undefined if not set.
   */
  static getSessionId(req: Request): string | undefined {
    return req.session.sessionId;
  }
}
