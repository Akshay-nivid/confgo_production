import React, { useState, useEffect } from 'react';

interface ResendOtpTimerProps {
    initialTime: number;
    isResendDisabled: boolean;
    setIsResendDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}
/**
 * Custom Timer component used for countdown functionality
 */
const CustomTimer: React.FC<ResendOtpTimerProps> = ({
    initialTime,
    isResendDisabled,
    setIsResendDisabled,
    className = '',
}) => {
    const [timer, setTimer] = useState(initialTime);
    /**
     * useEffect hook to manage the countdown timer
     */
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
        /**
         * Cleanup function to clear the interval when the component unmounts or dependencies change
         */
        return () => clearInterval(interval);
    }, [isResendDisabled, initialTime, setIsResendDisabled]);

    return (
        <span className={className}>
            {isResendDisabled ? `0:${timer}` : null}
        </span>
    );
};

export default CustomTimer;
