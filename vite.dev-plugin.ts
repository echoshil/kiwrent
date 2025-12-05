import { Plugin } from "vite";

// This file is only loaded during development (serve mode)
// It should never be imported during build
export function createDevPlugin(): Plugin {
  return {
    name: "dev-express-server",
    apply: "serve",
    async configureServer(server) {
      // Only import and use server code during serve mode
      try {
        // Dynamically require to avoid bundling during build
        const serverModule = await import("./server/index.js");
        const { createServer } = serverModule;

        if (createServer && typeof createServer === "function") {
          const app = await createServer();
          server.middlewares.use(app);
          console.log("[EXPRESS] Express server ready");
        }
      } catch (err) {
        console.warn("[EXPRESS] Could not load dev server:", err);
      }
    },
  };
}
