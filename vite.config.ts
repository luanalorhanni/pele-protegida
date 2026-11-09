/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Cores tiradas da paleta do design.
const THEME_COLOR = '#FFBE5C'; // faixa do cabeçalho
const BACKGROUND_COLOR = '#FFFAF3'; // fundo das telas

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt': o novo service worker espera até a pessoa tocar em "Atualizar".
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/icon.svg', 'icons/apple-touch-icon-180.png', 'favicon.svg'],
      manifest: {
        id: '/',
        name: 'Pele Protegida',
        short_name: 'Pele Protegida',
        description:
          'Dicas de proteção solar e questionário para quem trabalha ao sol. Não faz diagnóstico e não substitui uma consulta.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: THEME_COLOR,
        background_color: BACKGROUND_COLOR,
        categories: ['health', 'education', 'medical'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell: HTML, JS, CSS, fontes e ícones ficam no precache.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        // As chamadas ao Supabase não são cacheadas (vão direto à rede).
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
