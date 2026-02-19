import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Use source in dev so uai-client doesn't need to be built first
      '@uai/client': path.resolve(
        __dirname,
        '../../packages/uai-client/src/index.ts'
      ),
    },
  },
  server: {
    port: 5173,
  },
});
