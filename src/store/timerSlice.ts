
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; // Total elapsed time in milliseconds
  currentFormId: string | null;
}

const initialState: TimerState = {
  isRunning: false,
  startTime: null,
  elapsedTime: 0,
  currentFormId: null
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
      }
      state.isRunning = false;
      state.startTime = null;
    },
    resetTimer(state) {
      state.isRunning = false;
      state.startTime = null;
      state.elapsedTime = 0;
      state.currentFormId = null;
    },
    setCurrentFormId(state, action: PayloadAction<string | null>) {
      state.currentFormId = action.payload;
    }
  }
});

export const { startTimer, stopTimer, resetTimer, setCurrentFormId } = timerSlice.actions;
export default timerSlice.reducer;
