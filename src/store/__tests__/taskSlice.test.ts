import taskReducer, { loadTasks, addTaskAsync, updateTaskAsync, deleteTaskAsync } from '../taskSlice';
import { taskService } from '../../services/taskService';
import { configureStore } from '@reduxjs/toolkit';
import { Task } from '../../types';

jest.mock('../../services/taskService', () => ({
  taskService: {
    getTasks: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

describe('taskSlice', () => {
  const initialState = {
    items: [],
    loading: false,
  };

  const dummyTask: Task = {
    id: 'task-1',
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    priority: 'low',
    date: '2026-06-19',
    reminderTime: '2026-06-19T14:00:00Z',
    reminderConfig: '30min',
  };

  it('should return initial state', () => {
    expect(taskReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    it('should set loading to true when loadTasks is pending', () => {
      const state = taskReducer(initialState, loadTasks.pending(''));
      expect(state.loading).toBe(true);
    });

    it('should load tasks when loadTasks is fulfilled', () => {
      const state = taskReducer(
        { items: [], loading: true },
        loadTasks.fulfilled([dummyTask], '')
      );
      expect(state.items).toEqual([dummyTask]);
      expect(state.loading).toBe(false);
    });

    it('should set loading to false when loadTasks is rejected', () => {
      const state = taskReducer(
        { items: [], loading: true },
        loadTasks.rejected(new Error('fail'), '')
      );
      expect(state.loading).toBe(false);
    });

    it('should append task when addTaskAsync is fulfilled', () => {
      const state = taskReducer(initialState, addTaskAsync.fulfilled(dummyTask, '', { title: 'New' } as any));
      expect(state.items).toEqual([dummyTask]);
    });

    it('should update task in items list when updateTaskAsync is fulfilled', () => {
      const updatedTask = { ...dummyTask, title: 'Updated' };
      const state = taskReducer(
        { items: [dummyTask], loading: false },
        updateTaskAsync.fulfilled(updatedTask, '', dummyTask)
      );
      expect(state.items[0].title).toBe('Updated');
    });

    it('should remove task from items list when deleteTaskAsync is fulfilled', () => {
      const state = taskReducer(
        { items: [dummyTask], loading: false },
        deleteTaskAsync.fulfilled('task-1', '', 'task-1')
      );
      expect(state.items).toHaveLength(0);
    });
  });

  describe('integration with store', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          tasks: taskReducer,
        },
      });
      jest.clearAllMocks();
    });

    it('should dispatch loadTasks and update items', async () => {
      (taskService.getTasks as jest.Mock).mockResolvedValue([dummyTask]);
      await store.dispatch(loadTasks());
      expect(taskService.getTasks).toHaveBeenCalled();
      expect(store.getState().tasks.items).toEqual([dummyTask]);
    });

    it('should dispatch addTaskAsync and add task to items', async () => {
      (taskService.addTask as jest.Mock).mockResolvedValue(dummyTask);
      const newTaskData = { title: 'Task 1', description: 'Description 1', completed: false, priority: 'low' as const, date: '2026-06-19', reminderTime: '2026-06-19T14:00:00Z', reminderConfig: '30min' };
      await store.dispatch(addTaskAsync(newTaskData));
      expect(taskService.addTask).toHaveBeenCalledWith(newTaskData);
      expect(store.getState().tasks.items).toEqual([dummyTask]);
    });

    it('should dispatch updateTaskAsync and update matching task in store', async () => {
      (taskService.updateTask as jest.Mock).mockResolvedValue(undefined);
      await store.dispatch(loadTasks.fulfilled([dummyTask], ''));

      const updated = { ...dummyTask, title: 'Super Task' };
      await store.dispatch(updateTaskAsync(updated));
      expect(taskService.updateTask).toHaveBeenCalledWith(updated);
      expect(store.getState().tasks.items[0].title).toBe('Super Task');
    });

    it('should dispatch deleteTaskAsync and remove matching task from store', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
      await store.dispatch(loadTasks.fulfilled([dummyTask], ''));

      await store.dispatch(deleteTaskAsync('task-1'));
      expect(taskService.deleteTask).toHaveBeenCalledWith('task-1');
      expect(store.getState().tasks.items).toHaveLength(0);
    });
  });
});
