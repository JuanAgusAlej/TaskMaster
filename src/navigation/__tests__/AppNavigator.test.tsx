import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import { AppNavigator } from '../AppNavigator';
import authReducer from '../../store/authSlice';
import taskReducer from '../../store/taskSlice';
import { authService } from '../../services/authService';

jest.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('../../screens/LoginScreen/LoginScreen', () => ({
  LoginScreen: () => {
    const { Text } = require('react-native');
    return <Text testID="login-screen">Mock Login Screen</Text>;
  },
}));

jest.mock('../../screens/HomeScreen/HomeScreen', () => ({
  HomeScreen: () => {
    const { Text } = require('react-native');
    return <Text testID="home-screen">Mock Home Screen</Text>;
  },
}));

describe('AppNavigator', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createTestStore = (preloadedState: any) => {
    return configureStore({
      reducer: {
        auth: authReducer,
        tasks: taskReducer,
      },
      preloadedState,
    });
  };

  it('should render ActivityIndicator when auth state is loading', async () => {
    (authService.getCurrentUser as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    store = createTestStore({
      auth: {
        user: null,
        isAuthenticated: false,
        loading: true,
      },
    });

    const { getByTestId } = await render(
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );

    const activityIndicator = getByTestId('loading-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('should render Login screen when user is not authenticated', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);
    store = createTestStore({
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
      },
    });

    const { findByTestId } = await render(
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );

    const loginScreen = await findByTestId('login-screen');
    expect(loginScreen).toBeTruthy();
  });

  it('should render Home screen when user is authenticated', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue('john');
    store = createTestStore({
      auth: {
        user: 'john',
        isAuthenticated: true,
        loading: false,
      },
      tasks: {
        items: [],
        loading: false,
      },
    });

    const { findByTestId } = await render(
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );

    const homeScreen = await findByTestId('home-screen');
    expect(homeScreen).toBeTruthy();
  });
});
