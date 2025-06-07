import React, { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { AgentAIProvider, AgentAIContext } from '../AgentAIContext';

let ctx;
function TestComponent() {
  ctx = useContext(AgentAIContext);
  return (
    <>
      <span data-testid="loading">{ctx.loading ? 'yes' : 'no'}</span>
      <span data-testid="generated">{ctx.generated}</span>
    </>
  );
}

describe('AgentAIContext', () => {
  beforeEach(() => {
    process.env.REACT_APP_HF_API_URL = 'http://example.com';
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue([{ generated_text: 'hello world' }]),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('generateContent fetches text and toggles loading', async () => {
    render(
      <AgentAIProvider>
        <TestComponent />
      </AgentAIProvider>
    );

    let result;
    await act(async () => {
      const promise = ctx.generateContent('test');
      expect(screen.getByTestId('loading')).toHaveTextContent('yes');
      result = await promise;
    });

    expect(result).toBe('hello world');
    expect(screen.getByTestId('loading')).toHaveTextContent('no');
    expect(screen.getByTestId('generated')).toHaveTextContent('hello world');
    expect(global.fetch).toHaveBeenCalledWith(
      process.env.REACT_APP_HF_API_URL,
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('returns empty string when API url missing', async () => {
    delete process.env.REACT_APP_HF_API_URL;

    render(
      <AgentAIProvider>
        <TestComponent />
      </AgentAIProvider>
    );

    let result;
    await act(async () => {
      result = await ctx.generateContent('test');
    });

    expect(result).toBe('');
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
