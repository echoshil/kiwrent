import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    react(),
    // Dev server plugin - only loaded when vite serve is running
    {
      name: "express-dev-server",
      apply: "serve",
      async configureServer(server) {
        // Only load server code during development
        try {
          // Use tsx/esm loader to load TypeScript files
          const { createServer } = await import("./server/index.ts");
          const app = await createServer();
          server.middlewares.use(app);
          console.log("[EXPRESS] Dev middleware loaded");
        } catch (err: any) {
          console.warn("[DEV] Warning: Could not load dev server:", err.message);
          // Don't fail the dev server if this doesn't work
        }
      },
    },
  ],

  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    middlewareMode: false,
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
    exclude: ["@prisma/client", "@prisma/client/runtime", "dotenv"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
