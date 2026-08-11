import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: mode === "gh-pages" ? "/achikaps/" : "/",

  resolve: {
    alias: {
      "@aircraft": path.resolve(__dirname, "src/aircraft"),
      "@dashboard": path.resolve(__dirname, "src/dashboard"),
      "@resources": path.resolve(__dirname, "src/resources"),
      "@workers": path.resolve(__dirname, "src/workers"),
      "@menus": path.resolve(__dirname, "src/menus"),
      "@roads": path.resolve(__dirname, "src/roads"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@test-situations": path.resolve(__dirname, "src/test-situations"),
    },
  },
}));
