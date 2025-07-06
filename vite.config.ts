import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import Pages from "vite-plugin-pages";
// import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ],
  server: {
    port: 3001,
    open: true
  },
  base: mode === "development" ? "/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
