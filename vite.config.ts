import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // Only load express plugin in development mode
  // Use a synchronous check to prevent Vite from analyzing dev files during build
  if (mode === "development" && process.env.NODE_ENV !== "production") {
    // Lazy load the dev plugin to prevent bundling server code
    const devConfig = {
      apply: "serve",
      async configureServer(server: any) {
        try {
          console.log("[EXPRESS] Initializing Express server...");
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
      },
    };
    plugins.push(devConfig);
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
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
    ssr: {
      external: ["@prisma/client"],
    },
  };
});
