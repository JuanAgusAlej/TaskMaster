import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { notificationService } from '../notificationService';
import { Task } from '../../types';

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerForPushNotifications', () => {
    let originalOS: string;
    const originalIsDevice = Device.isDevice;

    beforeEach(() => {
      originalOS = Platform.OS;
    });

    afterEach(() => {
      Platform.OS = originalOS;
      // @ts-ignore
      Device.isDevice = originalIsDevice;
    });

    it('should set notification channel on Android and request permission if is physical device', async () => {
      Platform.OS = 'android';
      // @ts-ignore
      Device.isDevice = true;

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'undetermined' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

      await notificationService.registerForPushNotifications();

      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith('default', expect.objectContaining({
        name: 'default',
        importance: 4,
      }));
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should not request permissions if device is not physical', async () => {
      Platform.OS = 'ios';
      // @ts-ignore
      Device.isDevice = false;

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await notificationService.registerForPushNotifications();

      expect(Notifications.getPermissionsAsync).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Must use physical device for Push Notifications');
      consoleWarnSpy.mockRestore();
    });

    it('should log warning if permissions are denied', async () => {
      Platform.OS = 'ios';
      // @ts-ignore
      Device.isDevice = true;

      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await notificationService.registerForPushNotifications();

      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to get push token for push notification!');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('scheduleTaskReminder', () => {
    const dummyTask: Task = {
      id: 'task-123',
      title: 'Reminder Task',
      description: 'Detail of reminder task',
      completed: false,
      priority: 'high',
      date: '2026-06-19',
      reminderTime: '2026-06-19T14:00:00Z',
      reminderConfig: '30min',
    };

    it('should schedule notification and return its id', async () => {
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('notif-id-abc');
      const triggerDate = new Date('2026-06-19T13:30:00Z');

      const result = await notificationService.scheduleTaskReminder(dummyTask, triggerDate);
      expect(result).toBe('notif-id-abc');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.objectContaining({
          title: 'Recordatorio de Tarea: Reminder Task',
          body: 'Detail of reminder task',
          data: { taskId: 'task-123' },
        }),
        trigger: expect.objectContaining({
          date: triggerDate,
        }),
      }));
    });

    it('should use default body if task description is not set', async () => {
      const taskNoDesc = { ...dummyTask, description: undefined };
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('notif-id-abc');

      const result = await notificationService.scheduleTaskReminder(taskNoDesc, new Date());
      expect(result).toBe('notif-id-abc');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.objectContaining({
          body: 'Es tiempo para la tarea!',
        }),
      }));
    });

    it('should return empty string and log error if scheduling throws', async () => {
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(new Error('Schedule error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await notificationService.scheduleTaskReminder(dummyTask, new Date());
      expect(result).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
