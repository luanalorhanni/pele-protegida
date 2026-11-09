/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Cores tiradas da paleta do design.
const THEME_COLOR = '#FFBE5C'; // faixa do cabeçalho
const BACKGROUND_COLOR = '#FFFAF3'; // fundo das telas

/**
 * Domínio público do site, para as URLs absolutas da prévia (og:image precisa ser absoluta).
 * Ordem: VITE_SITE_URL → domínio de produção da Vercel (VERCEL_PROJECT_PRODUCTION_URL,
 * definido automaticamente no build da Vercel) → vazio (URLs relativas, só para uso local).
 */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'pele-protegida:site-url',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl);
    },
    configResolved(config) {
      if (config.command === 'build' && !siteUrl) {
        config.logger.warn(
          '[Pele Protegida] VITE_SITE_URL não definida: a prévia do link (og:image) usará URL relativa, ' +
            'que o WhatsApp não aceita. Na Vercel isso é preenchido automaticamente.',
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Prefixo '' = lê também as variáveis do sistema (como as que a Vercel define no build).
  const env = loadEnv(mode, '.', '');
  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : '')).replace(/\/+$/, '');

  return {
    plugins: [
      siteUrlPlugin(siteUrl),
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
  };
});
