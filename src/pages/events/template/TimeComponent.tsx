/**
 * TimeComponent
 * component that formats and displays a time range (start time to end time). 
 * The component determine if the start and end times fall on the same day and adjusts the display format.
 */
import React from 'react';
import { Typography } from '@mui/material';
import moment from 'moment';

interface TimeComponentProps {
  startTime: string;
  endTime: string;
  classPrefix: string;
  month?: boolean;
}

const TimeComponent: React.FC<TimeComponentProps> = ({ startTime, endTime, classPrefix, month }) => {
  const formattedStart = moment(startTime).format('hh:mm A');
  const formattedEnd = moment(endTime).format('hh:mm A');
  const isSameDay = moment(startTime).isSame(moment(endTime), 'day');
  const formattedStartDate = moment(startTime).format('MMM D');
  const formattedEndDate = moment(endTime).format('MMM D');

  return (

    <Typography className={`${classPrefix}`}>
      {month
        ? `(${formattedStartDate}` + (isSameDay ? '' : ` -${formattedEndDate})`)
        : `${formattedStart}` +
        (isSameDay ? '' : ` (${formattedStartDate})`) +
        ` - ${formattedEnd}` +
        (isSameDay ? '' : ` (${formattedEndDate})`)}
    </Typography>
  );
};

export default TimeComponent;
