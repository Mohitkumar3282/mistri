import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        compact: true,
      },
    }),
  ],
  server: {
    port: 5173,
    cors: true,
    // Only relevant for local dev - lets a temporary HTTPS tunnel (e.g. localtunnel/ngrok)
    // reach this dev server for testing push notifications on a real phone.
    allowedHosts: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval' blob:; style-src * 'unsafe-inline'; font-src * data: https:; img-src * data: blob: https:; connect-src * ws: wss: http: https:; frame-src *; object-src 'none';",
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
