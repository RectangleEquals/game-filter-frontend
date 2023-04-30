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
      'assets': path.resolve(process.cwd(), './src/assets'),
      'components': path.resolve(process.cwd(), './src/Components'),
      'react-router-dom': path.resolve(process.cwd(), 'node_modules/react-router-dom'),
      '~bootstrap': path.resolve(process.cwd(), 'node_modules/react-bootstrap')
    }
  },
  optimizeDeps: {
    include: [
      'react-router-dom'
    ],
  },
});
