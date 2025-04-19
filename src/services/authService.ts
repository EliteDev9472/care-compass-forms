
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${API_URL}/auth/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  return response.data;
};
