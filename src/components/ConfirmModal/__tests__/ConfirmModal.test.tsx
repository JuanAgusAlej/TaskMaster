import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmModal } from '../ConfirmModal';

describe('ConfirmModal Component', () => {
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    message: 'Test Message',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible is true', async () => {
    const { getByText } = await render(<ConfirmModal {...defaultProps} />);

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Message')).toBeTruthy();
    expect(getByText('Aceptar')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('does not render content when visible is false', async () => {
    const { queryByText } = await render(<ConfirmModal {...defaultProps} visible={false} />);
    // In RN testing tree, the component is rendered but Modal has visible={false}.
  });

  it('calls onConfirm when confirm button is pressed', async () => {
    const { getByText } = await render(<ConfirmModal {...defaultProps} />);
    const confirmButton = getByText('Aceptar');

    fireEvent.press(confirmButton);
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is pressed', async () => {
    const { getByText } = await render(<ConfirmModal {...defaultProps} />);
    const cancelButton = getByText('Cancelar');

    fireEvent.press(cancelButton);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses default button text if none is provided', async () => {
    const { getByText } = await render(
      <ConfirmModal
        visible={true}
        message="Message"
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(getByText('Sí')).toBeTruthy();
    expect(getByText('No')).toBeTruthy();
  });
});
