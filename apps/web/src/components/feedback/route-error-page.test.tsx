import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { RouteErrorPage } from './route-error-page';

function BrokenPage(): never {
  throw new Error('Failed to fetch dynamically imported module');
}

describe('RouteErrorPage', () => {
  it('replaces the default router crash screen with recovery actions', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const router = createMemoryRouter(
      [{ path: '/', element: <BrokenPage />, errorElement: <RouteErrorPage /> }],
      { initialEntries: ['/'] },
    );

    render(
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: 'The page could not be loaded' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to sign in' })).toHaveAttribute('href', '/sign-in');
    consoleError.mockRestore();
  });
});
