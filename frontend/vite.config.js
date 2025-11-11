// Vite config for local development
// This adds a dev-server proxy so calls to /api are forwarded to the backend
// running on localhost:5000. That lets the frontend call `/api/health` without
// hitting CORS issues during development.
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // listen on all interfaces so network URLs printed by Vite work
    host: true,
    proxy: {
      // Proxy any request starting with /api to the backend server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
