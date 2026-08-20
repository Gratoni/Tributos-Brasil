import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // No source maps in production — avoids exposing original source code
    sourcemap: false,
    // Raise warning threshold slightly; chunks are intentionally split below
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate cacheable chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            if (
              id.includes('@radix-ui') ||
              id.includes('lucide-react') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'vendor-ui';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }
            return 'vendor-others';
          }
        },
      },
    },
  },
})
