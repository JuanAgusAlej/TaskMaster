import React from 'react';
import { render } from '@testing-library/react-native';
import { TaskItemSkeleton } from '../TaskItemSkeleton';

describe('TaskItemSkeleton Component', () => {
  it('renders correctly without crashing', async () => {
    const { toJSON } = await render(<TaskItemSkeleton />);
    expect(toJSON()).toBeDefined();
  });
});
