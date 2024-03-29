import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  publicDir: path.join(process.cwd(), 'public'),
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      'assets': path.resolve(process.cwd(), './src/assets'),
      'components': path.resolve(process.cwd(), './src/Components'),
      'contexts': path.resolve(process.cwd(), './src/Components/Contexts'),
      'modals': path.resolve(process.cwd(), './src/Components/Dialogs'),
      'utils': path.resolve(process.cwd(), './src/utility'),
      'testdata': path.resolve(process.cwd(), './src/testdata'),
      'react-router-dom': path.resolve(process.cwd(), 'node_modules/react-router-dom'),
      '~bootstrap': path.resolve(process.cwd(), 'node_modules/react-bootstrap')
    }
  },
  optimizeDeps: {
    include: [
      'react-router-dom'
    ],
  },
  build: {
    target: 'es2015',
    polyfillDynamicImport: false,
    nodePolyfills: ['url'],
  },
  server: {
    host: 'localhost',
    port: process.env.VITE_PORT || process.env.PORT || 80,
    nodePolyfills: ['url'],
  },
  define: {
    'process.env': processEnv(),
  }
});

function processEnv() {
  if (process.env.NODE_ENV === 'production') {
    // Use environment variables directly from the system
    return import.meta.env;
  } else {
    // Use environment variables from dotenv in development
    return JSON.stringify(loadEnv());
  }
}

function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  const envFile = fs.readFileSync(envPath, 'utf8');
  const lines = envFile.split('\n');
  const env = {};

  for (const line of lines) {
    const [key, value] = line.split('=');
    env[key] = value;
  }

  return env;
}