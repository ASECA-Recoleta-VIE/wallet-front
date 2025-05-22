import { User } from '../models/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class AuthService {
  private static users: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      name: 'User One',
      walletId: 'wallet1',
    },
    {
      id: '2',
      email: 'user2@example.com',
      name: 'User Two',
      walletId: 'wallet2',
    },
  ];

  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      return response.data as User;
    } catch (error: any) {
      // eslint-disable-next-line no-console
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
      const response = await axios.post(`${API_URL}/api/users/register`, {
        fullName: name,
        email,
        password,
      });
      // Asumimos que el backend devuelve el usuario creado en el body
      return response.data as User;
    } catch (error: any) {
      // eslint-disable-next-line no-console
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

  getCurrentUser(): Promise<User | null> {
    // In a real app, verify a token from localStorage or cookies
    return Promise.resolve(AuthService.users[0]); // Mock for demo purposes
  }

  getUserByEmail(email: string): Promise<User | null> {
    return Promise.resolve(AuthService.users.find(u => u.email === email) || null);
  }

  getUserById(id: string): Promise<User | null> {
    return Promise.resolve(AuthService.users.find(u => u.id === id) || null);
  }
  logout(): Promise<void> {
    return Promise.resolve(); // In a real app, clear tokens/cookies
  }
}

export default new AuthService();
