import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        "icons/apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "og-image.svg",
        "src/assets/guidra-icon.png",
      ],
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webp}"],
        runtimeCaching: [
          // Auth/profile endpoints should never be served from cache
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/v1/auth") ||
              url.pathname.startsWith("/api/v1/users/me"),
            handler: "NetworkOnly",
          },
          // Content cache endpoints - Stale While Revalidate
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/v1/content/cache"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "content-cache",
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          // Images - Cache First
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          // Static assets (CSS, JS, fonts) - Stale While Revalidate
          {
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "script" ||
              request.destination === "font",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets",
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          // Fonts - Cache First
          {
            urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "font-cache",
              cacheableResponse: { statuses: [0, 200] },
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          // Google Fonts - Stale While Revalidate
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      manifest: {
        name: "Guidra - AI-Powered Learning Platform",
        short_name: "Guidra",
        description:
          "Guidra builds personalized learning paths with AI-guided lessons, customizable teaching styles, and comprehensive progress tracking.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#7c3aed",
        scope: "/",
        orientation: "portrait-primary",
        categories: ["education", "productivity"],
        screenshots: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            form_factor: "narrow",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
          },
        ],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
});