import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
  },
  plugins: [react(), ...(mode === "development" ? [expressPlugin()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      console.log("[EXPRESS] Initializing Express server...");
      try {
        const { createServer } = await import("./server");
        const app = await createServer();
        console.log(
          "[EXPRESS] Express server initialized, adding middleware",
        );
        server.middlewares.use(app);
        console.log("[EXPRESS] Express middleware added");
      } catch (err) {
        console.error("[EXPRESS] Error initializing Express:", err);
      }
      return undefined;
    },
  };
}
