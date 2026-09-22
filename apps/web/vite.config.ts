import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { developmentBannerPlugin } from './vite/development-banner';

export default defineConfig({
  plugins: [react(), developmentBannerPlugin()],
  resolve: {
    alias: [
      {
        find: '@fst/validation',
        replacement: path.resolve(import.meta.dirname, '../../packages/validation/src/index.ts'),
      },
      { find: '@', replacement: path.resolve(import.meta.dirname, './src') },
    ],
  },
  optimizeDeps: { exclude: ['@fst/validation'] },
  server: {
    port: 5173,
    proxy: { '/api': { target: 'http://127.0.0.1:3000', changeOrigin: true } },
  },
  preview: {
    port: 5173,
    proxy: { '/api': { target: 'http://127.0.0.1:3000', changeOrigin: true } },
  },
});
