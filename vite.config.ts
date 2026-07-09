import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/motion/')) return 'motion'
          if (id.includes('/node_modules/')) return 'vendor'
          if (id.includes('/src/archive/tr/columns/zaman')) return 'archive-tr-zaman'
          if (id.includes('/src/archive/tr/columns/p24')) return 'archive-tr-p24'
          if (id.includes('/src/archive/')) return 'archive-data'
        },
      },
    },
  },
})
