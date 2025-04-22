
import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

export interface FormField {
  type: 'heading' | 'text-input' | 'text-field' | 'icd-text' | 'dropdown' | 'checkbox' | 'radio' | 'rich-text' | 'textbox' | 'timer';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  roleVisibleTo?: string[];
}

export interface TimerSession {
  startedAt: string;
  stoppedAt: string;
  durationMinutes: number;
}

export interface FormSubmission {
  _id: string;
  template: string;
  patient: string;
  staff: string;
  data: Record<string, any>;
  timerSessions: TimerSession[];
}

export interface FormTemplate {
  _id: string;
  name: string;
  fields: FormField[];
  submission?: FormSubmission | null;
  billingMinutes?: number;
}

export const createFormTemplate = async (template: Omit<FormTemplate, 'id'>): Promise<FormTemplate> => {
  const response = await axiosInstance.post(`${SERVER_URL}/admin/create-form-template`, template);
  return response.data;
};

export const getAllTemplates = async (): Promise<FormTemplate[]> => {
  const response = await axiosInstance.get(`${SERVER_URL}/forms/templates`);
  return response.data;
};

export const getTemplateById = async (templateId: string): Promise<FormTemplate> => {
  const response = await axiosInstance.get(`${SERVER_URL}/admin/form-template/${templateId}`);
  return response.data;
};

export const updateTemplate = async (templateId: string, template: Omit<FormTemplate, 'id'>): Promise<FormTemplate> => {
  const response = await axiosInstance.put(`${SERVER_URL}/admin/edit-form-template/${templateId}`, template);
  return response.data;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  await axiosInstance.delete(`${SERVER_URL}/admin/delete-form-template/${templateId}`);
};

export const getAllTemplatesWithInfo = async (): Promise<FormTemplate[]> => {
  const response = await axiosInstance.get(`${SERVER_URL}/forms/templates`);
  return response.data;
};

// New functions for staff role
export const getPatientFormsByTemplate = async (patientId: string, startDate?: string, endDate?: string): Promise<FormTemplate[]> => {
  const params = startDate && endDate ? `?start=${startDate}&end=${endDate}` : '';
  const response = await axiosInstance.get(`${SERVER_URL}/api/staff/patients/${patientId}/forms-by-template${params}`);
  return response.data;
};

export const submitFormWithTimerSessions = async (
  patientId: string,
  templateId: string,
  data: Record<string, any>,
  timerSessions: TimerSession[]
): Promise<any> => {
  const payload = {
    patientId,
    templateId,
    data,
    timerSessions
  };
  
  const response = await axiosInstance.post(`${SERVER_URL}/api/staff/form-submit`, payload);
  return response.data;
};
