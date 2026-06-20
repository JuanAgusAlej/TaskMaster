import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LocationPickerModal } from '../LocationPickerModal';
import * as Location from 'expo-location';

describe('LocationPickerModal Component', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
  };

  const mockCurrentPosition = {
    coords: {
      latitude: -34.6037,
      longitude: -58.3816,
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  };

  const mockReverseGeocode = [
    {
      street: 'Av. 9 de Julio',
      streetNumber: '100',
      name: 'Obelisco',
      city: 'Buenos Aires',
      region: 'CABA',
      country: 'Argentina',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('requests foreground location permissions and gets position if no initialLocation is provided', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockCurrentPosition);
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockReverseGeocode);

    const { getByPlaceholderText } = await render(<LocationPickerModal {...defaultProps} />);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
      expect(Location.reverseGeocodeAsync).toHaveBeenCalledWith({
        latitude: -34.6037,
        longitude: -58.3816,
      });
      expect(getByPlaceholderText('Buscar dirección (ej: Obelisco, BsAs)...').props.value).toBe(
        'Av. 9 de Julio 100, Buenos Aires, CABA'
      );
    });
  });

  it('shows alert and centers on default coordinates when permissions are denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    await render(<LocationPickerModal {...defaultProps} />);

    await waitFor(() => {
      expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permiso denegado',
        expect.any(String)
      );
    });
  });

  it('uses initialLocation coordinates and address if provided', async () => {
    const initialLocation = {
      latitude: 12.34,
      longitude: 56.78,
      address: 'Casa Inicial',
    };

    const { getByDisplayValue } = await render(
      <LocationPickerModal {...defaultProps} initialLocation={initialLocation} />
    );

    await waitFor(() => {
      expect(getByDisplayValue('Casa Inicial')).toBeTruthy();
      expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  it('triggers geocoding when searching for a text address', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockCurrentPosition);
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockReverseGeocode);
    (Location.geocodeAsync as jest.Mock).mockResolvedValue([{ latitude: -34.5, longitude: -58.5 }]);

    const { getByPlaceholderText, getByText } = await render(
      <LocationPickerModal {...defaultProps} />
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(getByPlaceholderText('Buscar dirección (ej: Obelisco, BsAs)...').props.value).toBe(
        'Av. 9 de Julio 100, Buenos Aires, CABA'
      );
    });

    const searchInput = getByPlaceholderText('Buscar dirección (ej: Obelisco, BsAs)...');
    fireEvent.changeText(searchInput, 'Palermo, CABA');

    // Wait for text change to update state!
    await waitFor(() => {
      expect(searchInput.props.value).toBe('Palermo, CABA');
    });

    const searchButton = getByText('Buscar');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(Location.geocodeAsync).toHaveBeenCalledWith('Palermo, CABA');
      expect(Location.reverseGeocodeAsync).toHaveBeenLastCalledWith({
        latitude: -34.5,
        longitude: -58.5,
      });
    });
  });

  it('calls onSelect with correct location data upon confirmation', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockCurrentPosition);
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockReverseGeocode);

    const { getByText, getByPlaceholderText } = await render(<LocationPickerModal {...defaultProps} />);

    // Wait for initialization to complete
    await waitFor(() => {
      expect(getByPlaceholderText('Buscar dirección (ej: Obelisco, BsAs)...').props.value).toBe(
        'Av. 9 de Julio 100, Buenos Aires, CABA'
      );
    });

    const confirmBtn = getByText('Confirmar');
    fireEvent.press(confirmBtn);

    expect(defaultProps.onSelect).toHaveBeenCalledWith({
      latitude: -34.6037,
      longitude: -58.3816,
      address: 'Av. 9 de Julio 100, Buenos Aires, CABA',
    });
  });

  it('calls onClose when cancelling the modal', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockCurrentPosition);
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue(mockReverseGeocode);

    const { getByText, getByPlaceholderText } = await render(<LocationPickerModal {...defaultProps} />);
    
    // Wait for initialization to complete
    await waitFor(() => {
      expect(getByPlaceholderText('Buscar dirección (ej: Obelisco, BsAs)...').props.value).toBe(
        'Av. 9 de Julio 100, Buenos Aires, CABA'
      );
    });

    const cancelBtn = getByText('Cancelar');
    fireEvent.press(cancelBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
