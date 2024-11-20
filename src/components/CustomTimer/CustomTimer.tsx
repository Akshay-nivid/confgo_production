import React, { useState, useEffect } from 'react';

interface ResendOtpTimerProps {
  initialTime: number;
  isResendDisabled: boolean;
  setIsResendDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CustomTimer: React.FC<ResendOtpTimerProps> = ({
  initialTime,
  isResendDisabled,
  setIsResendDisabled,
  className = '',
}) => {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (!isResendDisabled) return;

    setTimer(initialTime);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResendDisabled, initialTime, setIsResendDisabled]);

  return (
    <span className={className}>
      {isResendDisabled ? `:0:${timer}` : null}
    </span>
  );
};

export default CustomTimer;
