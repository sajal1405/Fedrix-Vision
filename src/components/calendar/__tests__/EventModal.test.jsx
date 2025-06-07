import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventModal from '../EventModal.jsx';

describe('EventModal type field', () => {
  const now = new Date();
  const slot = { start: now, end: new Date(now.getTime() + 60 * 60 * 1000) };

  test.each([
    'meeting',
    'appointment',
    'reminder',
  ])('submits %s event', (type) => {
    const onSave = jest.fn();
    render(
      <EventModal slot={slot} onClose={() => {}} onSave={onSave} />
    );

    fireEvent.change(screen.getByPlaceholderText(/Event title/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/Event Type/i), {
      target: { value: type },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Event/i }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ type })
    );
  });
});
