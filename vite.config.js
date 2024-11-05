import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/~60917/Vader',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      'vue-leaflet': 'vue-leaflet/dist/vue-leaflet.esm.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
      
    }
  }
})
