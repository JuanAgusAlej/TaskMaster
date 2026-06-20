import AsyncStorage from '@react-native-async-storage/async-storage';
import { taskService } from '../taskService';
import { authService } from '../authService';
import { calendarService } from '../calendarService';
import { Task } from '../../types';

jest.mock('../authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
  },
}));

jest.mock('../calendarService', () => ({
  calendarService: {
    deleteEvent: jest.fn(),
  },
}));

describe('taskService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  const dummyTask: Omit<Task, 'id'> = {
    title: 'Test Task',
    description: 'Test description',
    completed: false,
    priority: 'medium',
    date: '2026-06-19',
    reminderTime: '2026-06-19T14:00:00Z',
    reminderConfig: '30min',
  };

  describe('getTasksKey error', () => {
    it('should throw an error when getTasks is called but no user is logged in', async () => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await taskService.getTasks();
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('with logged in user', () => {
    beforeEach(() => {
      (authService.getCurrentUser as jest.Mock).mockResolvedValue('john');
    });

    it('should return empty array if no tasks are stored', async () => {
      const result = await taskService.getTasks();
      expect(result).toEqual([]);
    });

    it('should add and retrieve tasks', async () => {
      const newTask = await taskService.addTask(dummyTask);
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe(dummyTask.title);

      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0]).toEqual(newTask);
    });

    it('should get task by id', async () => {
      const newTask = await taskService.addTask(dummyTask);
      const fetchedTask = await taskService.getTaskById(newTask.id);
      expect(fetchedTask).toEqual(newTask);

      const nonExistent = await taskService.getTaskById('non-existent-id');
      expect(nonExistent).toBeNull();
    });

    it('should return null and log error if getTaskById throws', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(taskService, 'getTasks').mockRejectedValueOnce(new Error('Retrieval failure'));

      const result = await taskService.getTaskById('id');
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when adding task fails due to storage write exception', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage set failure'));

      await expect(taskService.addTask(dummyTask)).rejects.toThrow('Storage set failure');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should update task successfully', async () => {
      const newTask = await taskService.addTask(dummyTask);
      const updated: Task = { ...newTask, title: 'Updated Title', completed: true };
      
      await taskService.updateTask(updated);
      const fetched = await taskService.getTaskById(newTask.id);
      expect(fetched?.title).toBe('Updated Title');
      expect(fetched?.completed).toBe(true);
    });

    it('should throw error when updating task fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const newTask = await taskService.addTask(dummyTask);
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage update failure'));
      await expect(taskService.updateTask(newTask)).rejects.toThrow('Storage update failure');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should delete task and trigger calendar deletion if event exists', async () => {
      const taskWithEvent: Omit<Task, 'id'> = {
        ...dummyTask,
        calendarEventId: 'event-123',
      };
      const newTask = await taskService.addTask(taskWithEvent);
      
      (calendarService.deleteEvent as jest.Mock).mockResolvedValue(true);
      await taskService.deleteTask(newTask.id);

      expect(calendarService.deleteEvent).toHaveBeenCalledWith('event-123');
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(0);
    });

    it('should handle calendar deletion failure gracefully when deleting task', async () => {
      const taskWithEvent: Omit<Task, 'id'> = {
        ...dummyTask,
        calendarEventId: 'event-123',
      };
      const newTask = await taskService.addTask(taskWithEvent);
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (calendarService.deleteEvent as jest.Mock).mockRejectedValueOnce(new Error('Calendar error'));
      await taskService.deleteTask(newTask.id);

      expect(calendarService.deleteEvent).toHaveBeenCalledWith('event-123');
      const tasks = await taskService.getTasks();
      expect(tasks).toHaveLength(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when deleting task fails due to storage error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const newTask = await taskService.addTask(dummyTask);
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Delete storage error'));
      await expect(taskService.deleteTask(newTask.id)).rejects.toThrow('Delete storage error');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
