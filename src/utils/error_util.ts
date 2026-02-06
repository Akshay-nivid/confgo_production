/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction } from 'express';
import { AppError } from './AppError';
import { UniqueConstraintError } from 'sequelize';

/**
 * @author : sarathavs
 * @function handleError
 * @description Centralized error handler that processes different types of errors and passes them to the next middleware.
 * @param next - Express next function for passing the error to the error-handling middleware.
 * @param error - The error object that was caught.
 * @param statusCode - The HTTP status code to send in case of generic errors (defaults to 500).
 */
export const handleError = (
  next: NextFunction,
  error: any,
  statusCode: number = 500
) => {
  // Check if the error is an instance of AppError (custom application errors)
  if (error instanceof AppError) {
    return next(new AppError(error.message, error.statusCode || 400));
  }

  // Handle Sequelize UniqueConstraintError (e.g., duplicate entries in the database)
  if (error instanceof UniqueConstraintError) {
    const message = error.errors
      .map((err: any) => `${err.path} must be unique`)
      .join(', '); // Generate a user-friendly error message
    return next(new AppError(message, 400)); // Pass a 400 (Bad Request) error with the generated message
  }

  // If the error has a valid message, pass it along with the status code
  if (error && error.message && error.message.length) {
    return next(new AppError(error.message, statusCode));
  }

  // If no specific error message is available, handle as an unknown error
  return next(new AppError('An unknown error occurred', statusCode));
};
