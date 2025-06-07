import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReminderList from '../ReminderList.jsx';
import { UserProfileContext } from '../../../context/UserProfileContext';

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      admin: { updateUserById: jest.fn() },
    },
  },
}));

import { supabase } from '../../../supabaseClient';

let selectMock;
let orderMock;
let insertMock;
let updateMock;
let onMock;
let subscribeMock;
let channelObj;

beforeEach(() => {
  insertMock = jest.fn().mockResolvedValue({});
  updateMock = jest.fn(() => ({ eq: jest.fn().mockResolvedValue({}) }));
  selectMock = jest.fn().mockReturnThis();
  orderMock = jest.fn().mockResolvedValue({
    data: [
      { id: 1, title: 'Reminder', due_date: '2024-01-01', completed: false, created_by: '1' },
    ],
  });
  supabase.from.mockReturnValue({
    select: selectMock,
    order: orderMock,
    insert: insertMock,
    update: updateMock,
    eq: jest.fn().mockReturnThis(),
  });
  subscribeMock = jest.fn();
  onMock = jest.fn(() => channelObj);
  channelObj = { on: onMock, subscribe: subscribeMock };
  supabase.channel.mockReturnValue(channelObj);
  supabase.removeChannel.mockClear();
  supabase.auth.getUser.mockResolvedValue({ data: { user: { id: '1' } } });
});


const renderList = () =>
  render(
    <UserProfileContext.Provider value={{ profile: { id: '1', tier: 'admin', name: 'Test' } }}>
      <ReminderList />
    </UserProfileContext.Provider>
  );

afterAll(() => {
  supabase.from.mockImplementation(() => ({
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
    eq: jest.fn().mockReturnThis(),
  }));
  supabase.auth.signUp.mockResolvedValue({ data: { user: { id: 1, email: 'a' } }, error: null });
});

test('renders reminders from Supabase', async () => {
  renderList();
  await waitFor(() => expect(screen.getByText('Reminder')).toBeInTheDocument());
  expect(selectMock).toHaveBeenCalled();
  expect(screen.getByTestId('reminder-list').children.length).toBe(1);
});
