import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    manifest: false,
    rollupOptions: {
      input: ["./src/index.tsx", "./src/index.css"],
      output: {
        dir: "dist/client",
        assetFileNames: "[name][extname]",
        entryFileNames: "client.js",
      },
    },
  },
});
