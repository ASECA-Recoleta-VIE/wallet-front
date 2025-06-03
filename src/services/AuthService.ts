import axios from 'axios';
import { User } from '../models/types';

const API_URL = import.meta.env.VITE_API_URL;

class AuthService {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password }
      );
      return response.data === 'login-success';
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === 'object' && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      throw new Error(errorMessage);
    }
  }

  async register(email: string, name: string, password: string): Promise<User> {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/register`,
        {
          fullName: name,
          email,
          password,
        },
        { withCredentials: true }
      );
      return response.data as User;
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      if (error?.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (typeof error.response.data === 'object' && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      throw new Error(errorMessage);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_URL}/api/users/me`, {
        withCredentials: true,
      });
      return response.data as User;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}

export default new AuthService();