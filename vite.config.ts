import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  // CRITICAL: Only load server code when running `vite serve` (dev)
  // During `vite build`, skip this completely to avoid static analysis of server imports
  if (command === "serve") {
    plugins.push({
      name: "dev-express-server",
      apply: "serve",
      async configureServer(server: any) {
        try {
          // Use a computed module name so Vite cannot statically analyze it
          // This prevents Vite from seeing "server" as an import during build
          const serverPath = [".", "server", "index"].join("/");
          const mod = await import(/* @vite-ignore */ serverPath);
          const app = await mod.createServer();
          server.middlewares.use(app);
          console.log("[EXPRESS] Dev server ready");
        } catch (err) {
          console.warn("[EXPRESS] Dev server error:", err);
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
