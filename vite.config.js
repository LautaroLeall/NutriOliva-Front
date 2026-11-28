import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nutriolivaAutoSeoPlugin } from "./scripts/seoAutoPlugin.mjs";

export default defineConfig(({ mode }) => {
  const isMobileNative = mode === "mobile";

  return {
    plugins: [
      react(),
      !isMobileNative && nutriolivaAutoSeoPlugin(),
      // En Web y Web App (PWA) registramos Service Worker seguro;
      // en Capacitor Nativo (mode === "mobile") los assets ya son locales.
      !isMobileNative &&
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        manifest: false, // Usamos public/manifest.json gestionado por seoAutoPlugin.mjs
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [
            /^\/robots\.txt$/,
            /^\/sitemap\.xml$/,
            /^\/llms\.txt$/,
            /^\/manifest\.json$/,
            /^\/\.well-known\/.*/,
          ],
          runtimeCaching: [
            {
              // Tipografias Google Fonts -> CacheFirst por 1 año
              urlPattern:
                /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "nutrioliva-google-fonts",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Privacidad clinica estricta: API REST, Auth, Edge Functions y fotos privadas
              // de Supabase NUNCA se guardan en Cache Storage local del navegador.
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: "NetworkOnly",
            },
          ],
        },
      }),
    ].filter(Boolean),
    build: {
      outDir: isMobileNative ? "dist-mobile" : "dist",
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});
