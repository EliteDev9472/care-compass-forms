import axiosInstance from './axiosConfig';
import { SERVER_URL } from '@/config';

interface TimerData {
    staffs: any[]
}

export interface TimerTrackingRecord {
    id: string;
    staffName: string;
    patientName: string;
    templateTitle: string;
    date: string;
    billingMinutes: string;
    addedByName: String;
    addedAt: string;
}

export const getAllTimer = async (): Promise<TimerData> => {
    const response = await axiosInstance.get(`${SERVER_URL}/admin/manual-timer-data`);
    return response.data;
};

export const addTimer = async (data): Promise<any> => {
    const response = await axiosInstance.post(`${SERVER_URL}/admin/manual-timer-data`, data)
    return
}

export const getAllTracking = async (): Promise<TimerTrackingRecord[]> => {
    const response = await axiosInstance.get(`${SERVER_URL}/admin/all-manual-timer-data`);
    return response.data.manualTimers;
}