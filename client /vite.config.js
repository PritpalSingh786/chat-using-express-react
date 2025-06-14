// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // ← allow access via IP
    port: 3000        // ← optional: change if needed
  }
});
