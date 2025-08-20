import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    open: false,
    host: 'localhost',
    strictPort: true
  },
  preview: {
    port: 3000,
    open: false
  }
});
