import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary.jsx';

function ProblemChild() {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  test('renders fallback on error', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Error</div>}>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
});
