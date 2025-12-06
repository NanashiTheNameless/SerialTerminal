import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'public',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'build'),
    emptyOutDir: true,
    copyPublicDir: true,
    modulePreload: false,
    target: 'es2015',
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: [resolve(__dirname)]
    }
  },
  preview: {
    port: 3000
  }
})
