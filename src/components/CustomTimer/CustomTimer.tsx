import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface ResendOtpTimerProps {
  onResend: () => void;  // Callback function to handle OTP resend
  initialTime: number;   // Initial countdown time (in seconds)
  isResendDisabled: boolean;  // Flag to control whether the resend button is disabled
  setIsResendDisabled: React.Dispatch<React.SetStateAction<boolean>>;  // Function to toggle resend button state
  buttonLabel: string;  // Customizable button label text
  className?: string;   // Optional className for styling
}

const ResendOtpTimer: React.FC<ResendOtpTimerProps> = ({
  onResend,
  initialTime,
  isResendDisabled,
  setIsResendDisabled,
  buttonLabel,
  className = '',  // Default to an empty string if no className is provided
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
