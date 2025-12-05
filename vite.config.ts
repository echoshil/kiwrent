import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    middlewareMode: false,
    // Dev server setup is handled by netlify/functions/api.ts or separate server
  },

  build: {
    outDir: "dist/spa",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      external: ["@prisma/client"],
    },
  },

  optimizeDeps: {
    exclude: ["@prisma/client", "@prisma/client/runtime"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
