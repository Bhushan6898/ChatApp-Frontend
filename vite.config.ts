import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:3001'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/login': { target: apiTarget, changeOrigin: true },
        '/register': { target: apiTarget, changeOrigin: true },
        '/logout': { target: apiTarget, changeOrigin: true },
        '/getuser': { target: apiTarget, changeOrigin: true },
      },
    },
  }
})
