import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  SITE_ORIGIN,
} from './src/siteConfig.ts'

/** index.html carries %SITE_ORIGIN% and %OG_IMAGE_*% placeholders instead of
 *  literals, so the production domain and the social-card dimensions live in
 *  src/siteConfig.ts only — see the note there about the pending switch from
 *  sahinalpay.net to sahinalpay.com. */
function siteIdentityHtml(): Plugin {
  const replacements: Record<string, string> = {
    '%SITE_ORIGIN%': SITE_ORIGIN,
    '%OG_IMAGE_PATH%': OG_IMAGE_PATH,
    '%OG_IMAGE_TYPE%': OG_IMAGE_TYPE,
    '%OG_IMAGE_WIDTH%': String(OG_IMAGE_WIDTH),
    '%OG_IMAGE_HEIGHT%': String(OG_IMAGE_HEIGHT),
  }
  return {
    name: 'site-identity-html',
    transformIndexHtml(html) {
      return Object.entries(replacements).reduce(
        (result, [token, value]) => result.replaceAll(token, value),
        html,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteIdentityHtml()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/motion/')) return 'motion'
          if (id.includes('/node_modules/')) return 'vendor'
          if (id.includes('/src/archive/tr/columns/p24.body')) return 'archive-tr-p24'
          if (id.includes('/src/archive/tr/') || id.includes('/src/archive/en/')) {
            return 'archive-data'
          }
        },
      },
    },
  },
})
