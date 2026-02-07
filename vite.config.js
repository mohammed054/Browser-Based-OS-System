import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio/',  // ⚡ Important: your repo name

  build: {
    outDir: 'dist',      // default, your build folder
    emptyOutDir: true,   // clear old builds automatically
  },

  server: {
    open: true,          // opens browser on dev
    port: 3000,
  },

  // Optional: add plugins here if needed
  plugins: [
    // e.g., for PWA support, React, etc.
  ]
})
