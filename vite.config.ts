import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'group-products': [
            './src/routes/products/ProductsView.vue',
            './src/routes/products/NewProductView.vue',
            './src/routes/products/ProductDetailsView.vue',
          ],
          'group-collections': [
            './src/routes/collections/CollectionsView.vue',
            './src/routes/collections/NewCollectionView.vue',
            './src/routes/collections/CollectionDetailsView.vue',
          ],
        },
      },
    },
  },
})
