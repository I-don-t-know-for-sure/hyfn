import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    // VitePWA({ registerType: "prompt" }),

    VitePWA({
      // strategies: "injectManifest",

      // srcDir: "src",
      // filename: "sw.ts",
      devOptions: {
        enabled: process.env.NODE_ENV !== "production", // change to false when deploying

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
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#2e8900",
      },
      registerType: "prompt",
    }),
  ],

  server: {
    port: 8899,
    host: true,
  },
  preview: {
    port: 8899,
    // https: true,
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
