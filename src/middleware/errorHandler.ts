/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Error handling middleware
 * Author: sarathavs
 */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { Logger } from '../utils/logger';

//re,next require to keep express Compliance
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error('Error:', err);

  // If the error is an instance of AppError, use its statusCode, otherwise default to 500
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'An unexpected error occurred';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
