import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portfolio/', // repo name for GitHub Pages
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
