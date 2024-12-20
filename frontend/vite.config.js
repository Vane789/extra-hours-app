import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve("./src/components"),
      "@scss": path.resolve("./src/scss"),
      "@service": path.resolve("./src/service"),
      "@utils": path.resolve("./src/utils"),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@scss/utils/variables" as *;`,
        },
      },
    },
  },
});
