
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { startTimer, stopTimer } from '../../store/timerSlice';
import { toast } from 'sonner';

interface TimerProps {
  formId: string;
}

const Timer: React.FC<TimerProps> = ({ formId }) => {
  const dispatch = useAppDispatch();
  const { isRunning, startTime, elapsedTime, currentFormId, timerSessions } = useAppSelector(state => state.timer);
  const { currentForm } = useAppSelector(state => state.patients)
  const [displayTime, setDisplayTime] = useState(currentForm.billingTime);
  const [defaultSeconds, setDefaultSeconds] = useState<number>(parseInt(currentForm.billingTime.split(':')[0]) * 60 + parseInt(currentForm.billingTime.split(':')[1]))
  const { user } = useAppSelector(state => state.auth)

  // Format time as MM:SS
  const formatTime = (timeInMs: number): string => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (user.role == 'client')
      setDisplayTime(formatTime(defaultSeconds))
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const currentElapsed = elapsedTime + (Date.now() - startTime);
        setDisplayTime(formatTime(defaultSeconds * 1000 + currentElapsed));
      }, 1000);
    } else {
      setDisplayTime(formatTime(defaultSeconds * 1000 + elapsedTime));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, elapsedTime]);

  const handleStartStop = () => {
    if (isRunning) {
      dispatch(stopTimer());

      // Check if we have multiple sessions (split across days)
      if (timerSessions.length > 0) {
        const lastSessionIndex = timerSessions.length - 1;
        const prevSessionIndex = timerSessions.length - 2;

        if (prevSessionIndex >= 0 && timerSessions[lastSessionIndex].startedAt !== timerSessions[prevSessionIndex].startedAt) {
          toast.success('Timer stopped and multiple sessions recorded across days');
        } else {
          toast.success('Timer stopped and session recorded');
        }
      } else {
        toast.success('Timer stopped and session recorded');
      }
    } else {
      dispatch(startTimer(formId));
      toast.success('Timer started');
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="text-4xl font-mono font-bold">{displayTime}</div>
      {
        (user.role == 'staff' || user.role == 'admin') && (
          <button
            onClick={handleStartStop}
            className={`px-6 py-2 text-white rounded-md ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
        )
      }

    </div>
  );
};

export default Timer;
