import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TabSelector } from '../TabSelector';

describe('TabSelector Component', () => {
  const defaultProps = {
    activeTab: 'in_progress' as const,
    onTabChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with tabs', async () => {
    const { getByText } = await render(<TabSelector {...defaultProps} />);
    expect(getByText('En Progreso')).toBeTruthy();
    expect(getByText('Completadas')).toBeTruthy();
  });

  it('calls onTabChange with "in_progress" when En Progreso tab is pressed', async () => {
    const { getByText } = await render(<TabSelector {...defaultProps} activeTab="completed" />);
    const activeTabButton = getByText('En Progreso');

    fireEvent.press(activeTabButton);
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('in_progress');
  });

  it('calls onTabChange with "completed" when Completadas tab is pressed', async () => {
    const { getByText } = await render(<TabSelector {...defaultProps} />);
    const activeTabButton = getByText('Completadas');

    fireEvent.press(activeTabButton);
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('completed');
  });
});
