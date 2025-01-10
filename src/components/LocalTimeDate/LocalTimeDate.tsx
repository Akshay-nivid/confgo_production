import React, { useMemo } from 'react';
import { Typography, TypographyProps } from "@mui/material";
import clsx from "clsx";
import moment from "moment-timezone";
import { Logger } from '@/Utils/Logger';

interface LocalTimeDateProps extends Omit<TypographyProps, 'children'> {
  utcDateTime: Date | string | number | null | undefined; 
  format?: string;
  timezone?: string;
  fallbackText?: string;
  debug?: boolean;
}

/**
 * Renders a localized date and time string based on the provided UTC date-time.
 * 
 * @param {Object} props - The component's props.
 * @param {Date | string | number | null} [props.utcDateTime] - The input UTC date-time to be converted.
 * @param {string} [props.format='MMMM D, YYYY'] - The format for displaying the date-time.
 * @param {string} [props.timezone='auto'] - The timezone to convert to. If 'auto', it detects the user's timezone.
 * @param {string} [props.className] - Additional CSS classes for styling.
 * @param {string} [props.fallbackText='Not Available'] - Text to display if conversion fails.
 * @param {boolean} [props.debug=false] - Enables debug logging for the conversion process.
 * @param {...Object} [props.typographyProps] - Additional props passed to the Typography component.
 * 
 * @returns {JSX.Element} A Typography component displaying the localized date-time or fallback text.
 */
const LocalTimeDate: React.FC<LocalTimeDateProps> = ({
  utcDateTime, 
  format = 'MMMM D, YYYY', // Default format matching your use case
  timezone = "auto",
  className,
  fallbackText = 'Not Available',
  debug = false,
  ...typographyProps
}) => {
  const renderLocalTime = useMemo(() => {

    if (utcDateTime == null) {
      if (debug) {
        Logger.warn('LocalTimeDate: Received null or undefined input');
      }
      return fallbackText;
    }

    try {

      if (debug) {
        Logger.info('Input UTC DateTime:', utcDateTime);
        Logger.info('Input Type:', typeof utcDateTime);
      }

      // Normalize input to ensure proper parsing
      const normalizedInput = typeof utcDateTime === 'string'
        ? utcDateTime.trim()
        : utcDateTime;

      // Detect or use specified timezone
      const detectedTimezone = timezone === 'auto'
        ? moment.tz.guess()
        : timezone;

      // Parse UTC time with explicit UTC parsing
      const utcMoment = moment.utc(normalizedInput);

      // Validate the moment object
      if (!utcMoment.isValid()) {
        throw new Error('Invalid date parsing');
      }

      // Convert to local time
      const localMoment = utcMoment.tz(detectedTimezone);

      // Additional debugging information
      if (debug) {
        Logger.info('Detected Timezone:', detectedTimezone);
        Logger.info('UTC Moment:', utcMoment.toISOString());
        Logger.info('Local Moment:', localMoment.format());
      }

      return localMoment.format(format);

    } catch (error) {
      Logger.error('LocalTimeDate Conversion Error:', error);
      
      // More detailed error logging
      if (debug) {
        Logger.error('Input Details:', {
          input: utcDateTime,
          type: typeof utcDateTime,
          timezone: timezone
        });
      }

      return fallbackText;
    }
  }, [utcDateTime, format, timezone, fallbackText, debug]);

  return (
    <Typography 
      className={clsx("local-time-date", className)}
      {...typographyProps}
    >
      {renderLocalTime}
    </Typography>
  );
};

export default LocalTimeDate;