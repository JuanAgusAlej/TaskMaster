import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { useAutoCompleteTimerTasks } from '../useAutoCompleteTimerTasks';
import taskReducer, { updateTaskAsync } from '../../store/taskSlice';
import authReducer from '../../store/authSlice';
import { Task } from '../../types';

jest.mock('../../store/taskSlice', () => {
  const actual = jest.requireActual('../../store/taskSlice');
  return {
    __esModule: true,
    ...actual,
    updateTaskAsync: jest.fn((task) => ({ type: 'tasks/updateTaskAsync/mock', payload: task })),
  };
});

describe('useAutoCompleteTimerTasks', () => {
  let store: any;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  const getMockTasks = (): Task[] => [
    {
      id: 'task-expired',
      title: 'Expired timer task',
      completed: false,
      priority: 'high',
      date: '2026-06-19',
      reminderTime: new Date(Date.now() - 5000).toISOString(),
      reminderConfig: '10seg',
    },
    {
      id: 'task-future',
      title: 'Future timer task',
      completed: false,
      priority: 'medium',
      date: '2026-06-19',
      reminderTime: new Date(Date.now() + 50000).toISOString(),
      reminderConfig: '10min',
    },
    {
      id: 'task-regular',
      title: 'Expired regular task',
      completed: false,
      priority: 'low',
      date: '2026-06-19',
      reminderTime: new Date(Date.now() - 5000).toISOString(),
      reminderConfig: 'alert',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        tasks: taskReducer,
        auth: authReducer,
      },
      preloadedState: {
        tasks: {
          items: getMockTasks(),
          loading: false,
        },
        auth: {
          user: 'john',
          isAuthenticated: true,
          loading: false,
        },
      },
    });

    wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
  });

  it('should scan and auto-complete expired timer tasks on mount', async () => {
    renderHook(() => useAutoCompleteTimerTasks(), { wrapper });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalledTimes(1);
    });

    expect(updateTaskAsync).toHaveBeenCalledWith(expect.objectContaining({
      id: 'task-expired',
      completed: true,
    }));
  });

  it('should register notification listener and complete task when matching notification is received', async () => {
    let notificationCallback: (notification: any) => void = () => {};
    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation((cb) => {
      notificationCallback = cb;
      return { remove: jest.fn() };
    });

    renderHook(() => useAutoCompleteTimerTasks(), { wrapper });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalledTimes(1);
    });

    const mockNotification = {
      request: {
        content: {
          data: {
            taskId: 'task-future',
          },
        },
      },
    };

    await act(async () => {
      notificationCallback(mockNotification);
    });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalledTimes(2);
    });

    expect(updateTaskAsync).toHaveBeenLastCalledWith(expect.objectContaining({
      id: 'task-future',
      completed: true,
    }));
  });

  it('should not complete task if taskId in notification does not match a pending timer task', async () => {
    let notificationCallback: (notification: any) => void = () => {};
    (Notifications.addNotificationReceivedListener as jest.Mock).mockImplementation((cb) => {
      notificationCallback = cb;
      return { remove: jest.fn() };
    });

    renderHook(() => useAutoCompleteTimerTasks(), { wrapper });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalledTimes(1);
    });

    (updateTaskAsync as jest.Mock).mockClear();

    await act(async () => {
      notificationCallback({
        request: {
          content: {
            data: { taskId: 'task-regular' },
          },
        },
      });
    });
    expect(updateTaskAsync).not.toHaveBeenCalled();

    await act(async () => {
      notificationCallback({
        request: {
          content: {
            data: { taskId: 'non-existent' },
          },
        },
      });
    });
    expect(updateTaskAsync).not.toHaveBeenCalled();
  });
});
