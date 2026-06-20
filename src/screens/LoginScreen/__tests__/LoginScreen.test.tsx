import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import { Alert, TouchableOpacity } from 'react-native';
import { LoginScreen } from '../LoginScreen';
import authReducer, { loginAsync } from '../../../store/authSlice';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../../store/authSlice', () => {
  const actual = jest.requireActual('../../../store/authSlice');
  return {
    __esModule: true,
    ...actual,
    loginAsync: jest.fn((credentials) => {
      if (credentials.username === 'john' && credentials.password === '123') {
        return {
          unwrap: jest.fn().mockResolvedValue('john'),
        };
      }
      return {
        unwrap: jest.fn().mockRejectedValue(new Error('Invalid')),
      };
    }),
  };
});

describe('LoginScreen', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should render all inputs and buttons', async () => {
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Usuario')).toBeTruthy();
    expect(screen.getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(screen.getByText('Iniciar Sesión')).toBeTruthy();
    expect(screen.getByText('¿No tenés cuenta? ')).toBeTruthy();
    expect(screen.getByText('Registrate')).toBeTruthy();
  });

  it('should alert if fields are empty and login button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Iniciar Sesión'));
    });

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresá usuario y contraseña');
    alertSpy.mockRestore();
  });

  it('should call loginAsync thunk on submit with correct values and navigate if successful', async () => {
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'john');
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), '123');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Iniciar Sesión'));
    });

    await waitFor(() => {
      expect(loginAsync).toHaveBeenCalledWith({ username: 'john', password: '123' });
    });
  });

  it('should alert if login throws credentials error', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'john');
      fireEvent.changeText(screen.getByPlaceholderText('Contraseña'), 'wrong');
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Iniciar Sesión'));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Credenciales inválidas');
    });
    alertSpy.mockRestore();
  });

  it('should navigate to Register screen when Registrate is pressed', async () => {
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Registrate'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should toggle password visibility when eye button is pressed', async () => {
    await render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText('Contraseña');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const eyeButton = screen.getByText('eye-off');
    await act(async () => {
      fireEvent.press(eyeButton);
    });

    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
