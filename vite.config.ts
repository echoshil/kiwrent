import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  // CRITICAL: Only load server code when running `vite serve` (dev)
  // During `vite build`, this code is skipped completely
  if (command === "serve") {
    // Create a plugin that loads server code safely
    const devServerPlugin = {
      name: "dev-express",
      apply: "serve" as const,
      async configureServer(server: any) {
        // Use dynamic import only when this method is actually called
        const { createServer } = await import("./server/index");
        const app = await createServer();
        server.middlewares.use(app);
        console.log("[EXPRESS] Express server ready");
      },
    };
    plugins.push(devServerPlugin);
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
        external: ["@prisma/client", "@prisma/client/runtime"],
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
