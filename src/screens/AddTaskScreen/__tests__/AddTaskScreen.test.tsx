import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AddTaskScreen } from '../AddTaskScreen';
import taskReducer, { addTaskAsync, updateTaskAsync } from '../../../store/taskSlice';
import authReducer from '../../../store/authSlice';
import { calendarService } from '../../../services/calendarService';
import { notificationService } from '../../../services/notificationService';
import { Task } from '../../../types';

const mockGoBack = jest.fn();
const mockParams = { taskId: undefined } as any;

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
    addTaskAsync: jest.fn((taskData) => {
      const thunk = () => {
        const p = Promise.resolve({ id: 'new-task-id', ...taskData });
        (p as any).unwrap = () => p;
        return p;
      };
      return thunk;
    }),
    updateTaskAsync: jest.fn((taskData) => {
      const thunk = () => {
        const p = Promise.resolve(taskData);
        (p as any).unwrap = () => p;
        return p;
      };
      return thunk;
    }),
  };
});

jest.mock('../../../services/calendarService', () => ({
  calendarService: {
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
  },
}));

jest.mock('../../../services/notificationService', () => ({
  notificationService: {
    registerForPushNotifications: jest.fn(),
    scheduleTaskReminder: jest.fn(),
  },
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { Button: RNButton } = require('react-native');
  return ({ value, onChange }: any) => {
    return React.createElement(RNButton, {
      title: 'DateTimePickerMock',
      onPress: () => onChange({}, new Date(Date.now() + 86400000 * 2)),
    });
  };
});

describe('AddTaskScreen', () => {
  let store: any;

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Existing Title',
      description: 'Existing Description',
      completed: false,
      priority: 'high',
      date: '2026-06-19',
      reminderTime: new Date(Date.now() + 3600000).toISOString(),
      reminderConfig: '30min',
      assignedContact: { name: 'John Doe', phoneNumber: '123' },
      location: { latitude: 10, longitude: 20, address: 'Somewhere' },
      imageUri: 'file://img.jpg',
      calendarEventId: 'cal-event-1',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams.taskId = undefined;

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

  it('should render form fields in Add mode', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    expect(getByPlaceholderText('Título...')).toBeTruthy();
    expect(getByPlaceholderText('Descripción...')).toBeTruthy();
    expect(getByText('Seleccionar Responsable')).toBeTruthy();
    expect(getByText('Seleccionar Ubicación')).toBeTruthy();
    expect(getByText('📸 Tomar Foto')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('should disable Save button if title or description are empty', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Título...'), 'New Task');
    });
    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });
    expect(addTaskAsync).not.toHaveBeenCalled();
  });

  it('should populate fields in Edit mode', async () => {
    mockParams.taskId = 'task-1';

    const { getByDisplayValue, getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    expect(getByDisplayValue('Existing Title')).toBeTruthy();
    expect(getByDisplayValue('Existing Description')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Somewhere')).toBeTruthy();
  });

  it('should handle photo capture from camera', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://new-photo.jpg' }],
    });

    const { getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('📸 Tomar Foto'));
    });

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
  });

  it('should alert if camera permissions are denied', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('📸 Tomar Foto'));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Permiso denegado', 'Se necesita acceso a la cámara para tomar una foto.');
    });
    alertSpy.mockRestore();
  });

  it('should handle photo selection from gallery', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://gallery-photo.jpg' }],
    });

    const { getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(getByText('🖼️ Galería'));
    });

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('should toggle reminder type and save timer task successfully', async () => {
    const { getByPlaceholderText, getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Título...'), 'New Task');
      fireEvent.changeText(getByPlaceholderText('Descripción...'), 'New Desc');
    });

    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });

    await waitFor(() => {
      expect(addTaskAsync).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: 'New Desc',
        completed: false,
        reminderConfig: '10seg',
      }));
      expect(notificationService.scheduleTaskReminder).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('should toggle reminder type to date selection and save successfully', async () => {
    (calendarService.createEvent as jest.Mock).mockResolvedValue('cal-event-new');

    const { getByPlaceholderText, getByText } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Título...'), 'Date Task');
      fireEvent.changeText(getByPlaceholderText('Descripción...'), 'Date Desc');
    });

    await act(async () => {
      fireEvent.press(getByText('Seleccionar día'));
    });

    const dateBtnText = new Date(Date.now() + 10000).toLocaleDateString();
    await act(async () => {
      fireEvent.press(getByText(dateBtnText));
    });

    const datePickerBtn = getByText('DateTimePickerMock');
    await act(async () => {
      fireEvent.press(datePickerBtn);
    });

    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });

    await waitFor(() => {
      expect(addTaskAsync).toHaveBeenCalled();
      expect(calendarService.createEvent).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('should save updates when in Edit mode', async () => {
    mockParams.taskId = 'task-1';
    (calendarService.updateEvent as jest.Mock).mockResolvedValue(true);

    const { getByText, getByDisplayValue } = await render(
      <Provider store={store}>
        <AddTaskScreen />
      </Provider>
    );

    // Wait for fields to populate from existingTask
    await waitFor(() => {
      expect(getByDisplayValue('Existing Title')).toBeTruthy();
    });

    await act(async () => {
      fireEvent.press(getByText('Guardar'));
    });

    await waitFor(() => {
      expect(updateTaskAsync).toHaveBeenCalled();
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
