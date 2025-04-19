
import axios from 'axios';
import { SERVER_URL } from '@/config';

export interface FormField {
  type: 'heading' | 'text-input' | 'text-field' | 'icd-text' | 'dropdown' | 'checkbox' | 'radio' | 'rich-text';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
}

export const createFormTemplate = async (template: Omit<FormTemplate, 'id'>): Promise<FormTemplate> => {
  const response = await axios.post(`${SERVER_URL}/admin/create-form-template`, template);
  return response.data;
};

export const getAllTemplates = async (): Promise<FormTemplate[]> => {
  const response = await axios.get(`${SERVER_URL}/forms/templates`);
  return response.data;
};

export const getTemplateById = async (templateId: string): Promise<FormTemplate> => {
  const response = await axios.get(`${SERVER_URL}/admin/form-template/${templateId}`);
  return response.data;
};

export const updateTemplate = async (templateId: string, template: Omit<FormTemplate, 'id'>): Promise<FormTemplate> => {
  const response = await axios.put(`${SERVER_URL}/admin/edit-form-template/${templateId}`, template);
  return response.data;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  await axios.delete(`${SERVER_URL}/admin/delete-form-template/${templateId}`);
};
