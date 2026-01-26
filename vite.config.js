import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_BASE_URL || 'http://localhost:5196',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Output directory
    outDir: 'dist',
    // Generate sourcemaps for production (disable for smaller bundle)
    sourcemap: false,
    // Chunk size warning limit (in KB)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'axios-vendor': ['axios'],
        }
      }
    }
  },
  // Base URL for deployment (change if deploying to subdirectory)
  base: '/',
})
