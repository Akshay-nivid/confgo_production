import moment from 'moment';
/**
 * This function takes a date string or Date object and formats it to 'MMMM D, YYYY' format.
 * @param date - A string or Date object to be formatted.
 * @returns A string in the format 'MMMM D, YYYY'.
 */
export function formatDateDayMonthYear(date: string | Date): string {
  return moment(date).format('MMMM D, YYYY');
}