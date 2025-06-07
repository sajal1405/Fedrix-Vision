import React from 'react';
import { render, waitFor } from '@testing-library/react';
import KanbanBoard from '../KanbanBoard.jsx';
import { UserProfileContext } from '../../../context/UserProfileContext';

jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
}));
jest.mock('react-dnd-html5-backend', () => ({ HTML5Backend: {} }));

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

import { supabase } from '../../../supabaseClient';

let orderMock;

beforeEach(() => {
  orderMock = jest.fn().mockResolvedValue({ data: [], error: null });
  supabase.from.mockReturnValue({
    select: jest.fn(() => ({ order: orderMock })),
  });
  supabase.removeChannel.mockClear();
});

test('handles failed subscription gracefully', async () => {
  const subscribeMock = jest.fn(() => {
    throw new Error('boom');
  });
  const channelObj = { on: jest.fn(() => channelObj), subscribe: subscribeMock };
  supabase.channel.mockReturnValue(channelObj);

  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  const { unmount } = render(
    <UserProfileContext.Provider value={{ profile: { id: '1', tier: 'admin' } }}>
      <KanbanBoard />
    </UserProfileContext.Provider>
  );

  await waitFor(() => expect(supabase.channel).toHaveBeenCalled());

  unmount();

  expect(logSpy).toHaveBeenCalledWith(
    'Real-time updates disabled: could not subscribe to tasks channel.'
  );
  expect(supabase.removeChannel).not.toHaveBeenCalled();

  logSpy.mockRestore();
});
