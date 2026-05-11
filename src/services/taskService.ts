import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { authService } from './authService';

const getTasksKey = async () => {
  const username = await authService.getCurrentUser();
  if (!username) throw new Error('No user logged in');
  return `@tasks_${username}`;
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const key = await getTasksKey();
      const tasksStr = await AsyncStorage.getItem(key);
      return tasksStr ? JSON.parse(tasksStr) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const tasks = await this.getTasks();
      return tasks.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error getting task by id:', error);
      return null;
    }
  },

  async addTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    try {
      const key = await getTasksKey();
      const tasks = await this.getTasks();
      const newTask: Task = {
        ...taskData,
        id: uuidv4(),
      };
      tasks.push(newTask);
      await AsyncStorage.setItem(key, JSON.stringify(tasks));
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async updateTask(updatedTask: Task): Promise<void> {
    try {
      const key = await getTasksKey();
      const tasks = await this.getTasks();
      const index = tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
        await AsyncStorage.setItem(key, JSON.stringify(tasks));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const key = await getTasksKey();
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(t => t.id !== id);
      await AsyncStorage.setItem(key, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
