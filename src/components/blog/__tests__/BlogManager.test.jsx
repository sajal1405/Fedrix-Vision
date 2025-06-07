import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import BlogManager from '../BlogManager.jsx';
import { AuthContext } from '../../../context/AuthContext';

jest.mock('react-markdown', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('remark-gfm', () => ({}));

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
  },
}));

import { supabase } from '../../../supabaseClient';

let selectMock;
let subscribeMock;
let onMock;
let realtimeCallback;
let channelObj;

beforeEach(() => {
  realtimeCallback = null;
  selectMock = jest
    .fn()
    .mockResolvedValueOnce({ data: [{ id: 1, title: 'First Post', snippet: 'a' }] })
    .mockResolvedValueOnce({
      data: [
        { id: 1, title: 'First Post', snippet: 'a' },
        { id: 2, title: 'New Post', snippet: 'b' },
      ],
    });
  supabase.from.mockReturnValue({ select: selectMock });
  subscribeMock = jest.fn();
  onMock = jest.fn((event, filter, cb) => {
    realtimeCallback = cb;
    return channelObj;
  });
  channelObj = { on: onMock, subscribe: subscribeMock };
  supabase.channel.mockReturnValue(channelObj);
  supabase.removeChannel.mockClear();
});

const renderWithAuth = (ui) =>
  render(<AuthContext.Provider value={{ user: { role: 'admin' } }}>{ui}</AuthContext.Provider>);

test('refreshes posts when realtime event occurs', async () => {
  const { unmount } = renderWithAuth(<BlogManager />);

  await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());
  expect(selectMock).toHaveBeenCalledTimes(1);

  await act(async () => {
    realtimeCallback && realtimeCallback();
  });

  await waitFor(() => expect(screen.getByText('New Post')).toBeInTheDocument());
  expect(selectMock).toHaveBeenCalledTimes(2);

  unmount();
});
