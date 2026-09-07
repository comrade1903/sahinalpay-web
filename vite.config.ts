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
 *  src/siteConfig.ts only. */
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
        /* One chunk per language, so a Turkish reader never downloads the
           English records and vice versa; split article bodies get their own
           chunk, since they are fetched only when someone opens or searches
           an article. Registering a new split outlet means adding its loader
           to archive/bodyRegistry.ts and a group here.

           `archive-shared` has to be declared explicitly: left to the
           bundler, the normalisers both language modules use get folded into
           whichever language chunk is emitted first, and loading the other
           language then drags that whole chunk in with it. */
        advancedChunks: {
          groups: [
            { name: 'motion', test: /[\\/]node_modules[\\/]motion[\\/]/ },
            { name: 'vendor', test: /[\\/]node_modules[\\/]/ },
            { name: 'archive-tr-p24', test: /[\\/]src[\\/]archive[\\/]tr[\\/]columns[\\/]p24\.body/ },
            {
              name: 'archive-shared',
              test: /[\\/]src[\\/]archive[\\/](utils|types)\.ts$/,
            },
            { name: 'archive-tr', test: /[\\/]src[\\/]archive[\\/](tr[\\/]|tr\.ts$)/ },
            { name: 'archive-en', test: /[\\/]src[\\/]archive[\\/](en[\\/]|en\.ts$)/ },
          ],
        },
      },
    },
  }
})
