import React from 'react';
import { Typography } from '@mui/material';
import moment from 'moment';

interface TimeComponentProps {
  startTime: string;
  endTime: string;
  classPrefix: string;
}

const TimeComponent: React.FC<TimeComponentProps> = ({ startTime, endTime, classPrefix }) => {
  const formattedStart = moment(startTime).format('hh:mm A');
  const formattedEnd = moment(endTime).format('hh:mm A');
  const isSameDay = moment(startTime).isSame(moment(endTime), 'day');

  return (
    <Typography className={`${classPrefix}`}>
      {`${formattedStart}` +
        (isSameDay ? '' : ` (${moment(startTime).format('MMM D')})`) +
        ` - ${formattedEnd}` +
        (isSameDay ? '' : ` (${moment(endTime).format('MMM D')})`)}
    </Typography>
  );
};

export default TimeComponent;
