import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5000,
    // Libera requisições de qualquer Host (ex.: domínios do ngrok).
    allowedHosts: true,
  },
})
