import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'schedule',       
    short_name: 'S',  
    description: '...',
    theme_color: '#...',
    background_color: '#...',
    display: 'standalone',
    icons: [
  {
    src: 'public/web-app-manifest-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: 'public/web-app-manifest-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  }
]
  }
})],
})
