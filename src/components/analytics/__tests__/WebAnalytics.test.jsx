import { render, screen, waitFor } from '@testing-library/react';
import WebAnalytics from '../WebAnalytics.js';

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '../../../supabaseClient';

describe('WebAnalytics', () => {
  beforeEach(() => {
    supabase.from.mockReset();
  });

  test('renders chart when data is returned', async () => {
    const orderMock = jest.fn().mockResolvedValue({ data: [{ page: 'Home', visits: 10 }], error: null });
    const selectMock = jest.fn(() => ({ order: orderMock }));
    supabase.from.mockReturnValue({ select: selectMock });

    render(<WebAnalytics />);

    await waitFor(() => expect(orderMock).toHaveBeenCalled());
    expect(screen.queryByText(/No analytics data/)).toBeNull();
    expect(screen.getByText(/Website Page Visits/)).toBeInTheDocument();
  });

  test('renders message when no data', async () => {
    const orderMock = jest.fn().mockResolvedValue({ data: [], error: null });
    const selectMock = jest.fn(() => ({ order: orderMock }));
    supabase.from.mockReturnValue({ select: selectMock });

    render(<WebAnalytics />);

    await waitFor(() => expect(orderMock).toHaveBeenCalled());
    expect(screen.getByText(/No analytics data/)).toBeInTheDocument();
  });
});
