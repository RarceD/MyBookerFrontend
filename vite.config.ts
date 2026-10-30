import { defineConfig } from 'vite'
import { existsSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

const publicDir = resolve(process.cwd(), 'public')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-public-directory-indexes',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const [pathname, query] = (request.url ?? '').split('?')
          if (pathname.endsWith('/')) {
            const pagePath = resolve(publicDir, pathname.slice(1), 'index.html')
            if (pagePath.startsWith(`${publicDir}${sep}`) && existsSync(pagePath)) {
              request.url = `${pathname}index.html${query ? `?${query}` : ''}`
            }
          }
          next()
        })
      },
    },
  ],
  //plugins: [react(), viteCompression()],
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true
    }
  }
})
