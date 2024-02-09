import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./src/index.tsx",
      output: {
        dir: "dist/client",
        entryFileNames: "client.js",
      },
    },
  },
});
