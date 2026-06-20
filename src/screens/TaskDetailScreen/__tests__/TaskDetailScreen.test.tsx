import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskDetailScreen } from '../TaskDetailScreen';
import taskReducer, { updateTaskAsync } from '../../../store/taskSlice';
import authReducer from '../../../store/authSlice';
import { Task } from '../../../types';

const mockGoBack = jest.fn();
const mockParams = { taskId: 'task-1', fromTab: 'in_progress' };

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: mockParams,
  }),
}));

jest.mock('../../../store/taskSlice', () => {
  const actual = jest.requireActual('../../../store/taskSlice');
  return {
    __esModule: true,
    ...actual,
    updateTaskAsync: jest.fn((task) => ({ type: 'tasks/updateTaskAsync/mock', payload: task })),
  };
});

describe('TaskDetailScreen', () => {
  let store: any;

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Detail Task 1',
      description: 'Detailed description here.',
      completed: false,
      priority: 'high',
      date: '2026-06-19',
      reminderTime: '2026-06-19T14:00:00Z',
      reminderConfig: '30min',
      assignedContact: {
        name: 'Jane Doe',
        phoneNumber: '555-1234',
      },
      location: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: 'Obelisco, Buenos Aires',
      },
      imageUri: 'file://path/to/image.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.taskId = 'task-1';
    mockParams.fromTab = 'in_progress';

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
      },
    });
  });

  it('should render task details correctly', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <TaskDetailScreen />
      </Provider>
    );

    expect(getByText('Detail Task 1')).toBeTruthy();
    expect(getByText('Detailed description here.')).toBeTruthy();
    expect(getByText('Jane Doe')).toBeTruthy();
    expect(getByText(/555-1234/)).toBeTruthy();
    expect(getByText('Obelisco, Buenos Aires')).toBeTruthy();
    expect(getByText(/Imagen adjunta/)).toBeTruthy();
    expect(getByText('En Progreso')).toBeTruthy();
  });

  it('should toggle task complete when status button is pressed in "in_progress" tab', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <TaskDetailScreen />
      </Provider>
    );

    fireEvent.press(getByText('En Progreso'));

    expect(updateTaskAsync).toHaveBeenCalledWith(expect.objectContaining({
      id: 'task-1',
      completed: true,
    }));
  });

  it('should show static status "Completada" if fromTab is "completed"', async () => {
    mockParams.fromTab = 'completed';
    const { getByText } = await render(
      <Provider store={store}>
        <TaskDetailScreen />
      </Provider>
    );

    expect(getByText('Completada')).toBeTruthy();
  });

  it('should go back when back button is pressed', async () => {
    const { getByText } = await render(
      <Provider store={store}>
        <TaskDetailScreen />
      </Provider>
    );

    const backBtn = getByText('arrow-back');
    fireEvent.press(backBtn);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should show error screen if task is not found', async () => {
    mockParams.taskId = 'non-existent';

    const { getByText } = await render(
      <Provider store={store}>
        <TaskDetailScreen />
      </Provider>
    );

    expect(getByText('Tarea no encontrada')).toBeTruthy();

    fireEvent.press(getByText('Volver'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
