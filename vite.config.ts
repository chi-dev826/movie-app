import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/movie-app/', 
  plugins: [
    react(),
    // 404.html自動コピー
    {
      name: 'copy-404',
      closeBundle() {
        try {
          copyFileSync('dist/index.html', 'dist/404.html');
        } catch {
          // Ignore errors during 404.html copy
        }
      }
    }
  ]
})