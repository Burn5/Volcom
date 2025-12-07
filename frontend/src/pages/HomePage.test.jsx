import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('shows the main title and buttons', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/View Opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/Login \/ Register/i)).toBeInTheDocument();
  });
});
