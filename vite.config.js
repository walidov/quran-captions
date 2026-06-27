import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Honor the PORT env var (used by the preview/launch tooling) so the
    // dev server binds to the port that's actually being proxied.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})
