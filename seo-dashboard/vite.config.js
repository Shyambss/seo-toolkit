import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://seo-toolkit-08ge.onrender.com', // proxy all /api requests to backend
    },
  },
});
