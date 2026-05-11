import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@currentUser';

export const authService = {
  async registerUser(user: User): Promise<boolean> {
    try {
      const usersStr = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];

      if (users.find(u => u.username === user.username)) {
        return false; 
      }

      users.push(user);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  },

  async loginUser(username: string, password: string): Promise<boolean> {
    try {
      const usersStr = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersStr ? JSON.parse(usersStr) : [];

      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        await this.setCurrentUser(username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  },

  async setCurrentUser(username: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  async getCurrentUser(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};
