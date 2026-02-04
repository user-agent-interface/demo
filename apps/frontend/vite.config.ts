import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@uai/client': path.resolve(
        __dirname,
        '../../packages/uai-client/dist/index.js'
      ),
    },
  },
  server: {
    port: 5173,
  },
});
