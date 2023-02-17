import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: path.join(process.cwd(), 'public'),
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '~bootstrap': path.resolve(process.cwd(), 'node_modules/react-bootstrap')
    }
  }
});
