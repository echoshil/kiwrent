import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  // Add dev server plugin - only applied during serve, never during build
  plugins.push({
    name: "dev-express-server",
    apply: "serve", // This ensures it only runs during vite serve, never during vite build
    async configureServer(server: any) {
      try {
        // Dynamically construct import path to prevent static analysis
        const basePath = process.cwd();
        const serverModule = await import(path.join(basePath, "server/index.ts"));
        const app = await serverModule.createServer();
        server.middlewares.use(app);
        console.log("[EXPRESS] Dev server initialized");
      } catch (err) {
        console.error("[EXPRESS] Error initializing dev server:", err);
      }
    },
  });

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
    optimizeDeps: {
      exclude: ["@prisma/client", "@prisma/client/runtime", "dotenv"],
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
