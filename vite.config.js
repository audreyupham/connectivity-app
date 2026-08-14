import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Connectivity',
        short_name: 'Connectivity',
        description: 'Connectivity makes it easy to stay thoughtful. Save contacts, jot down personal details, and revisit the moments that help relationships grow. It\'s a simple way to remember names, stories, and conversations so you can show up more fully for the people in your world.',
        theme_color: '#4a2c82',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})