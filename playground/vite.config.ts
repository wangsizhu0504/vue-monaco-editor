import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import pkg from '../packages/editor/package.json'

// https://vitejs.dev/config/
export default defineConfig({

  define: {
    'process.env': {
      __VERSION__: pkg.version,
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@vue-monaco/editor': resolve(__dirname, '../packages/editor/src'),
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})
