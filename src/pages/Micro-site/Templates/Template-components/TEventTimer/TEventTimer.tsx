
import React, { useState, useEffect, useMemo } from 'react'
import { Box } from '@mui/material'
import clsx from 'clsx'
import './timer.scss'
import useStore from '@/Libs/store';
import { IEventResponse } from '@/Libs/types/event';

/**
 * TEventTimer is a React functional component that displays a countdown timer
 * based on the event's start time retrieved from a global store.
 * 
 * Props:
 * - className (string, optional): An optional CSS class name for custom styling.
 * 
 * Functionality:
 * - Calculates the time remaining until the event start time.
 * - Updates the countdown every second using a setInterval.
 * - Stops updating when the countdown reaches zero.
 * 
 * Returns:
 * - A JSX element that displays the countdown in days, hours, minutes, and seconds.
 */

const TEventTimer = ({ className }: {
  className?: string,
}) => {

  const event: IEventResponse = useStore(state => state.compData?.['event']?.data);
  const target = useMemo(() => new Date(event?.startTime).getTime(), [event?.startTime]);


  const calculateTimeLeft = () => {
    const difference = target - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft();
      setTimeLeft(currentTimeLeft);

      if (currentTimeLeft.days === 0 &&
        currentTimeLeft.hours === 0 &&
        currentTimeLeft.minutes === 0 &&
        currentTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <Box className={clsx('template-timer', className)}>
      <Box className='group'>
        <Box className='value-container'>
          <p className='day-value value'>{timeLeft.days.toString().padStart(2, '0')}</p>
        </Box>
        <p className='day-label label'>Days</p>
      </Box>
      <Box className='group'>
        <Box className='value-container'>
          <p className='hour-value value'>{timeLeft.hours.toString().padStart(2, '0')}</p>
        </Box>
        <p className='hour-label label'>Hours</p>
      </Box>
      <Box className='group'>
        <Box className='value-container'>
          <p className='minute-value value'>{timeLeft.minutes.toString().padStart(2, '0')}</p>
        </Box>
        <p className='minute-label label'>Minutes</p>
      </Box>
      <Box className='group'>
        <Box className='value-container'>
          <p className='second-value value'>{timeLeft.seconds.toString().padStart(2, '0')}</p>
        </Box>
        <p className='second-label label'>Seconds</p>
      </Box>
    </Box>
  );
};

export default React.memo(TEventTimer);