import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    transformer: 'postcss',
  },
  build: {
    cssMinify: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  optimizeDeps: {
    include: ['framer-motion', 'react', 'react-dom'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
