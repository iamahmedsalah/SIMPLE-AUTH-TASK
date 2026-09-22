import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { printDevelopmentBanner } from '@/app/config/development-banner';
import { AppProviders } from '@/app/providers/app-providers';
import { router } from '@/app/router/router';
import '@/styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
printDevelopmentBanner();
createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
