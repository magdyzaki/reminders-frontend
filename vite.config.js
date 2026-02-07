import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'تنبيهاتي',
        short_name: 'تنبيهات',
        description: 'تنبيهات مكتوبة مع تذكير بصوت افتراضي - مزامنة بين الموبايل والكمبيوتر',
        theme_color: '#1a5f4a',
        background_color: '#0f2e26',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
});
