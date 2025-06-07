import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
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

afterAll(() => {
  supabase.from.mockImplementation(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
    delete: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
    eq: jest.fn().mockReturnThis(),
  }));
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

test('displays error when fetch fails', async () => {
  const errorSelect = jest.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
  supabase.from.mockReturnValueOnce({ select: errorSelect });

  renderWithAuth(<BlogManager />);

  await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
});

test('shows error when saving post fails', async () => {
  const initialSelect = jest.fn().mockResolvedValue({ data: [], error: null });
  const insertMock = jest.fn().mockResolvedValue({ error: { message: 'save fail' } });
  supabase.from
    .mockReturnValueOnce({ select: initialSelect })
    .mockReturnValueOnce({ insert: insertMock });

  renderWithAuth(<BlogManager />);

  await waitFor(() => expect(initialSelect).toHaveBeenCalled());

  fireEvent.change(screen.getByPlaceholderText('Enter Title'), { target: { value: 'A' } });
  fireEvent.change(screen.getByPlaceholderText('Short description...'), { target: { value: 'B' } });
  fireEvent.click(screen.getByText('Save'));

  await waitFor(() => expect(insertMock).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByText('save fail')).toBeInTheDocument());
});
