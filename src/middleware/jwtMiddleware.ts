/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import config from '../config/index';
import { Logger } from '../utils/logger';

/**
 * Middleware to verify JWT token for protected routes.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 * @author : sarathavs
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, config.jwt.secret as string);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err: any) {
    Logger.error('Error verifyToken::', err);
    return next(new AppError('Invalid or expired token', 401));
  }
};

/**
 * Middleware to optionally verify a JWT token from the Authorization header.
 * If a valid token is provided, the decoded user information is attached to the request.
 * If no token is provided, the request proceeds without authentication.
 *
 * @param {Request} req - The Express request object, potentially containing the Authorization header.
 * @param {Response} res - The Express response object, used for sending responses if an error occurs.
 * @param {NextFunction} next - The next middleware function in the stack, used to proceed or handle errors.
 */
export const optionalVerifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret as string);

      // Attach the decoded user information to the request object
      req.user = decoded;
    }

    // Proceed to the next middleware or route handler regardless of token
    next();
  } catch (err: any) {
    Logger.error('Error optionalVerifyToken::', err);
    return next(new AppError('Invalid or expired token', 401));
  }
};
