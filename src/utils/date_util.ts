import { Logger } from './logger';
/**
 * @author saneeshiv
 * @description This file contains utility functions related to date operations.
 */

/**
 * Calculates the end date by adding a specified duration to a start date.
 * The duration is in days, and the result is a new Date object representing the end date.
 *
 * @param {Date} startDate - The start date from which the duration will be added.
 * @param {number} duration - The number of days to add to the start date to calculate the end date.
 * @returns {Date} - The calculated end date based on the given start date and duration.
 * @throws Will throw an error if the date calculation fails.
 */
export const calculateEndDate = (startDate: Date, duration: number): Date => {
  try {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    return endDate;
  } catch (error) {
    Logger.error('Error calculateEndDate:', error);
    throw error;
  }
};
