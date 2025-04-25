
import { StaffPatient } from '@/services/staffService';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  name: string;
  clientId: string; // The client/practice this patient belongs to
  assignedStaffIds: string[]; // Staff members assigned to this patient
  totalBillingTime: number; // Total time in minutes
}

export interface PatientForm {
  id: string;
  patientId: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  templateFields: any;
  billingTime: string; // Time in minutes
  data: (string | boolean)[]; // Form data
}

interface PatientState {
  patients: Patient[];
  forms: PatientForm[];
  loading: boolean;
  error: string | null;
  currentPatient: StaffPatient | null;
  currentForm: PatientForm | null;
}

const initialState: PatientState = {
  patients: [],
  forms: [],
  loading: false,
  error: null,
  currentPatient: null,
  currentForm: null
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    fetchPatientsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
      state.loading = false;
    },
    fetchPatientsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPatient(state, action: PayloadAction<StaffPatient | null>) {
      state.currentPatient = action.payload;
    },

    // Forms
    fetchFormsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFormsSuccess(state, action: PayloadAction<PatientForm[]>) {
      state.forms = action.payload;
      state.loading = false;
    },
    fetchFormsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentForm(state, action: PayloadAction<PatientForm | null>) {
      state.currentForm = action.payload;
    },
  }
});

export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  setCurrentPatient,
  fetchFormsStart,
  fetchFormsSuccess,
  fetchFormsFailure,
  setCurrentForm
} = patientSlice.actions;

export default patientSlice.reducer;
