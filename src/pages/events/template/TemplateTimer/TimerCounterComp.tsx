import React, {useEffect } from "react";

interface TimerCounterProps {
  targetDate: string; 
  customStyles?: string; 
  children: React.ReactNode;
  onTimeUpdate: (day: string, hour: string, minute: string, second: string) => void; 
}

const TimerCounterComp: React.FC<TimerCounterProps> = React.memo(({ targetDate, children, onTimeUpdate }) => {

  useEffect(() => {
    // Function to calculate the remaining time
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        // setTimeLeft("Time's up!");
        onTimeUpdate("0", "0", "0", "0");
      } else {
        const days = Math.floor(difference / (1000 * 3600 * 24));
        const hours = Math.floor((difference % (1000 * 3600 * 24)) / (1000 * 3600));
        const minutes = Math.floor((difference % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);        
        // Send the updated time to the parent
        onTimeUpdate(days.toString(), hours.toString(), minutes.toString(), seconds.toString());
      }
    };

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [targetDate, onTimeUpdate]);

  return (
    <>
      {children}
    </>
  );
});

export default TimerCounterComp;
