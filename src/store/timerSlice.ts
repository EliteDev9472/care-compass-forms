
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format, differenceInMinutes, addDays, isSameDay } from 'date-fns';

export interface TimerSession {
  startedAt: string;
  stoppedAt: string;
  durationMinutes: number;
}

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; // Total elapsed time in milliseconds
  currentFormId: string | null;
  timerSessions: TimerSession[];
}

const initialState: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
  currentFormId: null,
  timerSessions: []
};

// Helper function to split timer sessions across midnight
const splitTimerSessionsByDate = (startTime: number, endTime: number): TimerSession[] => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  // If same day, return single session
  if (isSameDay(startDate, endDate)) {
    return [{
      startedAt: new Date(startTime).toString(),
      stoppedAt: new Date(endTime).toString(),
      durationMinutes: Math.round(differenceInMinutes(endDate, startDate))
    }];
  }
  
  // Find midnight between the dates
  const midnight = new Date(startDate);
  midnight.setHours(23, 59, 59, 999);
  
  // Create first session (from start to midnight)
  const firstSession: TimerSession = {
    startedAt: startDate.toString(),
    stoppedAt: midnight.toString(),
    durationMinutes: Math.round(differenceInMinutes(midnight, startDate))
  };
  
  // Create second session (from midnight+1ms to end)
  const nextDay = addDays(startDate, 1);
  nextDay.setHours(0, 0, 0, 0);
  
  const secondSession: TimerSession = {
    startedAt: nextDay.toString(),
    stoppedAt: endDate.toString(),
    durationMinutes: Math.round(differenceInMinutes(endDate, nextDay))
  };
  
  return [firstSession, secondSession];
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer(state, action: PayloadAction<string>) {
      state.isRunning = true;
      state.startTime = Date.now();
      state.currentFormId = action.payload;
    },
    stopTimer(state) {
      if (state.isRunning && state.startTime) {
        const now = Date.now();
        state.elapsedTime += now - state.startTime;
        
        // Split timer session if it crosses midnight
        const sessions = splitTimerSessionsByDate(state.startTime, now);
        state.timerSessions.push(...sessions);
      }
      state.isRunning = false;
      state.startTime = null;
    },
    resetTimer(state) {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = 0;
      state.currentFormId = null;
      state.timerSessions = [];
    },
    setCurrentFormId(state, action: PayloadAction<string | null>) {
      state.currentFormId = action.payload;
    },
    addTimerSession(state, action: PayloadAction<TimerSession>) {
      state.timerSessions.push(action.payload);
    },
    clearTimerSessions(state) {
      state.timerSessions = [];
    }
  }
});

export const { startTimer, stopTimer, resetTimer, setCurrentFormId, addTimerSession, clearTimerSessions } = timerSlice.actions;
export default timerSlice.reducer;
