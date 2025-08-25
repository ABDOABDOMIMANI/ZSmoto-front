import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react()],
    define: {
      __API_URL__: JSON.stringify(env.REACT_APP_API_URL || env.VITE_API_URL || 'http://localhost:8080'),
    },
  }
})
