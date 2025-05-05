import { User } from '../models/types';

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

  login(email: string, password: string): Promise<User | null> {
    return new Promise((resolve) => {
      // Mock authentication - in a real app, verify credentials
      const user = AuthService.users.find(u => u.email === email);
      resolve(user || null);
    });
  }

  register(email: string, name: string, password: string): Promise<User> {
    return new Promise((resolve) => {
      // In a real app, verify email doesn't exist, hash password, etc.
      const newUser: User = {
        id: `${AuthService.users.length + 1}`,
        email,
        name,
        walletId: `wallet${AuthService.users.length + 1}`,
      };

      AuthService.users.push(newUser);
      resolve(newUser);
    });
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
