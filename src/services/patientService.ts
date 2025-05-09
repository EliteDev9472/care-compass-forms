
import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

export interface Patient {
  _id: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
  ccmStatus?: 'Simple' | 'Complex';
  patientConsent?: boolean;
  billingMinutes: number;
  billingHistory?: BillingHistoryItem[];
}

export interface BillingHistoryItem {
  date: string;
  minutes: number;
  _id?: string;
}

export interface PatientCreateData {
  name: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
  ccmStatus?: 'Simple' | 'Complex';
  patientConsent?: string;
}

export interface PatientUpdateData {
  name: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
  ccmStatus?: 'Simple' | 'Complex';
  patientConsent?: string;
}

export const getAllPatients = async (startDate?: string, endDate?: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/patients/?start=${startDate}&end=${endDate}`);
  return response.data;
};

export const getPatient = async (patientId: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/patient/${patientId}`);
  return response.data;
};

export const createPatient = async (patientData: PatientCreateData) => {
  const response = await axiosInstance.post(`${SERVER_URL}/admin/create-patient`, patientData);
  return response.data;
};

export const updatePatient = async (patientId: string, patientData: PatientUpdateData) => {
  const response = await axiosInstance.put(`${SERVER_URL}/admin/edit-patient/${patientId}`, patientData);
  return response.data;
};

export const deletePatient = async (patientId: string) => {
  const response = await axiosInstance.delete(`${SERVER_URL}/admin/delete-patient/${patientId}`);
  return response.data;
};

export const updatePatientBillingMinutes = async (patientId: string, date: string, minutes: number) => {
  const response = await axiosInstance.post(`${SERVER_URL}/admin/patient/${patientId}/billing-minutes`, {
    date,
    minutes
  });
  return response.data;
};
