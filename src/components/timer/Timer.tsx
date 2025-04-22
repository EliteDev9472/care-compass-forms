
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { startTimer, stopTimer } from '../../store/timerSlice';

interface TimerProps {
  formId: string;
}

const Timer: React.FC<TimerProps> = ({ formId }) => {
  const dispatch = useAppDispatch();
  const { isRunning, startTime, elapsedTime, currentFormId } = useAppSelector(state => state.timer);
  const [displayTime, setDisplayTime] = useState('00:00');
  
  // Format time as MM:SS
  const formatTime = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const currentElapsed = elapsedTime + (Date.now() - startTime);
        setDisplayTime(formatTime(currentElapsed));
      }, 1000);
    } else {
      setDisplayTime(formatTime(elapsedTime));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, elapsedTime]);
  
  const handleStartStop = () => {
    if (isRunning) {
      dispatch(stopTimer());
      
      // Calculate total minutes for billing (rounded to nearest minute)
      const totalMinutes = Math.round(elapsedTime / 60000);

    } else {
      dispatch(startTimer(formId));
    }
  };
  
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="text-4xl font-mono font-bold">{displayTime}</div>
      <button
        onClick={handleStartStop}
        className={`px-6 py-2 text-white rounded-md ${
          isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default Timer;
