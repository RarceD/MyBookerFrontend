import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //plugins: [react(), viteCompression()],
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true
    }
  }
})
