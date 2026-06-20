import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert, TouchableOpacity } from 'react-native';
import { RegisterScreen } from '../RegisterScreen';
import { authService } from '../../../services/authService';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../../services/authService', () => ({
  authService: {
    registerUser: jest.fn(),
  },
}));

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all inputs and buttons', async () => {
    const { getByPlaceholderText, getByText } = await render(<RegisterScreen />);

    expect(getByPlaceholderText('Usuario')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByPlaceholderText('Confirmar Password')).toBeTruthy();
    expect(getByText('Crear Cuenta')).toBeTruthy();
    expect(getByText('¿Ya tenés cuenta? ')).toBeTruthy();
    expect(getByText('Iniciá sesión')).toBeTruthy();
  });

  it('should alert if fields are empty', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = await render(<RegisterScreen />);

    await act(async () => {
      fireEvent.press(getByText('Crear Cuenta'));
    });

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor completá todos los campos');
    alertSpy.mockRestore();
  });

  it('should alert if passwords do not match', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByPlaceholderText, getByText } = await render(<RegisterScreen />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Usuario'), 'john');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), '123');
      fireEvent.changeText(getByPlaceholderText('Confirmar Password'), '456');
    });

    await act(async () => {
      fireEvent.press(getByText('Crear Cuenta'));
    });

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Las contraseñas no coinciden');
    alertSpy.mockRestore();
  });

  it('should register successfully and alert success then navigate', async () => {
    let alertOkCallback: (() => void) | undefined;
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      if (buttons && buttons[0] && buttons[0].onPress) {
        alertOkCallback = buttons[0].onPress;
      }
    });
    (authService.registerUser as jest.Mock).mockResolvedValue(true);

    const { getByPlaceholderText, getByText } = await render(<RegisterScreen />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Usuario'), 'john');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), '123');
      fireEvent.changeText(getByPlaceholderText('Confirmar Password'), '123');
    });

    await act(async () => {
      fireEvent.press(getByText('Crear Cuenta'));
    });

    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith({ username: 'john', password: '123' });
      expect(alertSpy).toHaveBeenCalledWith('Éxito', 'Cuenta creada exitosamente', expect.any(Array));
    });

    if (alertOkCallback) {
      await act(async () => {
        alertOkCallback!();
      });
    }
    expect(mockNavigate).toHaveBeenCalledWith('Login');

    alertSpy.mockRestore();
  });

  it('should alert if username already exists during register', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (authService.registerUser as jest.Mock).mockResolvedValue(false);

    const { getByPlaceholderText, getByText } = await render(<RegisterScreen />);

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Usuario'), 'john');
      fireEvent.changeText(getByPlaceholderText('Contraseña'), '123');
      fireEvent.changeText(getByPlaceholderText('Confirmar Password'), '123');
    });

    await act(async () => {
      fireEvent.press(getByText('Crear Cuenta'));
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'El usuario ya existe');
    });

    alertSpy.mockRestore();
  });

  it('should toggle password and confirm password visibility', async () => {
    const { getByPlaceholderText, getAllByText } = await render(<RegisterScreen />);
    const passwordInput = getByPlaceholderText('Contraseña');
    const confirmInput = getByPlaceholderText('Confirmar Password');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(confirmInput.props.secureTextEntry).toBe(true);

    const eyeButtons = getAllByText('eye-off');
    expect(eyeButtons).toHaveLength(2);

    await act(async () => {
      fireEvent.press(eyeButtons[0]);
    });
    expect(passwordInput.props.secureTextEntry).toBe(false);
    expect(confirmInput.props.secureTextEntry).toBe(true);

    const remainingEyeOff = getAllByText('eye-off');
    expect(remainingEyeOff).toHaveLength(1);

    await act(async () => {
      fireEvent.press(remainingEyeOff[0]);
    });
    expect(passwordInput.props.secureTextEntry).toBe(false);
    expect(confirmInput.props.secureTextEntry).toBe(false);
  });

  it('should navigate to Login screen when Inicia sesion is pressed', async () => {
    const { getByText } = await render(<RegisterScreen />);

    await act(async () => {
      fireEvent.press(getByText('Iniciá sesión'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
