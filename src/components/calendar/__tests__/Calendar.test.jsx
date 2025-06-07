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

jest.mock('react-big-calendar', () => ({
  Calendar: ({ events, onSelectEvent, onSelectSlot }) => (
    <div data-testid="calendar">
      {events.map((ev) => (
        <div key={ev.id} data-testid="event" onClick={() => onSelectEvent(ev)}>
          {ev.title}
        </div>
      ))}
      <button onClick={() => onSelectSlot({ start: new Date(), end: new Date() })} data-testid="slot-btn">slot</button>
    </div>
  ),
  dayjsLocalizer: () => () => {},
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calendar from '../Calendar.jsx';
import { UserProfileContext } from '../../../context/UserProfileContext';
import { supabase } from '../../../supabaseClient';

const events = [
  { id: 1, title: 'Meeting', start: '2024-01-01T10:00:00Z', end: '2024-01-01T11:00:00Z', type: 'meeting', created_by: '1' },
  { id: 2, title: 'Reminder', start: '2024-01-02T10:00:00Z', end: '2024-01-02T11:00:00Z', type: 'reminder', created_by: '1' },
];

let orderMock;
let selectMock;
let channelObj;

beforeEach(() => {
  orderMock = jest.fn().mockResolvedValue({ data: events, error: null });
  selectMock = jest.fn(() => ({ order: orderMock }));
  supabase.from.mockReturnValue({ select: selectMock });
  channelObj = { on: jest.fn(() => channelObj), subscribe: jest.fn() };
  supabase.channel.mockReturnValue(channelObj);
  supabase.removeChannel.mockClear();
});

test('renders events and filters by type', async () => {
  render(
    <UserProfileContext.Provider value={{ profile: { id: '1', tier: 'admin' } }}>
      <Calendar />
    </UserProfileContext.Provider>
  );

  await waitFor(() => expect(orderMock).toHaveBeenCalled());
  expect(screen.getAllByTestId('event')).toHaveLength(2);

  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'reminder' } });
  expect(screen.getAllByTestId('event')).toHaveLength(1);
  expect(screen.getByText('Reminder')).toBeInTheDocument();
});

test('opens modal when event clicked', async () => {
  render(
    <UserProfileContext.Provider value={{ profile: { id: '1', tier: 'admin' } }}>
      <Calendar />
    </UserProfileContext.Provider>
  );
  await waitFor(() => expect(orderMock).toHaveBeenCalled());

  fireEvent.click(screen.getByText('Meeting'));
  expect(await screen.findByText(/Save Event/i)).toBeInTheDocument();
});
