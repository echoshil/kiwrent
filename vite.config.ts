import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  // CRITICAL: Only load server code when running `vite` (dev server)
  // NOT during `vite build` (Netlify production build)
  if (command === "serve") {
    plugins.push({
      name: "dev-server",
      apply: "serve",
      async configureServer(server) {
        try {
          // Only import server code in development serve mode
          const { createServer } = await import("./server");
          const app = await createServer();
          console.log("[EXPRESS] Express server initialized, adding middleware");
          server.middlewares.use(app);
        } catch (err) {
          console.error("[EXPRESS] Error initializing Express:", err);
        }
      },
    });
  }

  return {
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
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});
