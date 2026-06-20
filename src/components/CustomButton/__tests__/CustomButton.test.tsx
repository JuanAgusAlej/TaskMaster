import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomButton } from '../CustomButton';

describe('CustomButton Component', () => {
  const defaultProps = {
    title: 'Click Me',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title correctly', async () => {
    const { getByText } = await render(<CustomButton {...defaultProps} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('triggers onPress on click', async () => {
    const { getByText } = await render(<CustomButton {...defaultProps} />);
    const button = getByText('Click Me');

    fireEvent.press(button);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onPress when disabled', async () => {
    const { getByText } = await render(<CustomButton {...defaultProps} disabled={true} />);
    const button = getByText('Click Me');

    fireEvent.press(button);
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  it('renders ActivityIndicator and does not call onPress when loading', async () => {
    const { queryByText, getByTestId } = await render(
      <CustomButton {...defaultProps} loading={true} />
    );

    // Should not show title
    expect(queryByText('Click Me')).toBeNull();

    // Should render ActivityIndicator
    const indicator = getByTestId('button-activity-indicator');
    expect(indicator).toBeTruthy();

    // Pressing the button should not call onPress
    fireEvent.press(indicator);
    expect(defaultProps.onPress).not.toHaveBeenCalled();
  });

  it('renders icon when provided', async () => {
    const iconText = '🔥';
    const testIcon = <Text>{iconText}</Text>;
    const { getByText } = await render(<CustomButton {...defaultProps} icon={testIcon} />);

    expect(getByText(iconText)).toBeTruthy();
    expect(getByText('Click Me')).toBeTruthy();
  });
});
