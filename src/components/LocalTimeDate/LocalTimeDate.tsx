import React, { useMemo } from 'react';
import { Typography, TypographyProps } from "@mui/material";
import clsx from "clsx";
import moment from "moment-timezone";

interface LocalTimeDateProps extends Omit<TypographyProps, 'children'> {
  utcDateTime?: Date | string | number | null;
  format?: string;
  timezone?: string;
  fallbackText?: string;
  debug?: boolean;
}

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
    // Early return for null or undefined
    if (utcDateTime == null) {
      if (debug) {
        console.warn('LocalTimeDate: Received null or undefined input');
      }
      return fallbackText;
    }

    try {
      // Log input for debugging
      if (debug) {
        console.log('Input UTC DateTime:', utcDateTime);
        console.log('Input Type:', typeof utcDateTime);
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
        console.log('Detected Timezone:', detectedTimezone);
        console.log('UTC Moment:', utcMoment.toISOString());
        console.log('Local Moment:', localMoment.format());
      }

      return localMoment.format(format);

    } catch (error) {
      console.error('LocalTimeDate Conversion Error:', error);
      
      // More detailed error logging
      if (debug) {
        console.error('Input Details:', {
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