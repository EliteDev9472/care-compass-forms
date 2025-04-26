
import { SERVER_URL } from '@/config';
import axiosInstance from './axiosConfig';

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
}

export interface ChangePasswordResponse {
  message: string;
}
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await axiosInstance.post(`${SERVER_URL}/auth/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const changePassword = async (old_password: string, password: string, confirm_password: string): Promise<ChangePasswordResponse> => {
  const params = new URLSearchParams();
  params.append('oldPassword', old_password);
  params.append('newPassword', password);
  params.append('confirmPassword', confirm_password);

  const response = await axiosInstance.post(`${SERVER_URL}/password/change-password`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};