
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
        
        // Add timer session
        const startedAt = new Date(state.startTime).toISOString();
        const stoppedAt = new Date(now).toISOString();
        const durationMinutes = Math.round((now - state.startTime) / 60000);
        
        state.timerSessions.push({
          startedAt,
          stoppedAt,
          durationMinutes
        });
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
