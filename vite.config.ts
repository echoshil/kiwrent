import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  // Only load express plugin in development mode
  if (mode === "development") {
    try {
      const { expressPlugin } = await import("./vite.dev-plugin");
      plugins.push(expressPlugin());
    } catch (error) {
      console.warn("[Vite] Failed to load dev plugin:", error);
    }
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
      minify: "terser",
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
