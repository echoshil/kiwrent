import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [react()];

  // IMPORTANT: Only add dev plugin when actually running dev server, NOT during build
  if (command === "serve") {
    // Dynamically import only in development/serve mode
    require.resolve("./vite.dev-plugin.ts");
    plugins.push({
      name: "dev-server",
      apply: "serve",
      async configureServer(server) {
        const { expressPlugin } = await import("./vite.dev-plugin");
        const plugin = expressPlugin();
        return plugin.configureServer?.(server);
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
