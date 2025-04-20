
import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

export interface Client {
  _id: string;
  username: string;
  name: string;
  isActive: boolean;
  billingMinutes: number;
}

export interface ClientEditData {
  _id: string;
  username: string;
  name: string;
  isActive: boolean;
  assignedStaff: Array<{
    _id: string;
    username: string;
    name: string;
  }>;
  unassignedStaff: Array<{
    _id: string;
    username: string;
    name: string;
  }>;
}

export const getClientsWithBilling = async (startDate?: string, endDate?: string) => {
  const params = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';
  const response = await axiosInstance.get(`${SERVER_URL}/api/admin/clients-with-billing${params}`);
  return response.data;
};

export const createClient = async (clientData: {
  username: string;
  password: string;
  name: string;
  staffIds: string[];
}) => {
  const response = await axiosInstance.post(`${SERVER_URL}/api/admin/create-client`, clientData);
  return response.data;
};

export const getClientForEdit = async (clientId: string) => {
  const response = await axiosInstance.get(`${SERVER_URL}/api/admin/client-edit/${clientId}`);
  return response.data;
};

export const updateClient = async (clientId: string, clientData: {
  username: string;
  name: string;
  password?: string;
  isActive: boolean;
  staffIds: string[];
}) => {
  const response = await axiosInstance.put(`${SERVER_URL}/api/admin/edit-client/${clientId}`, clientData);
  return response.data;
};

export const deleteClient = async (clientId: string) => {
  const response = await axiosInstance.delete(`${SERVER_URL}/api/admin/delete-user/${clientId}`);
  return response.data;
};
