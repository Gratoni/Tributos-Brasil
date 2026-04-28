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
        manualChunks: {
          // React runtime (rarely changes between deploys)
          'vendor-react': ['react', 'react-dom'],
          // GSAP animation library
          'vendor-gsap': ['gsap'],
          // Radix UI primitives
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          // Recharts data visualisation
          'vendor-recharts': ['recharts'],
        },
      },
    },
  },
})
