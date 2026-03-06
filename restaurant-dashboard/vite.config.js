import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
          target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/orders': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/dashboard': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/inventory': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/restaurant': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/ai': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/public': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
