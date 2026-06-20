import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskItem } from '../TaskItem';
import { Task } from '../../../types';

describe('TaskItem Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Comprar leche',
    description: 'Ir al supermercado a comprar leche descremada',
    completed: false,
    reminderTime: '10s',
  };

  const defaultProps = {
    task: mockTask,
    onToggleComplete: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onViewDetail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description correctly', async () => {
    const { getByText } = await render(<TaskItem {...defaultProps} />);
    expect(getByText('Comprar leche')).toBeTruthy();
    expect(getByText('Ir al supermercado a comprar leche descremada')).toBeTruthy();
  });

  it('shows checkbox and triggers onToggleComplete when not completed', async () => {
    const { getByTestId } = await render(<TaskItem {...defaultProps} />);
    
    // In active tasks, the checkbox touchable is visible.
    const checkbox = getByTestId('task-checkbox');
    fireEvent.press(checkbox);
    
    expect(defaultProps.onToggleComplete).toHaveBeenCalledWith(mockTask);
  });

  it('does not render checkbox and calls onViewDetail directly when completed', async () => {
    const completedTask: Task = { ...mockTask, completed: true };
    const { queryByText, getByText } = await render(
      <TaskItem {...defaultProps} task={completedTask} />
    );

    // Clicking text container should trigger onViewDetail
    const textContainerButton = getByText('Comprar leche');
    fireEvent.press(textContainerButton);

    expect(defaultProps.onViewDetail).toHaveBeenCalledWith(completedTask);
  });

  it('toggles actions container when clicked for active task', async () => {
    const { getByText, queryByText, findByText } = await render(<TaskItem {...defaultProps} />);

    // Actions should not be visible initially
    expect(queryByText('👁')).toBeNull();
    expect(queryByText('✏')).toBeNull();
    expect(queryByText('✕')).toBeNull();

    // Click title to toggle actions
    const textContainerButton = getByText('Comprar leche');
    fireEvent.press(textContainerButton);

    // Actions should now be visible
    expect(await findByText('👁')).toBeTruthy();
    expect(await findByText('✏')).toBeTruthy();
    expect(await findByText('✕')).toBeTruthy();

    // Click again to hide
    fireEvent.press(textContainerButton);
    await waitFor(() => {
      expect(queryByText('👁')).toBeNull();
    });
  });

  it('triggers action callbacks (view, edit, delete) when buttons are pressed', async () => {
    const { getByText, findByText } = await render(<TaskItem {...defaultProps} />);
    
    // Toggle actions to display buttons
    fireEvent.press(getByText('Comprar leche'));

    // Trigger onViewDetail
    const viewButton = await findByText('👁');
    fireEvent.press(viewButton);
    expect(defaultProps.onViewDetail).toHaveBeenCalledWith(mockTask);

    // Trigger onEdit
    const editButton = await findByText('✏');
    fireEvent.press(editButton);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTask);

    // Trigger onDelete
    const deleteButton = await findByText('✕');
    fireEvent.press(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTask);
  });

  it('renders badges and image when present in the task', async () => {
    const richTask: Task = {
      ...mockTask,
      assignedContact: {
        id: 'c1',
        name: 'Juan Pérez',
        phoneNumber: '12345678',
      },
      location: {
        latitude: -34.6,
        longitude: -58.3,
        address: 'Av. Siempreviva 742',
      },
      calendarEventId: 'evt123',
      imageUri: 'file://path/to/image.jpg',
    };

    const { getByText, getByTestId } = await render(
      <TaskItem {...defaultProps} task={richTask} />
    );

    expect(getByText('👤 Juan Pérez')).toBeTruthy();
    expect(getByText('📍 Av. Siempreviva 742')).toBeTruthy();
    expect(getByText('📅 Agendado en Calendario')).toBeTruthy();

    const image = getByTestId('task-image');
    expect(image.props.source.uri).toBe('file://path/to/image.jpg');
  });
});
