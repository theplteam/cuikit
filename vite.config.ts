import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      '@plteam/chat-ui': path.resolve(__dirname, './packages/chat-ui/src'),
    }
  },
})
