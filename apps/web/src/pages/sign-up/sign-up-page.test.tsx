import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/theme-provider';
import SignUpPage from './sign-up-page';

describe('SignUpPage', () => {
  it('renders shared validation errors before sending a request', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider>
          <MemoryRouter>
            <SignUpPage />
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>,
    );
    await user.type(screen.getByLabelText('Name'), 'Al');
    await user.type(screen.getByLabelText('Email'), 'invalid');
    await user.type(screen.getByLabelText('Password'), 'weak');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Name must contain at least 3 characters')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password must contain at least 8 characters')).toBeInTheDocument();
  });
});
