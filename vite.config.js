import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: ['0da5-103-21-78-185.ngrok-free.app'],
  },
});