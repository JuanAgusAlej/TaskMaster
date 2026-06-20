import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ContactPickerModal } from '../ContactPickerModal';
import * as Contacts from 'expo-contacts';

describe('ContactPickerModal Component', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    onSelect: jest.fn(),
  };

  const mockContactsData = {
    data: [
      { id: '1', name: 'Ana Gómez', phoneNumbers: [{ number: '123456' }] },
      { id: '2', name: 'Carlos Díaz', phoneNumbers: [{ number: '789012' }] },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('requests contacts permissions and loads contacts if granted', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue(mockContactsData);

    const { getByText, getByPlaceholderText } = await render(
      <ContactPickerModal {...defaultProps} />
    );

    // Verify it calls requestPermissionsAsync and getContactsAsync
    await waitFor(() => {
      expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
      expect(Contacts.getContactsAsync).toHaveBeenCalled();
    });

    // Check that contacts are listed
    await waitFor(() => {
      expect(getByText('Ana Gómez')).toBeTruthy();
      expect(getByText('Carlos Díaz')).toBeTruthy();
    });
  });

  it('triggers Alert and calls onClose when permissions are denied', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    await render(<ContactPickerModal {...defaultProps} />);

    await waitFor(() => {
      expect(Contacts.requestPermissionsAsync).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Permiso denegado',
        expect.any(String),
        expect.any(Array)
      );
    });
  });

  it('filters contacts list when typing in search query', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue(mockContactsData);

    const { getByText, queryByText, getByPlaceholderText } = await render(
      <ContactPickerModal {...defaultProps} />
    );

    await waitFor(() => {
      expect(getByText('Ana Gómez')).toBeTruthy();
    });

    const searchInput = getByPlaceholderText('Buscar contacto...');
    
    // Search for "Carlos"
    fireEvent.changeText(searchInput, 'Carlos');

    await waitFor(() => {
      expect(getByText('Carlos Díaz')).toBeTruthy();
      expect(queryByText('Ana Gómez')).toBeNull();
    });
  });

  it('triggers onSelect with correct argument when a contact is selected', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue(mockContactsData);

    const { getByText } = await render(<ContactPickerModal {...defaultProps} />);

    await waitFor(() => {
      expect(getByText('Carlos Díaz')).toBeTruthy();
    });

    fireEvent.press(getByText('Carlos Díaz'));

    expect(defaultProps.onSelect).toHaveBeenCalledWith({
      id: '2',
      name: 'Carlos Díaz',
      phoneNumber: '789012',
    });
  });

  it('triggers onClose when close button (✕) is pressed', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue({ data: [] });

    const { getByText } = await render(<ContactPickerModal {...defaultProps} />);

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
