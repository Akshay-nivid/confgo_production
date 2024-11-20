import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface ResendOtpTimerProps {
  onResend: () => void;  
  initialTime: number;  
  isResendDisabled: boolean;  
  setIsResendDisabled: React.Dispatch<React.SetStateAction<boolean>>; 
  buttonLabel: string;
  className?: string;  
}

const ResendOtpTimer: React.FC<ResendOtpTimerProps> = ({
  onResend,
  initialTime,
  isResendDisabled,
  setIsResendDisabled,
  buttonLabel,
  className = '', 
}) => {
  const [timer, setTimer] = useState(initialTime);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled, setIsResendDisabled]);

  const handleResend = () => {
    if (!isResendDisabled) {
      onResend();
      setIsResendDisabled(true);
      setTimer(initialTime);
    }
  };

  useEffect(() => {
    if (isInitialLoad) {
      setIsResendDisabled(true);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, setIsResendDisabled]);

  return (
    <Button
      onClick={handleResend}
      className={`${className} ${
        isResendDisabled ? `${className}-disabled` : ''
      }`}
      disabled={isResendDisabled}
    >
      {isResendDisabled ? `${buttonLabel} (${timer}s)` : buttonLabel}
    </Button>
  );
};

export default ResendOtpTimer;
