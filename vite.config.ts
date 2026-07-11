import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/motion/')) return 'motion'
          if (id.includes('/node_modules/')) return 'vendor'
          if (id.includes('/src/archive/tr/columns/zaman.body')) return 'archive-tr-zaman'
          if (id.includes('/src/archive/en/columns/todays-zaman.body')) {
            return 'archive-en-todays-zaman'
          }
          if (id.includes('/src/archive/tr/columns/p24.body')) return 'archive-tr-p24'
          if (id.includes('/src/archive/tr/') || id.includes('/src/archive/en/')) {
            return 'archive-data'
          }
        },
      },
    },
  },
})
