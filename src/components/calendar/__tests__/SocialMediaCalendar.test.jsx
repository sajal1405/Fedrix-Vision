jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    channel: jest.fn(),
    removeChannel: jest.fn(),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      admin: { updateUserById: jest.fn() },
    },
  },
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SocialMediaCalendar from '../SocialMediaCalendar.js';
import { UserProfileContext } from '../../../context/UserProfileContext';
import { AuthContext } from '../../../context/AuthContext';
import { AgentAIContext } from '../../../context/AgentAIContext';
import { supabase } from '../../../supabaseClient';

const posts = [
  { id: 1, content: 'Post1', platform: 'Twitter', project: 'A', date: '2024-01-01', approved: true, created_by: '1' },
  { id: 2, content: 'Post2', platform: 'LinkedIn', project: 'B', date: '2024-01-02', approved: false, created_by: '1' },
];

let orderMock;
let selectMock;
let insertMock;
let channelObj;

beforeEach(() => {
  orderMock = jest.fn().mockResolvedValue({ data: posts, error: null });
  selectMock = jest.fn(() => ({ order: orderMock }));
  insertMock = jest.fn().mockResolvedValue({ error: null });
  supabase.from.mockReturnValue({ select: selectMock, order: orderMock, insert: insertMock });
  channelObj = { on: jest.fn(() => channelObj), subscribe: jest.fn() };
  supabase.channel.mockReturnValue(channelObj);
  supabase.removeChannel.mockClear();
});

function renderCalendar(ctx = {}) {
  return render(
    <AuthContext.Provider value={{ user: { email: 'a' } }}>
      <UserProfileContext.Provider value={{ profile: { id: '1', tier: 'admin' } }}>
        <AgentAIContext.Provider value={{ generateContent: ctx.generateContent || jest.fn().mockResolvedValue('Generated'), loading: false }}>
          <SocialMediaCalendar />
        </AgentAIContext.Provider>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
}

test('renders posts and filters by platform', async () => {
  renderCalendar();
  await waitFor(() => expect(orderMock).toHaveBeenCalled());

  expect(screen.getByText('Post1')).toBeInTheDocument();
  expect(screen.getByText('Post2')).toBeInTheDocument();

  fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'Twitter' } });
  expect(screen.getByText('Post1')).toBeInTheDocument();
  expect(screen.queryByText('Post2')).toBeNull();
});

test('submits new post', async () => {
  const generateContent = jest.fn().mockResolvedValue('Generated');
  renderCalendar({ generateContent });
  await waitFor(() => expect(orderMock).toHaveBeenCalled());

  fireEvent.change(screen.getByPlaceholderText('Content idea'), { target: { value: 'Idea' } });
  const dateInput = document.querySelector('input[type="date"]');
  fireEvent.change(dateInput, { target: { value: '2024-01-10' } });
  fireEvent.change(screen.getByPlaceholderText('Platform'), { target: { value: 'Twitter' } });
  fireEvent.change(screen.getByPlaceholderText('Project'), { target: { value: 'A' } });

  fireEvent.click(screen.getByRole('button', { name: /Add Draft/i }));

  await waitFor(() => expect(generateContent).toHaveBeenCalledWith('Idea'));
  expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ content: 'Generated', platform: 'Twitter', project: 'A', date: '2024-01-10' }));
});
