
import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

export interface Patient {
  _id: string;
  name: string;
  client: {
    _id: string;
    username: string;
    name: string;
  };
  assignedStaff: {
    _id: string;
    username: string;
    name: string;
  };
}

export interface PatientCreateData {
  name: string;
  clientId: string;
  staffId: string;
}

export interface PatientUpdateData {
  name: string;
  staffId: string;
}

export const getAllPatients = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/patients`);
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
