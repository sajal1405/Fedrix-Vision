import { render, screen, waitFor } from '@testing-library/react';
import CampaignAnalytics from '../CampaignAnalytics.js';

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from '../../../supabaseClient';

describe('CampaignAnalytics', () => {
  beforeEach(() => {
    supabase.from.mockReset();
  });

  test('renders chart when data is returned', async () => {
    const orderMock = jest.fn().mockResolvedValue({ data: [{ month: 'Jan', roi: 100 }], error: null });
    const selectMock = jest.fn(() => ({ order: orderMock }));
    supabase.from.mockReturnValue({ select: selectMock });

    render(<CampaignAnalytics />);

    await waitFor(() => expect(orderMock).toHaveBeenCalled());
    expect(screen.queryByText(/No analytics data/)).toBeNull();
    expect(screen.getByText(/Campaign ROI/)).toBeInTheDocument();
  });

  test('renders message when no data', async () => {
    const orderMock = jest.fn().mockResolvedValue({ data: [], error: null });
    const selectMock = jest.fn(() => ({ order: orderMock }));
    supabase.from.mockReturnValue({ select: selectMock });

    render(<CampaignAnalytics />);

    await waitFor(() => expect(orderMock).toHaveBeenCalled());
    expect(screen.getByText(/No analytics data/)).toBeInTheDocument();
  });
});
