import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor, act, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { HomeScreen } from '../HomeScreen';
import taskReducer, { loadTasks, deleteTaskAsync, updateTaskAsync } from '../../../store/taskSlice';
import authReducer, { logoutAsync } from '../../../store/authSlice';
import { CustomButton } from '../../../components/CustomButton/CustomButton';
import { TaskItemSkeleton } from '../../../components/TaskItemSkeleton/TaskItemSkeleton';
import { Task } from '../../../types';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useFocusEffect: (callback: any) => {
      const { useEffect } = require('react');
      useEffect(() => {
        callback();
      }, [callback]);
    },
  };
});

jest.mock('../../../store/taskSlice', () => {
  const actual = jest.requireActual('../../../store/taskSlice');
  return {
    __esModule: true,
    ...actual,
    loadTasks: jest.fn(() => ({ type: 'tasks/loadTasks/mock' })),
    deleteTaskAsync: jest.fn((id) => ({ type: 'tasks/deleteTaskAsync/mock', payload: id })),
    updateTaskAsync: jest.fn((task) => ({ type: 'tasks/updateTaskAsync/mock', payload: task })),
  };
});

jest.mock('../../../store/authSlice', () => {
  const actual = jest.requireActual('../../../store/authSlice');
  return {
    __esModule: true,
    ...actual,
    logoutAsync: jest.fn(() => ({ type: 'auth/logoutAsync/mock' })),
  };
});

jest.mock('../../../hooks/useAutoCompleteTimerTasks', () => ({
  useAutoCompleteTimerTasks: jest.fn(),
}));

jest.mock('../../../components/TaskItemSkeleton/TaskItemSkeleton', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    TaskItemSkeleton: () => React.createElement(View, { testID: 'task-skeleton' }),
  };
});

jest.mock('../../../components/TaskItem/TaskItem', () => ({
  TaskItem: ({ task, onToggleComplete, onDelete, onEdit, onViewDetail }: any) => {
    const { View, TouchableOpacity, Text } = require('react-native');
    return (
      <View testID={`task-item-${task.id}`}>
        <Text>{task.title}</Text>
        <TouchableOpacity onPress={() => onToggleComplete(task)}>
          <Text>Toggle Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task)}>
          <Text>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(task)}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onViewDetail(task)}>
          <Text>View Detail</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

describe('HomeScreen', () => {
  let store: any;

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Active Task 1',
      description: 'Desc 1',
      completed: false,
      priority: 'high',
      date: '2026-06-19',
      reminderTime: '2026-06-19T14:00:00Z',
      reminderConfig: '30min',
    },
    {
      id: 'task-2',
      title: 'Completed Task 2',
      description: 'Desc 2',
      completed: true,
      priority: 'low',
      date: '2026-06-19',
      reminderTime: '2026-06-19T14:00:00Z',
      reminderConfig: '30min',
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
          items: mockTasks,
          loading: false,
        },
        auth: {
          user: 'john',
          isAuthenticated: true,
          loading: false,
        },
      },
    });
  });

  it('should render header with username, lists, and actions', async () => {
    const { getByText, queryByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('john')).toBeTruthy();
    expect(getByText('john@taskmaster.com')).toBeTruthy();
    expect(getByText('Active Task 1')).toBeTruthy();
    expect(queryByText('Completed Task 2')).toBeNull();
  });

  it('should show skeletons if tasks are loading', async () => {
    store = configureStore({
      reducer: {
        tasks: taskReducer,
        auth: authReducer,
      },
      preloadedState: {
        tasks: {
          items: [],
          loading: true,
        },
        auth: {
          user: 'john',
          isAuthenticated: true,
          loading: false,
        },
      },
    });

    const { getAllByTestId } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getAllByTestId('task-skeleton').length).toBeGreaterThan(0);
  });

  it('should toggle tabs and filter tasks accordingly', async () => {
    const { getByText, queryByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(getByText('Active Task 1')).toBeTruthy();
    expect(queryByText('Completed Task 2')).toBeNull();

    await act(async () => {
      fireEvent.press(getByText('Completadas'));
    });

    await waitFor(() => {
      expect(queryByText('Active Task 1')).toBeNull();
      expect(getByText('Completed Task 2')).toBeTruthy();
    });
  });

  it('should dispatch loadTasks when app returns to active state', async () => {
    let appStateCallback: (state: string) => void = () => {};
    const addEventListenerSpy = jest.spyOn(AppState, 'addEventListener').mockImplementation((event, callback) => {
      appStateCallback = callback;
      return { remove: jest.fn() } as any;
    });

    await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    expect(loadTasks).toHaveBeenCalledTimes(1);

    await act(async () => {
      appStateCallback('background');
    });
    await act(async () => {
      appStateCallback('active');
    });

    expect(loadTasks).toHaveBeenCalledTimes(2);
    addEventListenerSpy.mockImplementation(() => ({
      remove: jest.fn(),
    }) as any);
  });

  it('should navigate to AddTask screen when add button is clicked', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    const addButton = getByText('add');
    await act(async () => {
      fireEvent.press(addButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith('AddTask', {});
  });

  it('should dispatch logoutAsync when logout button is pressed', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    const logoutButton = getByText('log-out-outline');
    await act(async () => {
      fireEvent.press(logoutButton);
    });
    expect(logoutAsync).toHaveBeenCalled();
  });

  it('should handle task editing navigation', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('Edit'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('AddTask', { taskId: 'task-1' });
  });

  it('should handle task details navigation', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('View Detail'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('TaskDetail', { taskId: 'task-1', fromTab: 'in_progress' });
  });

  it('should open delete confirm modal and dispatch deleteTaskAsync on confirm', async () => {
    const { getByText, queryByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('Delete'));
    });
    expect(getByText('¿Eliminar esta tarea?')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Sí'));
    });

    await waitFor(() => {
      expect(deleteTaskAsync).toHaveBeenCalledWith('task-1');
      expect(queryByText('¿Eliminar esta tarea?')).toBeNull();
    });
  });

  it('should open complete confirm modal and dispatch updateTaskAsync on confirm', async () => {
    const { getByText, queryByText } = await render(
      <Provider store={store}>
        <HomeScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('Toggle Complete'));
    });
    expect(getByText('¿Marcar como completada?')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Sí'));
    });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalledWith(expect.objectContaining({
        id: 'task-1',
        completed: true,
      }));
      expect(queryByText('¿Marcar como completada?')).toBeNull();
    });
  });
});
