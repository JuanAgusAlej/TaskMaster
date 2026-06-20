import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../authService';
import { User } from '../../types';

describe('authService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const dummyUser: User = {
    username: 'testuser',
    password: 'password123',
  };

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const result = await authService.registerUser(dummyUser);
      expect(result).toBe(true);

      const storedUsers = await AsyncStorage.getItem('@users');
      expect(storedUsers).toBeDefined();
      const parsed = JSON.parse(storedUsers!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].username).toBe(dummyUser.username);
    });

    it('should not register a user with a duplicate username', async () => {
      await authService.registerUser(dummyUser);
      const duplicateUser: User = { username: 'testuser', password: 'newpassword' };
      const result = await authService.registerUser(duplicateUser);
      expect(result).toBe(false);

      const storedUsers = await AsyncStorage.getItem('@users');
      const parsed = JSON.parse(storedUsers!);
      expect(parsed).toHaveLength(1);
    });

    it('should return false if storage setItem throws', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage failure'));

      const result = await authService.registerUser(dummyUser);
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loginUser', () => {
    it('should login successfully with correct credentials', async () => {
      await authService.registerUser(dummyUser);
      const result = await authService.loginUser('testuser', 'password123');
      expect(result).toBe(true);

      const currentUser = await AsyncStorage.getItem('@currentUser');
      expect(currentUser).toBe('testuser');
    });

    it('should fail login with incorrect credentials', async () => {
      await authService.registerUser(dummyUser);
      const result = await authService.loginUser('testuser', 'wrongpassword');
      expect(result).toBe(false);

      const currentUser = await AsyncStorage.getItem('@currentUser');
      expect(currentUser).toBeNull();
    });

    it('should return false if storage throws during login', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage failure'));

      const result = await authService.loginUser('testuser', 'password123');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('setCurrentUser', () => {
    it('should set current user in storage', async () => {
      await authService.setCurrentUser('anotheruser');
      const currentUser = await AsyncStorage.getItem('@currentUser');
      expect(currentUser).toBe('anotheruser');
    });

    it('should log error if storage throws during setCurrentUser', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage failure'));

      await authService.setCurrentUser('user');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null if no current user', async () => {
      const result = await authService.getCurrentUser();
      expect(result).toBeNull();
    });

    it('should return current user name', async () => {
      await AsyncStorage.setItem('@currentUser', 'john');
      const result = await authService.getCurrentUser();
      expect(result).toBe('john');
    });

    it('should return null and log error if storage throws during getCurrentUser', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage failure'));

      const result = await authService.getCurrentUser();
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('should remove current user from storage', async () => {
      await AsyncStorage.setItem('@currentUser', 'john');
      await authService.logout();
      const currentUser = await AsyncStorage.getItem('@currentUser');
      expect(currentUser).toBeNull();
    });

    it('should log error if storage throws during logout', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'removeItem').mockRejectedValueOnce(new Error('Storage failure'));

      await authService.logout();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
