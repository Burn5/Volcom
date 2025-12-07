import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',          // so document/window exist
    globals: true,                 // so describe/it/expect work without extra imports
    setupFiles: './src/setupTests.js',
  },
})
