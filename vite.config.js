import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Assuming your backend runs on port 8000
        changeOrigin: true,
      },
    },
  },
});
