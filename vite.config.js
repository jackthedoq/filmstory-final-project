import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173       // Optional: Change if needed
  }
});
