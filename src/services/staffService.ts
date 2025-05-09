import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

// Types
export interface Staff {
  _id: string;
  username: string;
  name: string;
  isActive: boolean;
  billingMinutes?: number;
}

export interface StaffEditData extends Staff {
  assignedPatients: { _id: string; name: string }[];
  unassignedPatients: { _id: string; name: string }[];
}

export interface StaffCreateData {
  username: string;
  password: string;
  name: string;
  patientIds: string[];
}

export interface StaffUpdateData {
  username: string;
  password?: string;
  name: string;
  isActive: boolean;
  patientIds: string[];
}

export interface StaffPatient {
  _id: string;
  name: string;
  billingMinutes: number;
}

export const getAllStaffs = async (startDate?: string, endDate?: string) => {
  const params =
    startDate && endDate
      ? `?start=${startDate}&end=${endDate}`
      : '';
  const response = await axiosInstance.get(`${SERVER_URL}/admin/staffs${params}`);
  return response.data;
};

export const getStaff = async (staffId: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/staff-edit/${staffId}`);
  return response.data;
};

export const createStaff = async (staffData: StaffCreateData) => {
  const response = await axiosInstance.post(`${SERVER_URL}/admin/create-staff`, staffData);
  return response.data;
};

export const updateStaff = async (staffId: string, staffData: StaffUpdateData) => {
  const response = await axiosInstance.put(
    `${SERVER_URL}/admin/edit-staff/${staffId}`,
    staffData
  );
  return response.data;
};

export const deleteStaff = async (staffId: string) => {
  const response = await axiosInstance.delete(`${SERVER_URL}/admin/delete-staff/${staffId}`);
  return response.data;
};

export const getUnassignedPatientsForStaff = async () => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/unassigned-patients-staff`);
  return response.data;
};

export const getMyAssignedPatients = async (start, end): Promise<StaffPatient[]> => {
  const response = await axiosInstance.get(`${SERVER_URL}/staff/my-patients?start=${start}&end=${end}`);
  return response.data;
};

export const getClientName = async (patientId: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/staff/client-by-patient/${patientId}`);
  return response.data;
};

export const getPatientInfo = async (patientId: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/staff/Patient-Info/${patientId}`);
  return response.data;
};
