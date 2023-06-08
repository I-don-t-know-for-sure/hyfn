import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      // strategies: "injectManifest",

      // srcDir: "src",
      // filename: "sw.ts",
      devOptions: {
        enabled: true, // change to false when deploying
        // type: "module",
      },

      workbox: {
        // mode: "production",
        // navigateFallback: "/index.html",
      },
      manifest: {
        short_name: "Hyfn",
        name: "Hyfn App",
        description: "Customer app from hyfn",
        icons: [
          {
            src: "newLogo.png",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/png",
          },
          {
            src: "newLogo.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "newLogo.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#2e8900",
      },
      registerType: "prompt",
    }),
  ],
  base: "./",
  server: {
    port: 3009,
  },
  preview: {
    port: 3009,
    host: true,
  },
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
});
