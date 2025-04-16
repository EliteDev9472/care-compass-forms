
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICDCode {
  code: string;
  description: string;
}

interface ICDCodeState {
  codes: ICDCode[];
  searchTerm: string;
  searchResults: ICDCode[];
  loading: boolean;
}

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
  loading: false
};

const icdCodesSlice = createSlice({
  name: 'icdCodes',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      // Filter search results
      if (action.payload.trim() === '') {
        state.searchResults = [];
      } else {
        state.searchResults = state.codes.filter(code => 
          code.code.toLowerCase().includes(action.payload.toLowerCase()) || 
          code.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.searchResults = [];
    }
  }
});

export const { setSearchTerm, clearSearch } = icdCodesSlice.actions;
export default icdCodesSlice.reducer;
