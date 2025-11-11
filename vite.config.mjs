import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { createHtmlPlugin } from "vite-plugin-html"
import tailwindcss from "@tailwindcss/vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, "dashboard.html"),
        scroll: resolve(__dirname, "scroll.html"),
      },
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true, //browsers can handle top-level-await features
    },
  },
  plugins: [createHtmlPlugin(), tailwindcss()],
  publicDir: "data/public",
})
