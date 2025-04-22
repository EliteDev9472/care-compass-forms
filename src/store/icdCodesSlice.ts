
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ICDCode {
  code: string;
  description: string;
}

interface ICDCodeState {
  codes: ICDCode[];
  searchTerm: string;
  searchResults: ICDCode[];
  loading: boolean;
  error: string | null;
}

// Async thunk to load ICD codes from the JSON file
export const loadICDCodes = createAsyncThunk('icdCodes/loadICDCodes', async () => {
  const response = await axios.get('/ICD.json');
  return response.data;
});

const initialState: ICDCodeState = {
  codes: [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'M19.90', description: 'Osteoarthritis, unspecified site' },
    { code: 'G89.29', description: 'Other chronic pain' }
  ],
  searchTerm: '',
  searchResults: [],
  loading: false,
  error: null
};

const icdCodesSlice = createSlice({
  name: 'icdCodes',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      // Filter search results and limit to top 10
      if (action.payload.trim() === '') {
        state.searchResults = [];
      } else {
        state.searchResults = state.codes
          .filter(code => 
            code.code.toLowerCase().includes(action.payload.toLowerCase()) || 
            code.description.toLowerCase().includes(action.payload.toLowerCase())
          )
          .slice(0, 10); // Show only top 10 matches
      }
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadICDCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadICDCodes.fulfilled, (state, action) => {
        state.codes = action.payload;
        state.loading = false;
      })
      .addCase(loadICDCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load ICD codes';
      });
  }
});

export const { setSearchTerm, clearSearch } = icdCodesSlice.actions;
export default icdCodesSlice.reducer;
