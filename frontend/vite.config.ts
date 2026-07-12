import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/allocations': 'http://localhost:8000',
      '/bookings': 'http://localhost:8000',
      '/maintenance-requests': 'http://localhost:8000',
    }
  }
})
