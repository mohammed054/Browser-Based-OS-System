import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Browser-Based-OS-System/',  // this must match your repository name
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          vendor: ['react', 'react-dom'],
          // Group components into chunks
          apps: ['./src/components/Calculator', './src/components/Terminal', './src/components/Chrome', './src/components/Settings', './src/components/FileExplorer', './src/components/TrashBin', './src/components/Notes']
        }
      }
    },
    // Enable source maps for debugging but minimize for production
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
